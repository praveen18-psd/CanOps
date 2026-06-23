export const currentUser = {
  id: 'C001',
  name: 'Priya Sharma',
  phone: '+91 98400 11111',
  address: '12/4 Anna Nagar East, Chennai - 600 040',
  zone: 'Anna Nagar East',
  walletBalance: 450,
  language: 'en',
  dealer: {
    name: 'Sri Murugan Water Depot',
    phone: '+91 98412 55678',
  },
};

export const canPrice = 50;

export const orderStatuses = [
  { key: 'confirmed',   label: 'Confirmed',      icon: 'check-circle',       color: '#1a8fe0' },
  { key: 'assigned',    label: 'Assigned',        icon: 'person',             color: '#8b5cf6' },
  { key: 'out_delivery',label: 'Out for Delivery',icon: 'local-shipping',     color: '#f59e0b' },
  { key: 'delivered',   label: 'Delivered',       icon: 'check-circle',       color: '#22c55e' },
];

export const activeOrder = {
  id: 'ORD-2001',
  cans: 1,
  amount: 50,
  status: 'out_delivery',
  placedAt: '2026-06-23 07:00',
  slot: 'morning',
  deliveryPerson: { name: 'Murugan S', phone: '+91 94451 12345' },
  eta: '~15 min',
  address: '12/4 Anna Nagar East, Chennai',
};

export const orderHistory = [
  { id: 'ORD-1998', date: '2026-06-22', cans: 1, amount: 50, status: 'delivered', paymentMode: 'wallet', deliveryPerson: 'Murugan S', rating: 5 },
  { id: 'ORD-1994', date: '2026-06-21', cans: 1, amount: 50, status: 'delivered', paymentMode: 'wallet', deliveryPerson: 'Selvaraj K', rating: 4 },
  { id: 'ORD-1991', date: '2026-06-20', cans: 2, amount: 100, status: 'delivered', paymentMode: 'wallet', deliveryPerson: 'Murugan S', rating: 5 },
  { id: 'ORD-1988', date: '2026-06-19', cans: 1, amount: 50, status: 'delivered', paymentMode: 'cod', deliveryPerson: 'Murugan S', rating: null },
  { id: 'ORD-1984', date: '2026-06-18', cans: 1, amount: 50, status: 'failed', paymentMode: 'wallet', deliveryPerson: 'Vijay R', rating: null },
  { id: 'ORD-1980', date: '2026-06-17', cans: 1, amount: 50, status: 'delivered', paymentMode: 'wallet', deliveryPerson: 'Murugan S', rating: 5 },
];

export const walletTransactions = [
  { id: 'T001', type: 'credit', amount: 200, label: 'Wallet Top-up (UPI)',       date: '2026-06-20', balance: 450 },
  { id: 'T002', type: 'debit',  amount: 50,  label: 'Order ORD-1991 (2 cans)',   date: '2026-06-20', balance: 250 },
  { id: 'T003', type: 'debit',  amount: 50,  label: 'Order ORD-1994',             date: '2026-06-21', balance: 200 },
  { id: 'T004', type: 'debit',  amount: 50,  label: 'Order ORD-1998',             date: '2026-06-22', balance: 150 },
  { id: 'T005', type: 'credit', amount: 350, label: 'Wallet Top-up (UPI)',       date: '2026-06-22', balance: 500 },
  { id: 'T006', type: 'debit',  amount: 50,  label: 'Order ORD-2001',             date: '2026-06-23', balance: 450 },
];

export const subscription = {
  active: true,
  type: 'daily',
  cansPerDay: 1,
  slot: 'morning',
  nextDelivery: '2026-06-24',
  startDate: '2026-01-01',
  pausedUntil: null,
};

export const timeSlots = [
  { key: 'morning',   label: 'Morning',   time: '7 AM – 10 AM',  icon: '🌅' },
  { key: 'afternoon', label: 'Afternoon', time: '12 PM – 3 PM',  icon: '☀️' },
  { key: 'evening',   label: 'Evening',   time: '5 PM – 8 PM',   icon: '🌆' },
];

export const notifications = [
  { id: 'N1', type: 'delivery', title: 'Order out for delivery', body: 'Murugan S is on the way. ETA ~15 min.', time: '07:42 AM', read: false },
  { id: 'N2', type: 'payment',  title: 'Payment deducted',       body: '₹50 deducted from wallet for ORD-2001.', time: '07:00 AM', read: false },
  { id: 'N3', type: 'delivery', title: 'Order delivered',        body: 'Your order ORD-1998 was delivered yesterday.', time: 'Jun 22', read: true },
  { id: 'N4', type: 'promo',    title: 'Top up & get ₹10 off',   body: 'Add ₹200 or more to wallet and get ₹10 cashback!', time: 'Jun 20', read: true },
];
