import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Alert, Linking,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import BigButton from '../components/BigButton';
import DeliveryStatusBadge from '../components/DeliveryStatusBadge';
import { deliveries } from '../data/mockData';

export default function DeliveryDetailScreen({ route, navigation }) {
  const { orderId } = route.params;
  const original = deliveries.find(d => d.id === orderId);
  const [item, setItem] = useState(original);
  const [cash, setCash] = useState(item?.cashCollected || 0);
  const [confirming, setConfirming] = useState(false);

  if (!item) return null;

  const isCod       = item.paymentMode === 'cod';
  const isDone      = item.status === 'delivered' || item.status === 'failed';
  const isInTransit = item.status === 'in_transit';
  const isPending   = item.status === 'pending';

  const handleStartDelivery = () => {
    setItem(prev => ({ ...prev, status: 'in_transit' }));
  };

  const handleConfirmDelivery = () => {
    if (isCod && cash < item.amount) {
      Alert.alert(
        'Cash amount?',
        `This is a cash order for ₹${item.amount}. Did you collect the full amount?`,
        [
          { text: 'Yes, collected',  onPress: () => doConfirm(item.amount) },
          { text: 'Partial / Skip',  onPress: () => doConfirm(cash) },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }
    doConfirm(isCod ? item.amount : 0);
  };

  const doConfirm = (collectedCash) => {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      setItem(prev => ({
        ...prev,
        status: 'delivered',
        deliveredAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        cashCollected: collectedCash,
      }));
    }, 1200);
  };

  const handleOpenMaps = () => {
    const { lat, lng } = item.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    Linking.openURL(url);
  };

  const handleCall = () => Linking.openURL(`tel:${item.phone}`);

  const handleFail = () => {
    navigation.navigate('FailedDelivery', { orderId: item.id });
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.card} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>{item.customerName}</Text>
          <DeliveryStatusBadge status={item.status} />
        </View>
        <Text style={s.seqNum}>#{item.seq}</Text>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Delivery confirmed banner */}
        {item.status === 'delivered' && (
          <View style={s.successBanner}>
            <Text style={s.successEmoji}>✅</Text>
            <View>
              <Text style={s.successTitle}>Delivered at {item.deliveredAt}</Text>
              {isCod && <Text style={s.successSub}>Cash collected: ₹{item.cashCollected}</Text>}
            </View>
          </View>
        )}

        {/* Address + quick actions */}
        <View style={s.addressCard}>
          <Text style={s.addressCardTitle}>📍 Delivery Address</Text>
          <Text style={s.addressText}>{item.address}</Text>
          {item.landmark ? <Text style={s.landmarkText}>🏷 {item.landmark}</Text> : null}
          {item.notes ? (
            <View style={s.notesBox}>
              <Text style={s.notesText}>📝 {item.notes}</Text>
            </View>
          ) : null}

          {!isDone && (
            <View style={s.actionRow}>
              <TouchableOpacity onPress={handleCall} style={s.quickBtn}>
                <Text style={s.quickBtnIcon}>📞</Text>
                <Text style={s.quickBtnText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleOpenMaps} style={[s.quickBtn, s.quickBtnNav]}>
                <Text style={s.quickBtnIcon}>🗺</Text>
                <Text style={[s.quickBtnText, { color: colors.accent }]}>Navigate</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Order details */}
        <View style={s.detailsCard}>
          <Text style={s.detailsTitle}>Order Details</Text>
          {[
            { label: 'Order ID',  value: item.id },
            { label: 'Cans',      value: `${item.cans} × 20-litre` },
            { label: 'Amount',    value: `₹${item.amount}` },
            { label: 'Payment',   value: isCod ? '💵 Cash on Delivery' : '💳 Wallet (paid)' },
            { label: 'Phone',     value: item.phone },
          ].map(r => (
            <View key={r.label} style={s.detailRow}>
              <Text style={s.detailLabel}>{r.label}</Text>
              <Text style={s.detailValue}>{r.value}</Text>
            </View>
          ))}
        </View>

        {/* Cash collection input for COD */}
        {isCod && isInTransit && (
          <View style={s.cashCard}>
            <Text style={s.cashTitle}>💵 Cash Collection</Text>
            <Text style={s.cashSub}>Amount to collect: <Text style={{ fontWeight: '800', color: colors.text }}>₹{item.amount}</Text></Text>
            <View style={s.cashInputRow}>
              <Text style={s.cashRupee}>₹</Text>
              <Text style={s.cashValue}>{item.amount}</Text>
              <Text style={s.cashVerified}>  ✓ Confirmed</Text>
            </View>
          </View>
        )}

        {/* Proof of delivery placeholder */}
        {!isDone && isInTransit && (
          <View style={s.proofCard}>
            <Text style={s.proofTitle}>📷 Proof of Delivery (optional)</Text>
            <TouchableOpacity style={s.proofPlaceholder}>
              <Text style={s.proofIcon}>📸</Text>
              <Text style={s.proofText}>Tap to take a photo</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* CTA buttons */}
        <View style={s.ctaSection}>
          {isPending && (
            <BigButton
              title="Start Delivery"
              icon="🚴"
              onPress={handleStartDelivery}
              color={colors.accent}
            />
          )}

          {isInTransit && (
            <>
              <BigButton
                title="Mark as Delivered"
                icon="✅"
                onPress={handleConfirmDelivery}
                color={colors.primary}
                loading={confirming}
              />
              <TouchableOpacity onPress={handleFail} style={s.failBtn}>
                <Text style={s.failBtnText}>✗  Report Failed Delivery</Text>
              </TouchableOpacity>
            </>
          )}

          {isDone && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={s.backToListBtn}
            >
              <Text style={s.backToListText}>← Back to Delivery List</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.sm,
  },
  backBtn:      { padding: 4 },
  backArrow:    { fontSize: 22, color: colors.text },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle:  { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 4 },
  seqNum:       { fontSize: 14, fontWeight: '700', color: colors.textLight, minWidth: 28, textAlign: 'right' },

  scroll: { flex: 1 },

  successBanner: {
    backgroundColor: '#d1fae5', flexDirection: 'row', alignItems: 'center',
    gap: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: '#a7f3d0',
  },
  successEmoji: { fontSize: 28 },
  successTitle: { fontSize: 15, fontWeight: '700', color: '#065f46' },
  successSub:   { fontSize: 13, color: '#047857', marginTop: 2 },

  addressCard: {
    backgroundColor: colors.card, margin: spacing.md, borderRadius: radius.lg,
    padding: spacing.md, ...shadow.sm,
  },
  addressCardTitle: { fontSize: 11, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.xs },
  addressText:  { fontSize: 15, fontWeight: '600', color: colors.text, lineHeight: 22 },
  landmarkText: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  notesBox: {
    marginTop: spacing.sm, backgroundColor: '#fef9c3',
    borderRadius: radius.sm, padding: spacing.sm, borderLeftWidth: 3, borderLeftColor: '#eab308',
  },
  notesText: { fontSize: 13, color: '#713f12' },

  actionRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  quickBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs, backgroundColor: colors.primaryLight,
    borderRadius: radius.md, paddingVertical: 12,
  },
  quickBtnNav: { backgroundColor: '#e0f2fe' },
  quickBtnIcon: { fontSize: 18 },
  quickBtnText: { fontSize: 14, fontWeight: '700', color: colors.primary },

  detailsCard: {
    backgroundColor: colors.card, marginHorizontal: spacing.md,
    borderRadius: radius.lg, padding: spacing.md, ...shadow.sm, marginBottom: spacing.md,
  },
  detailsTitle: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: colors.background,
  },
  detailLabel: { fontSize: 13, color: colors.textMuted },
  detailValue: { fontSize: 13, fontWeight: '600', color: colors.text },

  cashCard: {
    backgroundColor: '#fffbeb', marginHorizontal: spacing.md,
    borderRadius: radius.lg, padding: spacing.md, ...shadow.sm,
    marginBottom: spacing.md, borderWidth: 1, borderColor: '#fcd34d',
  },
  cashTitle:    { fontSize: 14, fontWeight: '700', color: '#78350f', marginBottom: 4 },
  cashSub:      { fontSize: 13, color: '#92400e', marginBottom: spacing.sm },
  cashInputRow: { flexDirection: 'row', alignItems: 'center' },
  cashRupee:    { fontSize: 22, fontWeight: '700', color: colors.text },
  cashValue:    { fontSize: 36, fontWeight: '800', color: colors.text },
  cashVerified: { fontSize: 13, color: colors.success, fontWeight: '600' },

  proofCard: {
    backgroundColor: colors.card, marginHorizontal: spacing.md,
    borderRadius: radius.lg, padding: spacing.md, ...shadow.sm, marginBottom: spacing.md,
  },
  proofTitle: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  proofPlaceholder: {
    borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed',
    borderRadius: radius.md, padding: spacing.xl, alignItems: 'center',
  },
  proofIcon: { fontSize: 32, marginBottom: spacing.xs },
  proofText: { fontSize: 13, color: colors.textMuted },

  ctaSection: { padding: spacing.md, paddingBottom: spacing.xxl, gap: spacing.sm },
  failBtn: {
    borderWidth: 1.5, borderColor: colors.error, borderRadius: radius.lg,
    paddingVertical: 15, alignItems: 'center',
  },
  failBtnText: { color: colors.error, fontSize: 16, fontWeight: '700' },
  backToListBtn: {
    backgroundColor: colors.background, borderRadius: radius.lg,
    paddingVertical: 15, alignItems: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  backToListText: { color: colors.text, fontSize: 15, fontWeight: '600' },
});
