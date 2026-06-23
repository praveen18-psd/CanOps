import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import { deliveries } from '../data/mockData';

const COD_DELIVERIES = deliveries.filter(d => d.paymentMode === 'cod');

function CashRow({ item }) {
  const isDelivered = item.status === 'delivered';
  const isFailed    = item.status === 'failed';
  const isPending   = !isDelivered && !isFailed;

  return (
    <View style={[row.wrap, isFailed && row.wrapFailed]}>
      <View style={[row.seq, isDelivered && row.seqDone, isFailed && row.seqFailed]}>
        <Text style={row.seqText}>
          {isDelivered ? '✓' : isFailed ? '✗' : item.seq}
        </Text>
      </View>
      <View style={row.info}>
        <Text style={[row.name, isFailed && row.nameFailed]}>{item.customerName}</Text>
        <Text style={row.address} numberOfLines={1}>{item.address}</Text>
      </View>
      <View style={row.amountCol}>
        {isPending && <Text style={row.amountPending}>₹{item.amount}</Text>}
        {isDelivered && (
          <>
            <Text style={row.amountCollected}>₹{item.cashCollected ?? item.amount}</Text>
            <Text style={row.collectedLabel}>Collected</Text>
          </>
        )}
        {isFailed && <Text style={row.amountFailed}>–</Text>}
      </View>
    </View>
  );
}

