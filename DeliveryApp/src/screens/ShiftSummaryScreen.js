import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import DeliveryStatusBadge from '../components/DeliveryStatusBadge';
import { deliveries, deliveryPerson } from '../data/mockData';

function StatCard({ label, value, sub, accent }) {
  return (
    <View style={[sc.card, accent && sc.cardAccent]}>
      <Text style={[sc.value, accent && sc.valueAccent]}>{value}</Text>
      <Text style={sc.label}>{label}</Text>
      {sub ? <Text style={sc.sub}>{sub}</Text> : null}
    </View>
  );
}
const sc = StyleSheet.create({
  card:        { flex: 1, backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center', ...shadow.sm },
  cardAccent:  { backgroundColor: colors.primary },
  value:       { fontSize: 28, fontWeight: '900', color: colors.text },
  valueAccent: { color: '#fff' },
  label:       { fontSize: 11, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', marginTop: 4 },
  sub:         { fontSize: 11, color: colors.textLight, marginTop: 2 },
});

export default function ShiftSummaryScreen({ navigation }) {
  const [ending, setEnding] = useState(false);
  const [ended, setEnded] = useState(false);

  const stats = useMemo(() => {
    const total    = deliveries.length;
    const done     = deliveries.filter(d => d.status === 'delivered');
    const failed   = deliveries.filter(d => d.status === 'failed');
    const pending  = deliveries.filter(d => d.status !== 'delivered' && d.status !== 'failed');
    const cans     = done.reduce((s, d) => s + d.cans, 0);
    const cash     = deliveries.filter(d => d.paymentMode === 'cod' && d.status === 'delivered')
                               .reduce((s, d) => s + (d.cashCollected ?? d.amount), 0);
    const pct      = Math.round((done.length / total) * 100);
    return { total, done: done.length, failed: failed.length, pending: pending.length, cans, cash, pct, doneList: done, failedList: failed };
  }, []);

  const handleEndShift = () => {
    if (stats.pending > 0) {
      Alert.alert(
        'Pending deliveries',
        `${stats.pending} stop${stats.pending > 1 ? 's' : ''} still pending. End shift anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'End Shift', style: 'destructive', onPress: doEnd },
        ]
      );
    } else {
      doEnd();
    }
  };

  const doEnd = () => {
    setEnding(true);
    setTimeout(() => { setEnding(false); setEnded(true); }, 1400);
  };

  if (ended) {
    return (
      <SafeAreaView style={s.safe}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
        <View style={s.endedScreen}>
          <Text style={s.endedEmoji}>🎉</Text>
          <Text style={s.endedTitle}>Shift Complete!</Text>
          <Text style={s.endedSub}>Great work today, {deliveryPerson.name.split(' ')[0]}!</Text>
          <View style={s.endedStats}>
            <Text style={s.endedStat}>✅ {stats.done} delivered</Text>
            <Text style={s.endedStat}>🪣 {stats.cans} cans</Text>
            <Text style={s.endedStat}>💰 ₹{stats.cash} collected</Text>
            {stats.failed > 0 && <Text style={[s.endedStat, { color: colors.error }]}>✗ {stats.failed} failed</Text>}
          </View>
          <Text style={s.endedNote}>Report submitted to dealer.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.card} />

      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={s.headerTitle}>Shift Summary</Text>
          <Text style={s.headerSub}>{deliveryPerson.name} · {deliveryPerson.zone}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Progress ring placeholder */}
        <View style={s.progressSection}>
          <View style={s.progressRing}>
            <Text style={s.progressPct}>{stats.pct}%</Text>
            <Text style={s.progressLabel}>Complete</Text>
          </View>
          <View style={s.progressMeta}>
            <Text style={s.progressMetaLine}>
              <Text style={{ color: colors.success, fontWeight: '700' }}>{stats.done}</Text> of {stats.total} deliveries done
            </Text>
            {stats.pending > 0 && (
              <Text style={s.progressMetaLine}>
                <Text style={{ fontWeight: '700' }}>{stats.pending}</Text> stop{stats.pending > 1 ? 's' : ''} remaining
              </Text>
            )}
            {stats.failed > 0 && (
              <Text style={s.progressMetaLine}>
                <Text style={{ color: colors.error, fontWeight: '700' }}>{stats.failed}</Text> failed
              </Text>
            )}
          </View>
        </View>

        {/* KPI row 1 */}
        <View style={s.kpiRow}>
          <StatCard label="Delivered" value={stats.done} accent />
          <StatCard label="Cans"   value={stats.cans} sub="20-litre" />
        </View>
        {/* KPI row 2 */}
        <View style={s.kpiRow}>
          <StatCard label="Cash Collected" value={`₹${stats.cash}`} />
          <StatCard label="Failed" value={stats.failed} sub={stats.failed > 0 ? 'reported to dealer' : 'none'} />
        </View>

        {/* Delivered stops */}
        {stats.doneList.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>✅ Delivered ({stats.doneList.length})</Text>
            {stats.doneList.map(d => (
              <View key={d.id} style={s.stopRow}>
                <View style={s.stopSeqDone}>
                  <Text style={s.stopSeqText}>✓</Text>
                </View>
                <View style={s.stopInfo}>
                  <Text style={s.stopName}>{d.customerName}</Text>
                  <Text style={s.stopMeta}>{d.cans} can{d.cans > 1 ? 's' : ''} · {d.paymentMode === 'cod' ? `₹${d.cashCollected ?? d.amount} cash` : 'Wallet'}</Text>
                </View>
                <Text style={s.stopTime}>{d.deliveredAt || '–'}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Failed stops */}
        {stats.failedList.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>✗ Failed ({stats.failedList.length})</Text>
            {stats.failedList.map(d => (
              <View key={d.id} style={[s.stopRow, s.stopRowFailed]}>
                <View style={s.stopSeqFailed}>
                  <Text style={s.stopSeqText}>✗</Text>
                </View>
                <View style={s.stopInfo}>
                  <Text style={s.stopName}>{d.customerName}</Text>
                  <Text style={s.stopMeta}>{d.failureReason || 'Reason reported'}</Text>
                </View>
                <DeliveryStatusBadge status="failed" />
              </View>
            ))}
          </View>
        )}

        {/* End shift */}
        <View style={s.actions}>
          <TouchableOpacity
            onPress={handleEndShift}
            style={[s.endBtn, ending && s.endBtnLoading]}
            disabled={ending}
          >
            <Text style={s.endBtnText}>{ending ? 'Submitting…' : '🏁  End Shift & Submit Report'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.continueBtn}>
            <Text style={s.continueBtnText}>Continue Deliveries</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: spacing.md,
    paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn:     { padding: 4 },
  backArrow:   { fontSize: 22, color: colors.text },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  headerSub:   { fontSize: 12, color: colors.textMuted, marginTop: 2 },

  scroll: { flex: 1 },

  progressSection: {
    backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center',
    gap: spacing.lg, padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  progressRing: {
    width: 90, height: 90, borderRadius: 45, borderWidth: 8, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryLight,
  },
  progressPct:   { fontSize: 22, fontWeight: '900', color: colors.primary },
  progressLabel: { fontSize: 10, color: colors.primary, fontWeight: '700' },
  progressMeta:  { flex: 1, gap: 6 },
  progressMetaLine: { fontSize: 13, color: colors.text },

  kpiRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, paddingTop: spacing.md },

  section: { padding: spacing.md },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },

  stopRow: {
    backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md,
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs, ...shadow.sm,
  },
  stopRowFailed: { opacity: 0.7 },
  stopSeqDone:   { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stopSeqFailed: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.error,   alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stopSeqText:   { fontSize: 13, fontWeight: '800', color: '#fff' },
  stopInfo:      { flex: 1 },
  stopName:      { fontSize: 14, fontWeight: '700', color: colors.text },
  stopMeta:      { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  stopTime:      { fontSize: 12, color: colors.textMuted, flexShrink: 0 },

  actions: { padding: spacing.md, paddingBottom: spacing.xxl, gap: spacing.sm },
  endBtn: {
    backgroundColor: colors.primaryDark, borderRadius: radius.lg,
    paddingVertical: 18, alignItems: 'center',
  },
  endBtnLoading: { opacity: 0.6 },
  endBtnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
  continueBtn: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg,
    paddingVertical: 14, alignItems: 'center',
  },
  continueBtnText: { fontSize: 15, color: colors.text, fontWeight: '600' },

  endedScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.sm },
  endedEmoji:  { fontSize: 72 },
  endedTitle:  { fontSize: 28, fontWeight: '900', color: colors.text },
  endedSub:    { fontSize: 15, color: colors.textMuted },
  endedStats:  { marginTop: spacing.md, gap: spacing.xs, alignItems: 'center' },
  endedStat:   { fontSize: 16, fontWeight: '600', color: colors.text },
  endedNote:   { fontSize: 13, color: colors.textMuted, marginTop: spacing.md },
});
