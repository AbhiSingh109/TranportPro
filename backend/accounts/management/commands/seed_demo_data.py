import datetime
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Agency
from customers.models import Customer
from fleet.models import Vehicle, Driver
from bookings.models import Booking
from trips.models import Trip, TripBooking
from tracking.models import TrackingEvent, Delivery
from billing.models import Invoice, Payment
from expenses.models import Expense

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds initial demonstration data for TransportPro'

    def handle(self, *args, **options):
        self.stdout.write('Seeding TransportPro demonstration data...')

        # 1. Agency
        agency, created = Agency.objects.get_or_create(
            name='National Express Logistics',
            defaults={'address': 'Transport Nagar, Ring Road, Indore, Madhya Pradesh'}
        )

        # 2. Users
        admin_user, _ = User.objects.get_or_create(
            email='admin@transportpro.com',
            defaults={
                'first_name': 'Vikram',
                'last_name': 'Singhania',
                'agency': agency,
                'is_staff': True,
                'is_superuser': True,
            }
        )
        admin_user.set_password('Admin@12345')
        admin_user.save()

        # 3. Customers
        c1, _ = Customer.objects.get_or_create(
            agency=agency,
            customer_name='Tata Motors Supply Chain',
            defaults={
                'company_name': 'Tata Motors Limited',
                'phone_number': '02266658282',
                'email': 'logistics@tatamotors.com',
                'gstin': '27AAACT2727Q1ZW',
                'billing_address': 'Pimpri Industrial Area, Pune, Maharashtra',
                'credit_limit': Decimal('1500000.00'),
            }
        )

        c2, _ = Customer.objects.get_or_create(
            agency=agency,
            customer_name='Reliance Retail Central Hub',
            defaults={
                'company_name': 'Reliance Retail Ventures Ltd',
                'phone_number': '02235553000',
                'email': 'freight@relianceretail.com',
                'gstin': '24AAACR4998K1ZT',
                'billing_address': 'Reliance Corporate Park, Navi Mumbai',
                'credit_limit': Decimal('2500000.00'),
            }
        )

        # 4. Fleet Vehicles
        v1, _ = Vehicle.objects.get_or_create(
            agency=agency,
            registration_number='MP09AB5678',
            defaults={
                'vehicle_type': 'Tata Signa 4825.TK (Multi-Axle)',
                'capacity_tons': Decimal('28.00'),
                'ownership_type': 'owned',
                'status': 'available',
                'insurance_expiry': datetime.date.today() + datetime.timedelta(days=180),
                'fitness_expiry': datetime.date.today() + datetime.timedelta(days=240),
            }
        )

        v2, _ = Vehicle.objects.get_or_create(
            agency=agency,
            registration_number='MH12CD9012',
            defaults={
                'vehicle_type': 'Ashok Leyland Ecomet 1215',
                'capacity_tons': Decimal('12.00'),
                'ownership_type': 'leased',
                'status': 'on_trip',
                'insurance_expiry': datetime.date.today() + datetime.timedelta(days=90),
                'fitness_expiry': datetime.date.today() + datetime.timedelta(days=120),
            }
        )

        # 5. Drivers
        d1, _ = Driver.objects.get_or_create(
            agency=agency,
            full_name='Rameshwar Yadav',
            defaults={
                'phone_number': '9893123456',
                'licence_number': 'MP0920150045678',
                'licence_expiry': datetime.date.today() + datetime.timedelta(days=720),
                'employment_status': 'active',
                'address': 'Vijay Nagar, Indore',
            }
        )

        d2, _ = Driver.objects.get_or_create(
            agency=agency,
            full_name='Gurpreet Singh',
            defaults={
                'phone_number': '9876501234',
                'licence_number': 'PB1020180098765',
                'licence_expiry': datetime.date.today() + datetime.timedelta(days=450),
                'employment_status': 'active',
                'address': 'Transport Nagar, Ludhiana',
            }
        )

        # 6. Bookings
        today = datetime.date.today()
        b1, _ = Booking.objects.get_or_create(
            agency=agency,
            customer=c1,
            origin='Pune',
            destination='Indore',
            defaults={
                'booking_date': today - datetime.timedelta(days=2),
                'consignor_name': 'Tata Motors Plant 1, Pune',
                'consignee_name': 'Anand Automotives, Indore',
                'goods_description': 'Commercial Vehicle Chassis Parts & Gearboxes',
                'quantity': Decimal('42.00'),
                'packaging_type': 'Steel Crates',
                'actual_weight_kg': Decimal('14500.00'),
                'declared_value': Decimal('1850000.00'),
                'freight_amount': Decimal('78000.00'),
                'additional_charges': Decimal('2500.00'),
                'payment_type': 'to_be_billed',
                'lr_number': 'LR-2026-00101',
                'status': 'in_transit',
                'created_by': admin_user,
            }
        )

        b2, _ = Booking.objects.get_or_create(
            agency=agency,
            customer=c2,
            origin='Indore',
            destination='Delhi NCR',
            defaults={
                'booking_date': today,
                'consignor_name': 'Reliance Logistics Warehouse, Indore',
                'consignee_name': 'Reliance Central Fulfillment, Greater Noida',
                'goods_description': 'FMCG Packaged Food & Consumer Electronics',
                'quantity': Decimal('350.00'),
                'packaging_type': 'Corrugated Cartons',
                'actual_weight_kg': Decimal('8900.00'),
                'declared_value': Decimal('3400000.00'),
                'freight_amount': Decimal('92000.00'),
                'additional_charges': Decimal('3000.00'),
                'payment_type': 'paid',
                'lr_number': 'LR-2026-00102',
                'status': 'confirmed',
                'created_by': admin_user,
            }
        )

        # 7. Trip
        t1, _ = Trip.objects.get_or_create(
            agency=agency,
            origin='Pune',
            destination='Indore',
            defaults={
                'departure_date': today - datetime.timedelta(days=1),
                'vehicle': v2,
                'driver': d1,
                'status': 'in_transit',
                'remarks': 'Via Nashik - Dhule - NH52 expressway route',
                'created_by': admin_user,
            }
        )
        TripBooking.objects.get_or_create(trip=t1, booking=b1)

        # 8. Tracking
        TrackingEvent.objects.get_or_create(
            booking=b1,
            status='dispatched',
            defaults={
                'event_time': datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=20),
                'location': 'Pune Hub Hub-01',
                'remarks': 'Vehicle loaded and dispatched with seal #TK9921',
                'updated_by': admin_user,
            }
        )
        TrackingEvent.objects.get_or_create(
            booking=b1,
            status='in_transit',
            defaults={
                'event_time': datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=6),
                'location': 'Dhule Bypass Toll Plaza',
                'remarks': 'Passing on schedule without issues',
                'updated_by': admin_user,
            }
        )

        # 9. Invoice & Payment
        inv1, _ = Invoice.objects.get_or_create(
            agency=agency,
            customer=c1,
            defaults={
                'invoice_date': today - datetime.timedelta(days=1),
                'due_date': today + datetime.timedelta(days=14),
                'freight_amount': Decimal('78000.00'),
                'loading_charges': Decimal('1500.00'),
                'unloading_charges': Decimal('1000.00'),
                'additional_charges': Decimal('0.00'),
                'gst_rate': Decimal('5.00'),
                'status': 'partially_paid',
                'created_by': admin_user,
            }
        )
        inv1.bookings.add(b1)

        Payment.objects.get_or_create(
            invoice=inv1,
            reference_number='CMS/NEFT/881294',
            defaults={
                'payment_date': today,
                'amount': Decimal('50000.00'),
                'payment_mode': 'bank_transfer',
                'notes': 'Part payment on bill submission',
                'recorded_by': admin_user,
            }
        )

        # 10. Expenses
        Expense.objects.get_or_create(
            agency=agency,
            trip=t1,
            category='fuel',
            defaults={
                'expense_date': today - datetime.timedelta(days=1),
                'amount': Decimal('22500.00'),
                'description': 'Diesel 240L at Indian Oil NH52',
                'vehicle': v2,
                'recorded_by': admin_user,
            }
        )
        Expense.objects.get_or_create(
            agency=agency,
            trip=t1,
            category='toll',
            defaults={
                'expense_date': today - datetime.timedelta(days=1),
                'amount': Decimal('3200.00'),
                'description': 'FASTag automatic debits across 6 toll gates',
                'vehicle': v2,
                'recorded_by': admin_user,
            }
        )

        self.stdout.write(self.style.SUCCESS(
            'Successfully seeded TransportPro demo data!\n'
            'Admin Login: admin@transportpro.com / Admin@12345\n'
            'Agency: National Express Logistics'
        ))

