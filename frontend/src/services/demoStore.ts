// Offline / Vercel demo data store with local persistence
const STORAGE_PREFIX = 'transportpro_demo_'

export const initialCustomers = [
  {
    id: 1,
    customer_name: 'Tata Motors Supply Chain',
    company_name: 'Tata Motors Limited',
    phone_number: '02266658282',
    email: 'logistics@tatamotors.com',
    gstin: '27AAACT2727Q1ZW',
    billing_address: 'Pimpri Industrial Area, Pune, Maharashtra',
    credit_limit: '1500000.00',
    contact_person: 'Rajiv Mehra',
    is_active: true,
  },
  {
    id: 2,
    customer_name: 'Reliance Retail Central Hub',
    company_name: 'Reliance Retail Ventures Ltd',
    phone_number: '02235553000',
    email: 'freight@relianceretail.com',
    gstin: '24AAACR4998K1ZT',
    billing_address: 'Reliance Corporate Park, Navi Mumbai',
    credit_limit: '2500000.00',
    contact_person: 'Sandeep Patil',
    is_active: true,
  },
  {
    id: 3,
    customer_name: 'Mahindra Logistics Direct',
    company_name: 'Mahindra & Mahindra Ltd',
    phone_number: '02224901441',
    email: 'dispatch@mahindralogistics.com',
    gstin: '27AAACM1234F1Z1',
    billing_address: 'Akurli Road, Kandivali East, Mumbai',
    credit_limit: '2000000.00',
    contact_person: 'Vikram Shinde',
    is_active: true,
  },
  {
    id: 4,
    customer_name: 'Havells Consumer Appliances',
    company_name: 'Havells India Limited',
    phone_number: '01204771000',
    email: 'supply@havells.com',
    gstin: '06AAACH1234A1Z2',
    billing_address: 'Industrial Area Phase 2, Noida, UP',
    credit_limit: '1000000.00',
    contact_person: 'Amitabh Sen',
    is_active: true,
  },
]

export const initialVehicles = [
  {
    id: 1,
    registration_number: 'MP09AB5678',
    vehicle_type: 'Tata Signa 4825.TK (Multi-Axle)',
    capacity_tons: '28.00',
    ownership_type: 'owned',
    status: 'available',
    insurance_expiry: '2027-05-15',
    fitness_expiry: '2027-08-20',
  },
  {
    id: 2,
    registration_number: 'MH12CD9012',
    vehicle_type: 'Ashok Leyland Ecomet 1215',
    capacity_tons: '12.00',
    ownership_type: 'leased',
    status: 'on_trip',
    insurance_expiry: '2026-12-10',
    fitness_expiry: '2027-02-28',
  },
  {
    id: 3,
    registration_number: 'DL01EF3456',
    vehicle_type: 'BharatBenz 2823R Heavy Truck',
    capacity_tons: '20.00',
    ownership_type: 'owned',
    status: 'available',
    insurance_expiry: '2027-03-30',
    fitness_expiry: '2027-06-15',
  },
]

export const initialDrivers = [
  {
    id: 1,
    full_name: 'Rameshwar Yadav',
    phone_number: '9893123456',
    licence_number: 'MP0920150045678',
    licence_expiry: '2028-11-20',
    emergency_contact_name: 'Sunita Yadav',
    emergency_contact_phone: '9893199999',
    employment_status: 'active',
  },
  {
    id: 2,
    full_name: 'Gurpreet Singh',
    phone_number: '9876501234',
    licence_number: 'PB1020180098765',
    licence_expiry: '2027-09-15',
    emergency_contact_name: 'Harbhajan Singh',
    emergency_contact_phone: '9876588888',
    employment_status: 'active',
  },
  {
    id: 3,
    full_name: 'Anil Kumar Sharma',
    phone_number: '9811234567',
    licence_number: 'DL0420160012399',
    licence_expiry: '2029-01-10',
    emergency_contact_name: 'Rekha Sharma',
    emergency_contact_phone: '9811288888',
    employment_status: 'active',
  },
]

