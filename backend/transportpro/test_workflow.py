import datetime
from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from accounts.models import Agency
from customers.models import Customer
from fleet.models import Vehicle, Driver
from bookings.models import Booking
from trips.models import Trip, TripBooking
from tracking.models import TrackingEvent, Delivery
from billing.models import Invoice, Payment
from expenses.models import Expense

User = get_user_model()


class TransportProWorkflowTests(TestCase):
    """End-to-end integration test of the TransportPro transport agency management system."""

    def setUp(self):
        self.client = APIClient()
        self.agency = Agency.objects.create(name="SuperFast Transport Logistics", address="Mumbai, Maharashtra")
        self.user = User.objects.create_user(
            email="owner@superfast.com",
            password="StrongPassword123!",
            first_name="Rajesh",
            last_name="Kumar",
            agency=self.agency,
            is_staff=True,
        )

    def test_end_to_end_workflow(self):
        # 1. Login & Token Authentication
        login_res = self.client.post('/api/v1/auth/login/', {
            'email': 'owner@superfast.com',
            'password': 'StrongPassword123!'
        })
        self.assertEqual(login_res.status_code, 200)
        token = login_res.data['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

        # 2. Verify /api/v1/auth/me/
        me_res = self.client.get('/api/v1/auth/me/')
        self.assertEqual(me_res.status_code, 200)
        self.assertEqual(me_res.data['email'], 'owner@superfast.com')

        # 3. Create Customer
        cust_res = self.client.post('/api/v1/customers/', {
            'customer_name': 'Acme Manufacturing Ltd',
            'company_name': 'Acme Corp',
            'phone_number': '9876543210',
            'email': 'shipping@acme.com',
            'gstin': '27ABCDE1234F1Z5',
            'billing_address': 'Plot 42, MIDC, Pune',
            'credit_limit': '500000.00'
        })
        self.assertEqual(cust_res.status_code, 201)
        customer_id = cust_res.data['id']

        # 4. Create Fleet (Vehicle & Driver)
        veh_res = self.client.post('/api/v1/vehicles/', {
            'registration_number': 'MH12AB1234',
            'vehicle_type': 'Tata 1613 Heavy Truck',
            'capacity_tons': '16.00',
            'ownership_type': 'owned',
            'status': 'available'
        })
        self.assertEqual(veh_res.status_code, 201)
        vehicle_id = veh_res.data['id']

        drv_res = self.client.post('/api/v1/drivers/', {
            'full_name': 'Suresh Shinde',
            'phone_number': '9822001122',
            'licence_number': 'MH1220190012345',
            'employment_status': 'active'
        })
        self.assertEqual(drv_res.status_code, 201)
        driver_id = drv_res.data['id']

        # 5. Create Booking
        booking_res = self.client.post('/api/v1/bookings/', {
            'customer': customer_id,
            'booking_date': str(datetime.date.today()),
            'consignor_name': 'Acme Mfg, Pune',
            'consignor_address': 'MIDC Pune',
            'consignee_name': 'Global Retail, Delhi',
            'consignee_address': 'Okhla Phase 3, Delhi',
            'origin': 'Pune',
            'destination': 'Delhi',
            'goods_description': 'Auto spare parts in 50 wooden crates',
            'quantity': '50.00',
            'actual_weight_kg': '4500.00',
            'declared_value': '1250000.00',
            'freight_amount': '65000.00',
            'additional_charges': '2000.00',
            'payment_type': 'to_be_billed'
        })
        self.assertEqual(booking_res.status_code, 201)
        booking_id = booking_res.data['id']
        booking_no = booking_res.data['booking_number']
        self.assertTrue(booking_no.startswith(f"BK-{self.agency.id:04d}-"))

        # Confirm booking
        confirm_res = self.client.post(f'/api/v1/bookings/{booking_id}/confirm/')
        self.assertEqual(confirm_res.status_code, 200)
        self.assertEqual(confirm_res.data['status'], 'confirmed')

        # 6. Create Trip & Assign Vehicle and Driver
        trip_res = self.client.post('/api/v1/trips/', {
            'origin': 'Pune',
            'destination': 'Delhi',
            'departure_date': str(datetime.date.today()),
            'vehicle': vehicle_id,
            'driver': driver_id,
            'status': 'planned'
        })
        self.assertEqual(trip_res.status_code, 201)
        trip_id = trip_res.data['id']

        # Add booking to trip
        add_b_res = self.client.post(f'/api/v1/trips/{trip_id}/add-booking/', {'booking_id': booking_id})
        self.assertEqual(add_b_res.status_code, 200)

        # Dispatch trip
        dispatch_res = self.client.post(f'/api/v1/trips/{trip_id}/dispatch/')
        self.assertEqual(dispatch_res.status_code, 200)
        self.assertEqual(dispatch_res.data['status'], 'dispatched')

        # 7. Add Tracking Event
        track_res = self.client.post('/api/v1/tracking/', {
            'booking': booking_id,
            'status': 'in_transit',
            'event_time': datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'location': 'Nashik Bypass',
            'remarks': 'Crossed Nashik toll without delays'
        })
        self.assertEqual(track_res.status_code, 201)

        # 8. Record Delivery
        deliv_res = self.client.post('/api/v1/deliveries/', {
            'booking': booking_id,
            'delivery_datetime': datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'receiver_name': 'Amit Verma',
            'receiver_contact': '9811223344',
            'delivered_quantity': '50.00',
            'delivery_remarks': 'Delivered in good condition with seal intact',
            'is_partial': False
        })
        self.assertEqual(deliv_res.status_code, 201)

        # Complete trip
        comp_trip_res = self.client.post(f'/api/v1/trips/{trip_id}/complete/')
        self.assertEqual(comp_trip_res.status_code, 200)

        # 9. Invoicing & Payment
        inv_res = self.client.post('/api/v1/invoices/', {
            'customer': customer_id,
            'invoice_date': str(datetime.date.today()),
            'due_date': str(datetime.date.today() + datetime.timedelta(days=15)),
            'freight_amount': '65000.00',
            'loading_charges': '1000.00',
            'unloading_charges': '1000.00',
            'additional_charges': '0.00',
            'gst_rate': '5.00',  # 5% GST
            'status': 'unpaid'
        })
        self.assertEqual(inv_res.status_code, 201)
        invoice_id = inv_res.data['id']
        self.assertEqual(Decimal(inv_res.data['subtotal']), Decimal('67000.00'))
        self.assertEqual(Decimal(inv_res.data['gst_amount']), Decimal('3350.00'))
        self.assertEqual(Decimal(inv_res.data['total_amount']), Decimal('70350.00'))

        # Record payment
        pay_res = self.client.post('/api/v1/payments/', {
            'invoice': invoice_id,
            'payment_date': str(datetime.date.today()),
            'amount': '70350.00',
            'payment_mode': 'bank_transfer',
            'reference_number': 'NEFT202611119999'
        })
        self.assertEqual(pay_res.status_code, 201)

        # Verify outstanding amount on invoice is now 0
        inv_check = self.client.get(f'/api/v1/invoices/{invoice_id}/')
        self.assertEqual(Decimal(inv_check.data['outstanding_amount']), Decimal('0.00'))

        # 10. Record Expense
        exp_res = self.client.post('/api/v1/expenses/', {
            'expense_date': str(datetime.date.today()),
            'category': 'fuel',
            'amount': '18500.00',
            'description': 'Diesel at Indian Oil Nashik',
            'vehicle': vehicle_id,
            'trip': trip_id
        })
        self.assertEqual(exp_res.status_code, 201)

        # 11. Reports & Dashboard Stats
        dash_res = self.client.get('/api/v1/dashboard/stats/')
        self.assertEqual(dash_res.status_code, 200)
        self.assertGreaterEqual(dash_res.data['bookings_today'], 1)
        self.assertEqual(Decimal(str(dash_res.data['monthly_revenue'])), Decimal('70350.00'))

        rev_res = self.client.get('/api/v1/reports/revenue/')
        self.assertEqual(rev_res.status_code, 200)
        self.assertEqual(Decimal(str(rev_res.data['total_collected'])), Decimal('70350.00'))

        exp_rep_res = self.client.get('/api/v1/reports/expenses/')
        self.assertEqual(exp_rep_res.status_code, 200)
        self.assertEqual(Decimal(str(exp_rep_res.data['total_expenses'])), Decimal('18500.00'))
