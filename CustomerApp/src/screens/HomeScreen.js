import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { colors, spacing, radius, shadow, typography } from '../theme';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { currentUser, activeOrder, canPrice, timeSlots } from '../data/mockData';

function WalletBanner({ balance, onTopUp }) {
  const isLow = balance < 100;
  return (
    <TouchableOpacity
      onPress={onTopUp}
      style={[styles.walletBanner, { backgroundColor: isLow ? '#fff7ed' : colors.primaryLight }]}
    >
      <View>
        <Text style={[styles.walletLabel, { color: isLow ? '#92400e' : colors.primaryDark }]}>
          {isLow ? '⚠️ Low wallet balance' : '💳 Wallet Balance'}
        </Text>
        <Text style={[styles.walletBalance, { color: isLow ? '#b45309' : colors.primary }]}>
          ₹{balance}
        </Text>
      </View>
      <View style={[styles.topUpBtn, { backgroundColor: isLow ? '#f97316' : colors.primary }]}>
        <Text style={styles.topUpBtnText}>Top Up</Text>
      </View>
    </TouchableOpacity>
  );
}

function ActiveOrderBanner({ order, onTrack }) {
  return (
    <TouchableOpacity onPress={onTrack} style={styles.activeOrderCard}>
      <View style={styles.activeOrderLeft}>
        <Text style={styles.activeOrderTitle}>Order in progress</Text>
        <Text style={styles.activeOrderSub}>{order.id} · {order.cans} can · ₹{order.amount}</Text>
        <StatusBadge status={order.status} style={{ marginTop: 6 }} />
      </View>
      <View style={styles.etaBox}>
        <Text style={styles.etaLabel}>ETA</Text>
        <Text style={styles.etaValue}>{order.eta}</Text>
        <Text style={styles.trackLink}>Track →</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const [cans, setCans] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState('morning');
  const [paymentMode, setPaymentMode] = useState('wallet');
  const [placing, setPlacing] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState('');

  const amount = cans * canPrice;

  const handlePlaceOrder = () => {
    if (paymentMode === 'wallet' && currentUser.walletBalance < amount) {
      Alert.alert('Insufficient Balance', 'Please top up your wallet to continue.', [
        { text: 'Top Up', onPress: () => navigation.navigate('Wallet') },
        { text: 'Pay Cash Instead', onPress: () => setPaymentMode('cod') },
      ]);
      return;
    }
    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      navigation.navigate('Tracking');
    }, 1800);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning 👋</Text>
          <Text style={styles.userName}>{currentUser.name}</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={styles.notifBtn}
        >
          <Text style={styles.notifIcon}>🔔</Text>
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <WalletBanner
          balance={currentUser.walletBalance}
          onTopUp={() => navigation.navigate('Wallet')}
        />

        {activeOrder && (
          <ActiveOrderBanner
            order={activeOrder}
            onTrack={() => navigation.navigate('Tracking')}
          />
        )}

        {/* Order card */}
        <Card style={styles.orderCard}>
          <Text style={styles.sectionTitle}>Place New Order</Text>

          {/* Can quantity */}
          <View style={styles.qtySection}>
            <View style={styles.canIcon}>
              <Text style={{ fontSize: 32 }}>🪣</Text>
            </View>
            <View style={styles.qtyContent}>
              <Text style={styles.qtyLabel}>20-litre Water Can</Text>
              <Text style={styles.qtyPrice}>₹{canPrice} per can</Text>
            </View>
            <View style={styles.qtyControl}>
              <TouchableOpacity
                onPress={() => setCans(Math.max(1, cans - 1))}
                style={styles.qtyBtn}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{cans}</Text>
              <TouchableOpacity
                onPress={() => setCans(Math.min(10, cans + 1))}
                style={styles.qtyBtn}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Delivery slot */}
          <Text style={styles.fieldLabel}>Delivery Slot</Text>
          <View style={styles.slotsRow}>
            {timeSlots.map(slot => (
              <TouchableOpacity
                key={slot.key}
                onPress={() => setSelectedSlot(slot.key)}
                style={[styles.slotBtn, selectedSlot === slot.key && styles.slotBtnActive]}
              >
                <Text style={styles.slotEmoji}>{slot.icon}</Text>
                <Text style={[styles.slotLabel, selectedSlot === slot.key && styles.slotLabelActive]}>
                  {slot.label}
                </Text>
                <Text style={[styles.slotTime, selectedSlot === slot.key && { color: colors.primary }]}>
                  {slot.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Payment */}
          <Text style={styles.fieldLabel}>Payment</Text>
          <View style={styles.paymentRow}>
            {[
              { key: 'wallet', label: `Wallet (₹${currentUser.walletBalance})`, icon: '💳' },
              { key: 'cod', label: 'Cash on Delivery', icon: '💵' },
            ].map(pm => (
              <TouchableOpacity
                key={pm.key}
                onPress={() => setPaymentMode(pm.key)}
                style={[styles.payBtn, paymentMode === pm.key && styles.payBtnActive]}
              >
                <Text style={styles.payIcon}>{pm.icon}</Text>
                <Text style={[styles.payLabel, paymentMode === pm.key && { color: colors.primary }]}>
                  {pm.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Delivery note */}
          <Text style={styles.fieldLabel}>Delivery Note (optional)</Text>
          <View style={styles.noteInput}>
            <Text style={styles.noteText}>
              {deliveryNote || 'e.g. Leave at gate, call before delivery...'}
            </Text>
          </View>

          {/* Summary */}
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryAmount}>₹{amount}</Text>
            </View>
            <Text style={styles.summaryDetail}>
              {cans} can{cans > 1 ? 's' : ''} × ₹{canPrice} · {
                timeSlots.find(s => s.key === selectedSlot)?.time
              }
            </Text>
          </View>

          <Button
            title={`Place Order · ₹${amount}`}
            onPress={handlePlaceOrder}
            loading={placing}
            style={{ marginTop: spacing.md }}
          />
        </Card>

        {/* Delivery address */}
        <Card style={styles.addressCard}>
          <View style={styles.addressRow}>
            <Text style={styles.addressIcon}>📍</Text>
            <View style={styles.addressContent}>
              <Text style={styles.addressTitle}>Delivery Address</Text>
              <Text style={styles.addressText}>{currentUser.address}</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeBtn}>Change</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {[
            { icon: '📋', label: 'Order\nHistory', screen: 'History' },
            { icon: '🔄', label: 'Manage\nSubscription', screen: 'Subscription' },
            { icon: '💳', label: 'Top Up\nWallet', screen: 'Wallet' },
            { icon: '📞', label: 'Contact\nDealer', screen: null },
          ].map(a => (
            <TouchableOpacity
              key={a.label}
              onPress={() => a.screen && navigation.navigate(a.screen)}
              style={styles.actionBtn}
            >
              <Text style={styles.actionIcon}>{a.icon}</Text>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg + 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '500' },
  userName: { color: colors.white, fontSize: 20, fontWeight: '700', marginTop: 2 },
  notifBtn: { position: 'relative', padding: 6 },
  notifIcon: { fontSize: 22 },
  notifDot: {
    position: 'absolute', top: 6, right: 6,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#ef4444', borderWidth: 1.5, borderColor: colors.white,
  },

  scroll: { flex: 1, marginTop: -20 },
  scrollContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },

  walletBanner: {
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  walletLabel: { fontSize: 12, fontWeight: '600', marginBottom: 2 },
  walletBalance: { fontSize: 24, fontWeight: '800' },
  topUpBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  topUpBtnText: { color: colors.white, fontSize: 13, fontWeight: '600' },

  activeOrderCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    ...shadow.sm,
  },
  activeOrderLeft: { flex: 1 },
  activeOrderTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  activeOrderSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  etaBox: { alignItems: 'center', minWidth: 60 },
  etaLabel: { fontSize: 10, color: colors.textLight, fontWeight: '600', textTransform: 'uppercase' },
  etaValue: { fontSize: 18, fontWeight: '800', color: colors.warning },
  trackLink: { fontSize: 11, color: colors.primary, fontWeight: '600', marginTop: 2 },

  orderCard: { marginBottom: spacing.md },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.black, marginBottom: spacing.md },

  qtySection: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.background, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.md,
  },
  canIcon: { marginRight: spacing.md },
  qtyContent: { flex: 1 },
  qtyLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  qtyPrice: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  qtyBtn: {
    width: 32, height: 32, borderRadius: radius.full,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnText: { color: colors.white, fontSize: 18, fontWeight: '700', lineHeight: 20 },
  qtyValue: { fontSize: 20, fontWeight: '700', color: colors.text, minWidth: 28, textAlign: 'center' },

  fieldLabel: { fontSize: 12, fontWeight: '600', color: colors.textMuted, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },

  slotsRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.md },
  slotBtn: {
    flex: 1, alignItems: 'center', padding: spacing.sm,
    borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.background,
  },
  slotBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  slotEmoji: { fontSize: 18, marginBottom: 2 },
  slotLabel: { fontSize: 12, fontWeight: '600', color: colors.text },
  slotLabelActive: { color: colors.primary },
  slotTime: { fontSize: 10, color: colors.textMuted, marginTop: 1, textAlign: 'center' },

  paymentRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.md },
  payBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    padding: spacing.sm + 2, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.background,
  },
  payBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  payIcon: { fontSize: 16 },
  payLabel: { fontSize: 12, fontWeight: '500', color: colors.text, flex: 1 },

  noteInput: {
    backgroundColor: colors.background, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.md, minHeight: 48,
  },
  noteText: { color: colors.textLight, fontSize: 13 },

  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.md,
  },
  summaryLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '500' },
  summaryAmount: { fontSize: 22, fontWeight: '800', color: colors.text },
  summaryDetail: { fontSize: 12, color: colors.textMuted, textAlign: 'right', maxWidth: 150 },

  addressCard: { marginBottom: spacing.md },
  addressRow: { flexDirection: 'row', alignItems: 'center' },
  addressIcon: { fontSize: 24, marginRight: spacing.sm },
  addressContent: { flex: 1 },
  addressTitle: { fontSize: 12, fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase' },
  addressText: { fontSize: 13, color: colors.text, marginTop: 2 },
  changeBtn: { fontSize: 13, color: colors.primary, fontWeight: '600' },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  actionBtn: {
    width: '22%', flex: 1, alignItems: 'center',
    backgroundColor: colors.white, borderRadius: radius.md,
    paddingVertical: spacing.md, ...shadow.sm,
  },
  actionIcon: { fontSize: 24, marginBottom: 6 },
  actionLabel: { fontSize: 11, fontWeight: '600', color: colors.textMuted, textAlign: 'center' },
});