export const initialBookings = [
  {
    id: 1,
    booking_number: 'BK-0001-000101',
    booking_date: '2026-11-10',
    customer: 1,
    customer_name: 'Tata Motors Supply Chain',
    consignor_name: 'Tata Motors Plant 1, Pune',
    consignor_address: 'Pimpri MIDC, Pune 411018',
    consignor_phone: '9822001122',
    consignee_name: 'Anand Automotives, Indore',
    consignee_address: 'Sanwer Road Industrial Area, Indore 452015',
    consignee_phone: '9893122334',
    origin: 'Pune',
    destination: 'Indore',
    goods_description: 'Commercial Vehicle Chassis Parts & Gearboxes',
    quantity: '42.00',
    packaging_type: 'Steel Crates',
    actual_weight_kg: '14500.00',
    declared_value: '1850000.00',
    freight_amount: '78000.00',
    additional_charges: '2500.00',
    payment_type: 'to_be_billed',
    lr_number: 'LR-2026-00101',
    status: 'in_transit',
    special_instructions: 'Handle with hydraulic crane only',
  },
  {
    id: 2,
    booking_number: 'BK-0001-000102',
    booking_date: '2026-11-11',
    customer: 2,
    customer_name: 'Reliance Retail Central Hub',
    consignor_name: 'Reliance Logistics Warehouse, Indore',
    consignor_address: 'Rau-Pithampur Road, Indore',
    consignor_phone: '9893155555',
    consignee_name: 'Reliance Central Fulfillment, Greater Noida',
    consignee_address: 'Ecotech 2, Greater Noida, UP',
    consignee_phone: '9811255555',
    origin: 'Indore',
    destination: 'Delhi NCR',
    goods_description: 'FMCG Packaged Food & Consumer Electronics',
    quantity: '350.00',
    packaging_type: 'Corrugated Cartons',
    actual_weight_kg: '8900.00',
    declared_value: '3400000.00',
    freight_amount: '92000.00',
    additional_charges: '3000.00',
    payment_type: 'paid',
    lr_number: 'LR-2026-00102',
    status: 'confirmed',
    special_instructions: 'Keep dry and away from heat',
  },
]

export const initialTrips = [
  {
    id: 1,
    trip_number: 'TR-0001-000001',
    origin: 'Pune',
    destination: 'Indore',
    departure_date: '2026-11-11',
    expected_arrival: '2026-11-13',
    vehicle: 'MH12CD9012',
    driver: 'Rameshwar Yadav',
    status: 'in_transit',
    remarks: 'Via Nashik - Dhule - NH52 expressway route',
  },
]

export const initialInvoices = [
  {
    id: 1,
    invoice_number: 'INV-0001-000001',
    invoice_date: '2026-11-11',
    due_date: '2026-11-25',
    customer: 'Tata Motors Supply Chain',
    subtotal: '80500.00',
    gst_amount: '4025.00',
    total_amount: '84525.00',
    amount_paid: '50000.00',
    outstanding_amount: '34525.00',
    status: 'partially_paid',
  },
]

export const initialExpenses = [
  {
    id: 1,
    expense_date: '2026-11-11',
    category: 'fuel',
    amount: '22500.00',
    description: 'Diesel 240L at Indian Oil NH52',
    vehicle: 'MH12CD9012',
    trip: 'TR-0001-000001',
  },
  {
    id: 2,
    expense_date: '2026-11-11',
    category: 'toll',
    amount: '3200.00',
    description: 'FASTag automatic debits across 6 toll plazas',
    vehicle: 'MH12CD9012',
    trip: 'TR-0001-000001',
  },
]

export const initialTrackingEvents = [
  {
    id: 1,
    booking: 1,
    status: 'dispatched',
    event_time: '2026-11-11T08:30:00Z',
    location: 'Pune Central Hub (MIDC)',
    remarks: 'Loaded onto truck MH12CD9012 with security seal #TK9921',
  },
  {
    id: 2,
    booking: 1,
    status: 'in_transit',
    event_time: '2026-11-11T14:45:00Z',
    location: 'Dhule Bypass Toll Plaza',
    remarks: 'Crossed checkpoint on schedule, weather clear',
  },
]

function getStore<T>(key: string, defaultData: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (!raw) {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(defaultData))
      return defaultData
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(defaultData) && (!Array.isArray(parsed) || parsed.length === 0)) {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(defaultData))
      return defaultData
    }
    return parsed
  } catch {
    return defaultData
  }
}

function setStore<T>(key: string, data: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data))
  } catch {}
}

