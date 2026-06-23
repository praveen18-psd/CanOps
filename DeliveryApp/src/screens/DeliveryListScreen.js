import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, StatusBar, Linking,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import DeliveryStatusBadge from '../components/DeliveryStatusBadge';
import { deliveries, deliveryPerson } from '../data/mockData';

const ORDER = ['in_transit', 'pending', 'delivered', 'failed'];
const sorted = [...deliveries].sort(
  (a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status)
);

function ProgressBar({ items }) {
  const total     = items.length;
  const delivered = items.filter(i => i.status === 'delivered').length;
  const failed    = items.filter(i => i.status === 'failed').length;
  const pct       = Math.round((delivered / total) * 100);

  return (
    <View style={pb.wrap}>
      <View style={pb.barBg}>
        <View style={[pb.barFill, { width: `${pct}%` }]} />
      </View>
      <View style={pb.labels}>
        <Text style={pb.label}><Text style={{ color: colors.success, fontWeight: '700' }}>{delivered}</Text> delivered</Text>
        <Text style={pb.label}><Text style={{ fontWeight: '700', color: colors.text }}>{total - delivered - failed}</Text> remaining</Text>
        {failed > 0 && <Text style={pb.label}><Text style={{ color: colors.error, fontWeight: '700' }}>{failed}</Text> failed</Text>}
      </View>
    </View>
  );
}

const pb = StyleSheet.create({
  wrap:   { marginBottom: spacing.xs },
  barBg:  { height: 8, backgroundColor: colors.border, borderRadius: radius.full, overflow: 'hidden', marginBottom: spacing.xs },
  barFill:{ height: '100%', backgroundColor: colors.primary, borderRadius: radius.full },
  labels: { flexDirection: 'row', gap: spacing.md },
  label:  { fontSize: 12, color: colors.textMuted },
});