const row = StyleSheet.create({
  wrap: {
    backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md,
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginBottom: spacing.xs, ...shadow.sm,
    borderLeftWidth: 4, borderLeftColor: colors.border,
  },
  wrapFailed: { opacity: 0.55, borderLeftColor: colors.error },
  seq: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.background,
    borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  seqDone:   { backgroundColor: colors.primary, borderColor: colors.primary },
  seqFailed: { backgroundColor: colors.error, borderColor: colors.error },
  seqText:   { fontSize: 13, fontWeight: '800', color: colors.textMuted },
  info:      { flex: 1 },
  name:      { fontSize: 14, fontWeight: '700', color: colors.text },
  nameFailed:{ textDecorationLine: 'line-through', color: colors.textMuted },
  address:   { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  amountCol: { alignItems: 'flex-end', flexShrink: 0 },
  amountPending:   { fontSize: 16, fontWeight: '700', color: colors.text },
  amountCollected: { fontSize: 16, fontWeight: '800', color: colors.success },
  amountFailed:    { fontSize: 16, fontWeight: '700', color: colors.textLight },
  collectedLabel:  { fontSize: 10, color: colors.success, fontWeight: '600' },
});

export default function CashCollectionScreen({ navigation }) {
  const [confirmed, setConfirmed] = useState(false);

  const totalExpected = useMemo(() =>
    COD_DELIVERIES.reduce((s, d) => s + d.amount, 0), []);
  const totalCollected = useMemo(() =>
    COD_DELIVERIES.filter(d => d.status === 'delivered')
      .reduce((s, d) => s + (d.cashCollected ?? d.amount), 0), []);
  const pendingCount = COD_DELIVERIES.filter(d => d.status !== 'delivered' && d.status !== 'failed').length;

  const handleHandover = () => {
    Alert.alert(
      'Confirm Cash Handover',
      `You are handing over ₹${totalCollected} to the dealer.\n\nThis action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm Handover', onPress: () => setConfirmed(true) },
      ]
    );
  };

  if (confirmed) {
    return (
      <SafeAreaView style={s.safe}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
        <View style={s.successScreen}>
          <Text style={s.successEmoji}>💰</Text>
          <Text style={s.successTitle}>Handover Complete</Text>
          <Text style={s.successAmount}>₹{totalCollected}</Text>
          <Text style={s.successSub}>Cash handed over to dealer</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.successBtn}>
            <Text style={s.successBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.card} />

      <View style={s.header}>
        <Text style={s.headerTitle}>Cash Collection</Text>
        <Text style={s.headerSub}>{COD_DELIVERIES.length} cash orders today</Text>
      </View>

      {/* Summary cards */}
      <View style={s.summaryRow}>
        <View style={[s.summaryCard, s.summaryCardGreen]}>
          <Text style={s.summaryLabel}>Collected</Text>
          <Text style={[s.summaryAmount, { color: colors.success }]}>₹{totalCollected}</Text>
        </View>
        <View style={s.summaryCard}>
          <Text style={s.summaryLabel}>Pending</Text>
          <Text style={s.summaryAmount}>₹{totalExpected - totalCollected}</Text>
          {pendingCount > 0 && <Text style={s.summaryMeta}>{pendingCount} stops left</Text>}
        </View>
        <View style={s.summaryCard}>
          <Text style={s.summaryLabel}>Expected</Text>
          <Text style={s.summaryAmount}>₹{totalExpected}</Text>
        </View>
      </View>

      <FlatList
        data={COD_DELIVERIES}
        keyExtractor={i => i.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <CashRow item={item} />}
        ListHeaderComponent={
          <Text style={s.listHeader}>Per-stop breakdown</Text>
        }
        ListFooterComponent={
          <View style={s.footer}>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Total to hand over</Text>
              <Text style={s.totalAmount}>₹{totalCollected}</Text>
            </View>
            {pendingCount > 0 && (
              <View style={s.warningBox}>
                <Text style={s.warningText}>
                  ⚠️  {pendingCount} cash stop{pendingCount > 1 ? 's' : ''} still pending. Hand over after completing all deliveries.
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={handleHandover}
              style={[s.handoverBtn, pendingCount > 0 && s.handoverBtnWarn]}
            >
              <Text style={s.handoverBtnText}>
                {pendingCount > 0 ? '⚠️  Hand Over Now (partial)' : '💰  Confirm Cash Handover'}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.card, paddingHorizontal: spacing.md,
    paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
  headerSub:   { fontSize: 13, color: colors.textMuted, marginTop: 2 },

  summaryRow: {
    flexDirection: 'row', gap: spacing.sm,
    padding: spacing.md, backgroundColor: colors.card,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  summaryCard: {
    flex: 1, backgroundColor: colors.background, borderRadius: radius.md,
    padding: spacing.sm, alignItems: 'center', borderWidth: 1, borderColor: colors.border,
  },
  summaryCardGreen: { backgroundColor: '#f0fdf4', borderColor: '#a7f3d0' },
  summaryLabel:  { fontSize: 10, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase' },
  summaryAmount: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 4 },
  summaryMeta:   { fontSize: 10, color: colors.textMuted, marginTop: 2 },

  list: { padding: spacing.md, paddingBottom: spacing.xxl },
  listHeader: { fontSize: 12, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm },

  footer: { paddingTop: spacing.md, gap: spacing.sm },
  totalRow: {
    backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.md,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.primary,
  },
  totalLabel:  { fontSize: 15, fontWeight: '700', color: colors.text },
  totalAmount: { fontSize: 24, fontWeight: '800', color: colors.primary },

  warningBox: {
    backgroundColor: '#fefce8', borderRadius: radius.md, padding: spacing.md,
    borderWidth: 1, borderColor: '#fde047',
  },
  warningText: { fontSize: 13, color: '#713f12', lineHeight: 18 },

  handoverBtn: {
    backgroundColor: colors.primary, borderRadius: radius.lg,
    paddingVertical: 18, alignItems: 'center',
  },
  handoverBtnWarn: { backgroundColor: '#d97706' },
  handoverBtnText: { fontSize: 17, fontWeight: '700', color: '#fff' },

  successScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.md },
  successEmoji:  { fontSize: 64 },
  successTitle:  { fontSize: 24, fontWeight: '800', color: colors.text },
  successAmount: { fontSize: 48, fontWeight: '900', color: colors.success },
  successSub:    { fontSize: 15, color: colors.textMuted },
  successBtn: {
    marginTop: spacing.lg, backgroundColor: colors.primary, borderRadius: radius.lg,
    paddingVertical: 16, paddingHorizontal: 48,
  },
  successBtnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
});
