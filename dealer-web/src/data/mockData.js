// CanOps Dealer Web — Mock Data

export const dealer = {
  id: 'D001',
  name: 'Sri Murugan Water Depot',
  owner: 'Rajan Krishnamurthy',
  phone: '+91 98412 55678',
  address: '42, Anna Nagar East, Chennai - 600 102',
  gstin: '33AABCS1429B1ZB',
  zones: ['Anna Nagar East', 'Anna Nagar West', 'Kilpauk', 'Aminjikarai'],
  plan: 'Pro',
  since: '2024-01-15',
};

export const deliveryPersonnel = [
  { id: 'DP001', name: 'Murugan S', phone: '+91 94451 12345', zone: 'Anna Nagar East', vehicle: 'Two-Wheeler', status: 'active', deliveriesToday: 18, totalDeliveries: 1240 },
  { id: 'DP002', name: 'Selvaraj K', phone: '+91 94452 23456', zone: 'Anna Nagar West', vehicle: 'Three-Wheeler', status: 'active', deliveriesToday: 22, totalDeliveries: 980 },
  { id: 'DP003', name: 'Vijay R', phone: '+91 94453 34567', zone: 'Kilpauk', vehicle: 'Two-Wheeler', status: 'active', deliveriesToday: 15, totalDeliveries: 756 },
  { id: 'DP004', name: 'Anbu T', phone: '+91 94454 45678', zone: 'Aminjikarai', vehicle: 'Two-Wheeler', status: 'active', deliveriesToday: 20, totalDeliveries: 1102 },
  { id: 'DP005', name: 'Karthi M', phone: '+91 94455 56789', zone: 'Anna Nagar East', vehicle: 'Three-Wheeler', status: 'inactive', deliveriesToday: 0, totalDeliveries: 430 },
];

export const customers = [
  { id: 'C001', name: 'Priya Sharma', phone: '+91 98400 11111', address: '12/4 Anna Nagar East, Chennai', zone: 'Anna Nagar East', walletBalance: 450, outstandingDues: 0, status: 'active', subscription: 'daily', cansPerOrder: 1, orderCount: 87, lastOrder: '2026-06-22' },
  { id: 'C002', name: 'Ramesh Babu', phone: '+91 98400 22222', address: '7 10th St, Anna Nagar West', zone: 'Anna Nagar West', walletBalance: 120, outstandingDues: 240, status: 'active', subscription: 'alternate', cansPerOrder: 2, orderCount: 45, lastOrder: '2026-06-21' },
  { id: 'C003', name: 'Kavitha Office', phone: '+91 98400 33333', address: '3rd Floor, KK Nagar, Kilpauk', zone: 'Kilpauk', walletBalance: 800, outstandingDues: 0, status: 'active', subscription: 'daily', cansPerOrder: 3, orderCount: 120, lastOrder: '2026-06-22' },
  { id: 'C004', name: 'Suresh Kumar', phone: '+91 98400 44444', address: '5/1 Aminjikarai Main Rd', zone: 'Aminjikarai', walletBalance: 0, outstandingDues: 480, status: 'active', subscription: 'custom', cansPerOrder: 1, orderCount: 32, lastOrder: '2026-06-20' },
  { id: 'C005', name: 'Lakshmi Devi', phone: '+91 98400 55555', address: '23 Srinivasa Nagar, Kilpauk', zone: 'Kilpauk', walletBalance: 350, outstandingDues: 0, status: 'active', subscription: 'daily', cansPerOrder: 1, orderCount: 67, lastOrder: '2026-06-22' },
  { id: 'C006', name: 'Venkatesh Rao', phone: '+91 98400 66666', address: '8/2 Anna Nagar East', zone: 'Anna Nagar East', walletBalance: 90, outstandingDues: 160, status: 'active', subscription: 'alternate', cansPerOrder: 1, orderCount: 29, lastOrder: '2026-06-21' },
  { id: 'C007', name: 'Meenakshi Sundaram', phone: '+91 98400 77777', address: '14 Poonamallee High Rd, Aminjikarai', zone: 'Aminjikarai', walletBalance: 600, outstandingDues: 0, status: 'active', subscription: 'daily', cansPerOrder: 2, orderCount: 95, lastOrder: '2026-06-22' },
  { id: 'C008', name: 'Dinesh Kannan', phone: '+91 98400 88888', address: '2 Nehru Colony, Anna Nagar West', zone: 'Anna Nagar West', walletBalance: 0, outstandingDues: 0, status: 'inactive', subscription: 'none', cansPerOrder: 1, orderCount: 14, lastOrder: '2026-05-30' },
  { id: 'C009', name: 'Saranya R', phone: '+91 98400 99999', address: '11 Thirumalai Nagar, Kilpauk', zone: 'Kilpauk', walletBalance: 210, outstandingDues: 80, status: 'active', subscription: 'daily', cansPerOrder: 1, orderCount: 55, lastOrder: '2026-06-22' },
  { id: 'C010', name: 'Arun Tech Solutions', phone: '+91 98401 00000', address: '7th Floor, Olympia Tower, Anna Nagar', zone: 'Anna Nagar East', walletBalance: 1200, outstandingDues: 0, status: 'active', subscription: 'daily', cansPerOrder: 5, orderCount: 180, lastOrder: '2026-06-22' },
];