function DeliveryCard({ item, onPress, onCall }) {
  const isActive  = item.status === 'in_transit';
  const isDone    = item.status === 'delivered' || item.status === 'failed';

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      activeOpacity={0.85}
      style={[
        s.card,
        isActive && s.cardActive,
        isDone   && s.cardDone,
      ]}
    >
      {/* Sequence number */}
      <View style={[s.seq, isActive && s.seqActive, isDone && s.seqDone]}>
        <Text style={[s.seqText, (isActive || isDone) && { color: '#fff' }]}>
          {item.status === 'delivered' ? '✓' : item.status === 'failed' ? '✗' : item.seq}
        </Text>
      </View>

      <View style={s.info}>
        <View style={s.nameRow}>
          <Text style={[s.name, isDone && s.nameDone]}>{item.customerName}</Text>
          <DeliveryStatusBadge status={item.status} />
        </View>
        <Text style={s.address} numberOfLines={1}>📍 {item.address}</Text>
        {item.landmark ? <Text style={s.landmark}>{item.landmark}</Text> : null}

        <View style={s.metaRow}>
          <View style={s.metaChip}>
            <Text style={s.metaText}>🪣 {item.cans} can{item.cans > 1 ? 's' : ''}</Text>
          </View>
          <View style={[s.metaChip, item.paymentMode === 'cod' && s.metaChipCod]}>
            <Text style={[s.metaText, item.paymentMode === 'cod' && { color: '#92400e' }]}>
              {item.paymentMode === 'cod' ? '💵 Cash ₹' + item.amount : '💳 Wallet'}
            </Text>
          </View>
          {item.notes ? (
            <View style={s.metaChip}>
              <Text style={s.metaText} numberOfLines={1}>📝 {item.notes}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Quick call button */}
      {!isDone && (
        <TouchableOpacity
          onPress={() => onCall(item.phone)}
          style={s.callBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={s.callBtnText}>📞</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

export default function DeliveryListScreen({ navigation }) {
  const [items, setItems] = useState(sorted);
  const [filter, setFilter] = useState('all');

  const filtered = items.filter(i => filter === 'all' || i.status === filter);

  const handleCall = (phone) => Linking.openURL(`tel:${phone}`);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Text style={s.headerGreeting}>Good morning</Text>
          <Text style={s.headerName}>{deliveryPerson.name} 👋</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('ShiftSummary')}
          style={s.summaryBtn}
        >
          <Text style={s.summaryBtnText}>Shift Summary</Text>
        </TouchableOpacity>
      </View>

      {/* Stats + progress */}
      <View style={s.statsBar}>
        <ProgressBar items={items} />
        <TouchableOpacity
          onPress={() => navigation.navigate('RouteMap')}
          style={s.routeBtn}
        >
          <Text style={s.routeBtnText}>🗺  Optimise Route</Text>
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <View style={s.filterRow}>
        {[
          { key: 'all',       label: 'All' },
          { key: 'pending',   label: 'Pending' },
          { key: 'in_transit',label: 'Active' },
          { key: 'delivered', label: 'Done' },
          { key: 'failed',    label: 'Failed' },
        ].map(f => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[s.filterChip, filter === f.key && s.filterChipActive]}
          >
            <Text style={[s.filterChipText, filter === f.key && s.filterChipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <DeliveryCard
            item={item}
            onPress={() => navigation.navigate('DeliveryDetail', { orderId: item.id })}
            onCall={handleCall}
          />
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyEmoji}>🎉</Text>
            <Text style={s.emptyText}>No deliveries in this filter</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: {
    backgroundColor: colors.primaryDark,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.md,
  },
  headerLeft: {},
  headerGreeting: { fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: '500' },
  headerName: { fontSize: 20, fontWeight: '800', color: '#fff' },
  summaryBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2,
  },
  summaryBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  statsBar: {
    backgroundColor: colors.card, paddingHorizontal: spacing.md,
    paddingTop: spacing.md, paddingBottom: spacing.sm,
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  routeBtn: {
    backgroundColor: colors.primary, borderRadius: radius.full,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 4,
    flexShrink: 0,
  },
  routeBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  filterRow: {
    flexDirection: 'row', gap: spacing.xs,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  filterChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: radius.full, backgroundColor: colors.background,
    borderWidth: 1, borderColor: colors.border,
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText:   { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  filterChipTextActive: { color: '#fff' },

  list: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xxl },

  card: {
    backgroundColor: colors.card, borderRadius: radius.lg,
    padding: spacing.md, flexDirection: 'row', alignItems: 'flex-start',
    gap: spacing.sm, ...shadow.sm,
    borderLeftWidth: 4, borderLeftColor: colors.border,
  },
  cardActive: { borderLeftColor: colors.accent },
  cardDone:   { opacity: 0.65 },

  seq: {
    width: 36, height: 36, borderRadius: 18, flexShrink: 0,
    backgroundColor: colors.background, borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  seqActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  seqDone:   { backgroundColor: colors.textMuted, borderColor: colors.textMuted },
  seqText:   { fontSize: 14, fontWeight: '800', color: colors.textMuted },

  info: { flex: 1 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { fontSize: 15, fontWeight: '700', color: colors.text, flex: 1, marginRight: spacing.xs },
  nameDone: { textDecorationLine: 'line-through', color: colors.textMuted },
  address: { fontSize: 12, color: colors.textMuted, marginBottom: 2 },
  landmark: { fontSize: 11, color: colors.textLight, marginBottom: spacing.xs },

  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: 4 },
  metaChip: {
    backgroundColor: colors.background, borderRadius: radius.sm,
    paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: colors.border,
  },
  metaChipCod: { backgroundColor: '#fef3c7', borderColor: '#fcd34d' },
  metaText: { fontSize: 11, fontWeight: '500', color: colors.textMuted },

  callBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  callBtnText: { fontSize: 18 },

  empty: { alignItems: 'center', paddingTop: spacing.xxl },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
  emptyText:  { fontSize: 16, color: colors.textMuted },
});