export const demoStore = {
  getCustomers: () => getStore('customers', initialCustomers),
  getCustomer: (id: number) => {
    return demoStore.getCustomers().find((c: any) => c.id === Number(id)) || null
  },
  addCustomer: (c: any) => {
    const list = demoStore.getCustomers()
    const item = {
      ...c,
      id: Date.now(),
      credit_limit: c.credit_limit || '0.00',
      is_active: c.is_active !== undefined ? c.is_active : true,
    }
    list.unshift(item)
    setStore('customers', list)
    return item
  },
  updateCustomer: (id: number, patch: any) => {
    const list = demoStore.getCustomers()
    const idx = list.findIndex((c: any) => c.id === Number(id))
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...patch }
      setStore('customers', list)
      return list[idx]
    }
    return null
  },

  getVehicles: () => getStore('vehicles', initialVehicles),
  addVehicle: (v: any) => {
    const list = demoStore.getVehicles()
    const item = {
      ...v,
      id: Date.now(),
      status: v.status || 'available',
      capacity_tons: v.capacity_tons || '10.00',
      ownership_type: v.ownership_type || 'owned',
    }
    list.unshift(item)
    setStore('vehicles', list)
    return item
  },
  updateVehicle: (id: number, patch: any) => {
    const list = demoStore.getVehicles()
    const idx = list.findIndex((v: any) => v.id === Number(id))
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...patch }
      setStore('vehicles', list)
      return list[idx]
    }
    return null
  },

  getDrivers: () => getStore('drivers', initialDrivers),
  addDriver: (d: any) => {
    const list = demoStore.getDrivers()
    const item = {
      ...d,
      id: Date.now(),
      employment_status: d.employment_status || 'active',
    }
    list.unshift(item)
    setStore('drivers', list)
    return item
  },
  updateDriver: (id: number, patch: any) => {
    const list = demoStore.getDrivers()
    const idx = list.findIndex((d: any) => d.id === Number(id))
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...patch }
      setStore('drivers', list)
      return list[idx]
    }
    return null
  },

  getBookings: () => getStore('bookings', initialBookings),
  getBooking: (id: number) => {
    return demoStore.getBookings().find((b: any) => b.id === Number(id)) || initialBookings[0]
  },
  addBooking: (b: any) => {
    const list = demoStore.getBookings()
    const customers = demoStore.getCustomers()
    let custName = b.customer_name
    if (b.customer) {
      const cObj = customers.find((c: any) => String(c.id) === String(b.customer) || c.customer_name === b.customer)
      if (cObj) custName = cObj.customer_name
    }
    const seq = list.length + 101
    const item = {
      ...b,
      id: Date.now(),
      customer_name: custName || 'Direct Consignor',
      booking_number: `BK-0001-000${seq}`,
      lr_number: `LR-2026-000${seq}`,
      status: 'confirmed',
    }
    list.unshift(item)
    setStore('bookings', list)
    return item
  },
  updateBookingStatus: (id: number, status: string) => {
    const list = demoStore.getBookings()
    const item = list.find((b: any) => b.id === Number(id))
    if (item) {
      item.status = status
      setStore('bookings', list)
    }
    return item
  },

  getTrips: () => getStore('trips', initialTrips),
  getTrip: (id: number) => {
    return demoStore.getTrips().find((t: any) => t.id === Number(id)) || null
  },
  addTrip: (t: any) => {
    const list = demoStore.getTrips()
    const vehicles = demoStore.getVehicles()
    const drivers = demoStore.getDrivers()

    let vehicleStr = t.vehicle
    if (t.vehicle) {
      const vObj = vehicles.find((v: any) => String(v.id) === String(t.vehicle) || v.registration_number === t.vehicle)
      if (vObj) vehicleStr = vObj.registration_number
    }

    let driverStr = t.driver
    if (t.driver) {
      const dObj = drivers.find((d: any) => String(d.id) === String(t.driver) || d.full_name === t.driver)
      if (dObj) driverStr = dObj.full_name
    }

    const item = {
      ...t,
      id: Date.now(),
      trip_number: `TR-0001-${String(list.length + 1).padStart(6, '0')}`,
      vehicle: vehicleStr || null,
      driver: driverStr || null,
      status: t.status || 'planned',
    }
    list.unshift(item)
    setStore('trips', list)
    return item
  },
  updateTripStatus: (id: number, status: string) => {
    const list = demoStore.getTrips()
    const item = list.find((t: any) => t.id === Number(id))
    if (item) {
      item.status = status
      setStore('trips', list)
    }
    return item
  },

  getInvoices: () => getStore('invoices', initialInvoices),
  getInvoice: (id: number) => {
    return demoStore.getInvoices().find((i: any) => i.id === Number(id)) || null
  },
  addInvoice: (inv: any) => {
    const list = demoStore.getInvoices()
    const customers = demoStore.getCustomers()
    let custName = inv.customer
    if (inv.customer) {
      const c = customers.find((c: any) => String(c.id) === String(inv.customer) || c.customer_name === inv.customer)
      if (c) custName = c.customer_name
    }

    const subtotal = Number(inv.freight_amount || 0) + Number(inv.loading_charges || 0) + Number(inv.unloading_charges || 0)
    const gstRate = Number(inv.gst_rate || 5)
    const gst = (subtotal * (gstRate / 100))
    const total = subtotal + gst
    const item = {
      ...inv,
      id: Date.now(),
      customer: custName || 'Direct Billing',
      invoice_number: `INV-0001-${String(list.length + 1).padStart(6, '0')}`,
      subtotal: subtotal.toFixed(2),
      gst_amount: gst.toFixed(2),
      total_amount: total.toFixed(2),
      amount_paid: '0.00',
      outstanding_amount: total.toFixed(2),
      status: 'unpaid',
    }
    list.unshift(item)
    setStore('invoices', list)
    return item
  },
  recordPayment: (invoiceId: number, amount: string) => {
    const list = demoStore.getInvoices()
    const item = list.find((i: any) => i.id === Number(invoiceId))
    if (item) {
      const paid = Number(item.amount_paid || 0) + Number(amount)
      const total = Number(item.total_amount)
      const outstanding = Math.max(0, total - paid)
      item.amount_paid = paid.toFixed(2)
      item.outstanding_amount = outstanding.toFixed(2)
      item.status = outstanding <= 0 ? 'paid' : 'partially_paid'
      setStore('invoices', list)
    }
    return item
  },

  getExpenses: () => getStore('expenses', initialExpenses),
  addExpense: (e: any) => {
    const list = demoStore.getExpenses()
    const vehicles = demoStore.getVehicles()
    const trips = demoStore.getTrips()

    let vehStr = e.vehicle
    if (e.vehicle) {
      const v = vehicles.find((v: any) => String(v.id) === String(e.vehicle) || v.registration_number === e.vehicle)
      if (v) vehStr = v.registration_number
    }

    let tripStr = e.trip
    if (e.trip) {
      const t = trips.find((t: any) => String(t.id) === String(e.trip) || t.trip_number === e.trip)
      if (t) tripStr = t.trip_number
    }

    const item = {
      ...e,
      id: Date.now(),
      vehicle: vehStr || null,
      trip: tripStr || null,
    }
    list.unshift(item)
    setStore('expenses', list)
    return item
  },

  getTracking: (lr: string) => {
    const events = getStore('tracking', initialTrackingEvents)
    const bookings = demoStore.getBookings()
    const booking = bookings.find((b: any) => b.lr_number === lr || b.booking_number === lr) || bookings[0]
    return {
      lr_number: booking.lr_number,
      booking_number: booking.booking_number,
      origin: booking.origin,
      destination: booking.destination,
      status: booking.status,
      events,
    }
  },

  getStats: () => {
    const bookings = demoStore.getBookings()
    const trips = demoStore.getTrips()
    const vehicles = demoStore.getVehicles()
    const invoices = demoStore.getInvoices()
    const expenses = demoStore.getExpenses()

    const totalRevenue = invoices.reduce((sum: number, i: any) => sum + Number(i.amount_paid || 0), 0)
    const totalExpenses = expenses.reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0)

    return {
      bookings_today: bookings.length,
      bookings_this_month: bookings.length + 18,
      active_trips: trips.filter((t: any) => t.status === 'in_transit' || t.status === 'dispatched').length,
      in_transit: bookings.filter((b: any) => b.status === 'in_transit').length,
      pending_deliveries: bookings.filter((b: any) => b.status === 'in_transit' || b.status === 'confirmed').length,
      completed_deliveries: 42,
      active_vehicles: vehicles.filter((v: any) => v.status === 'available').length,
      monthly_revenue: totalRevenue || 1250000,
      total_expenses_this_month: totalExpenses || 320000,
    }
  },
}