export const orders = [
  { id: 'ORD-2001', customerId: 'C001', customerName: 'Priya Sharma', zone: 'Anna Nagar East', deliveryPersonId: 'DP001', deliveryPersonName: 'Murugan S', cans: 1, amount: 50, slot: 'morning', status: 'delivered', paymentMode: 'wallet', time: '2026-06-23 07:42', address: '12/4 Anna Nagar East, Chennai' },
  { id: 'ORD-2002', customerId: 'C003', customerName: 'Kavitha Office', zone: 'Kilpauk', deliveryPersonId: 'DP003', deliveryPersonName: 'Vijay R', cans: 3, amount: 150, slot: 'morning', status: 'delivered', paymentMode: 'wallet', time: '2026-06-23 08:15', address: '3rd Floor, KK Nagar, Kilpauk' },
  { id: 'ORD-2003', customerId: 'C002', customerName: 'Ramesh Babu', zone: 'Anna Nagar West', deliveryPersonId: 'DP002', deliveryPersonName: 'Selvaraj K', cans: 2, amount: 100, slot: 'morning', status: 'in-transit', paymentMode: 'cod', time: '2026-06-23 08:30', address: '7 10th St, Anna Nagar West' },
  { id: 'ORD-2004', customerId: 'C007', customerName: 'Meenakshi Sundaram', zone: 'Aminjikarai', deliveryPersonId: 'DP004', deliveryPersonName: 'Anbu T', cans: 2, amount: 100, slot: 'morning', status: 'in-transit', paymentMode: 'wallet', time: '2026-06-23 08:45', address: '14 Poonamallee High Rd, Aminjikarai' },
  { id: 'ORD-2005', customerId: 'C010', customerName: 'Arun Tech Solutions', zone: 'Anna Nagar East', deliveryPersonId: 'DP001', deliveryPersonName: 'Murugan S', cans: 5, amount: 250, slot: 'morning', status: 'assigned', paymentMode: 'wallet', time: '2026-06-23 09:00', address: 'Olympia Tower, Anna Nagar' },
  { id: 'ORD-2006', customerId: 'C005', customerName: 'Lakshmi Devi', zone: 'Kilpauk', deliveryPersonId: 'DP003', deliveryPersonName: 'Vijay R', cans: 1, amount: 50, slot: 'morning', status: 'assigned', paymentMode: 'wallet', time: '2026-06-23 09:10', address: '23 Srinivasa Nagar, Kilpauk' },
  { id: 'ORD-2007', customerId: 'C004', customerName: 'Suresh Kumar', zone: 'Aminjikarai', deliveryPersonId: null, deliveryPersonName: null, cans: 1, amount: 50, slot: 'afternoon', status: 'pending', paymentMode: 'cod', time: '2026-06-23 06:00', address: '5/1 Aminjikarai Main Rd' },
  { id: 'ORD-2008', customerId: 'C009', customerName: 'Saranya R', zone: 'Kilpauk', deliveryPersonId: null, deliveryPersonName: null, cans: 1, amount: 50, slot: 'morning', status: 'pending', paymentMode: 'wallet', time: '2026-06-23 06:30', address: '11 Thirumalai Nagar, Kilpauk' },
  { id: 'ORD-2009', customerId: 'C006', customerName: 'Venkatesh Rao', zone: 'Anna Nagar East', deliveryPersonId: 'DP001', deliveryPersonName: 'Murugan S', cans: 1, amount: 50, slot: 'morning', status: 'failed', paymentMode: 'cod', time: '2026-06-23 07:00', address: '8/2 Anna Nagar East' },
  { id: 'ORD-2010', customerId: 'C001', customerName: 'Priya Sharma', zone: 'Anna Nagar East', deliveryPersonId: 'DP002', deliveryPersonName: 'Selvaraj K', cans: 1, amount: 50, slot: 'afternoon', status: 'pending', paymentMode: 'wallet', time: '2026-06-23 06:00', address: '12/4 Anna Nagar East' },
];

export const inventory = {
  totalCans: 500,
  availableStock: 187,
  dispatchedToday: 48,
  returnedToday: 12,
  lowStockThreshold: 50,
  history: [
    { date: '2026-06-23', dispatched: 48, returned: 12, closing: 187 },
    { date: '2026-06-22', dispatched: 72, returned: 18, closing: 223 },
    { date: '2026-06-21', dispatched: 65, returned: 14, closing: 277 },
    { date: '2026-06-20', dispatched: 80, returned: 20, closing: 328 },
    { date: '2026-06-19', dispatched: 55, returned: 10, closing: 388 },
  ],
};

export const pricingConfig = {
  canPrice: 50,
  depositAmount: 200,
  zones: [
    { zone: 'Anna Nagar East', price: 50 },
    { zone: 'Anna Nagar West', price: 50 },
    { zone: 'Kilpauk', price: 55 },
    { zone: 'Aminjikarai', price: 55 },
  ],
};

export const analyticsData = {
  dailyRevenue: [
    { date: 'Jun 17', revenue: 3200, orders: 64 },
    { date: 'Jun 18', revenue: 3800, orders: 76 },
    { date: 'Jun 19', revenue: 2750, orders: 55 },
    { date: 'Jun 20', revenue: 4000, orders: 80 },
    { date: 'Jun 21', revenue: 3250, orders: 65 },
    { date: 'Jun 22', revenue: 3600, orders: 72 },
    { date: 'Jun 23', revenue: 2400, orders: 48 },
  ],
  revenueByZone: [
    { zone: 'Anna Nagar East', revenue: 12400, orders: 248 },
    { zone: 'Anna Nagar West', revenue: 9800, orders: 196 },
    { zone: 'Kilpauk', revenue: 8200, orders: 164 },
    { zone: 'Aminjikarai', revenue: 7600, orders: 152 },
  ],
  deliveryPerformance: [
    { name: 'Murugan S', delivered: 18, failed: 1, rate: 94.7 },
    { name: 'Selvaraj K', delivered: 22, failed: 0, rate: 100 },
    { name: 'Vijay R', delivered: 15, failed: 2, rate: 88.2 },
    { name: 'Anbu T', delivered: 20, failed: 1, rate: 95.2 },
  ],
  kpis: {
    todayRevenue: 2400,
    todayOrders: 48,
    deliveredCount: 28,
    pendingCount: 12,
    failedCount: 3,
    assignedCount: 5,
    inTransitCount: 6,
    totalDuesOutstanding: 960,
    activeCustomers: 9,
    avgOrdersPerDay: 68,
  },
};

export const holidays = [
  { date: '2026-07-04', reason: 'Stock Shortage', type: 'suspension' },
  { date: '2026-07-15', reason: 'Tamil New Year', type: 'holiday' },
  { date: '2026-08-15', reason: 'Independence Day', type: 'holiday' },
];

export const notifications = [
  { id: 'N001', type: 'whatsapp', target: 'all', message: 'Dear customer, our price will increase to ₹55/can from July 1st. Thank you for your support!', sentAt: '2026-06-20 10:00', status: 'sent', recipients: 9 },
  { id: 'N002', type: 'sms', target: 'zone', zone: 'Kilpauk', message: 'Deliveries in Kilpauk will be delayed by 1 hour on June 25 due to road work.', sentAt: '2026-06-21 09:00', status: 'sent', recipients: 4 },
  { id: 'N003', type: 'whatsapp', target: 'dues', message: 'Friendly reminder: You have outstanding dues. Please top up your wallet to continue seamless delivery.', sentAt: null, status: 'draft', recipients: 0 },
];
