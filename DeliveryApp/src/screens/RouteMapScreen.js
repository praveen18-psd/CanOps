import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Linking, Alert,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import BigButton from '../components/BigButton';
import { deliveries } from '../data/mockData';

const pending = deliveries.filter(d => d.status !== 'delivered' && d.status !== 'failed');

// Simple nearest-neighbour order as a fake optimised route
const optimised = [...pending].sort((a, b) => a.seq - b.seq);

export default function RouteMapScreen({ navigation }) {
  const [reordered, setReordered] = useState(optimised);
  const [optimising, setOptimising] = useState(false);
  const [done, setDone] = useState(false);

  const handleOptimise = () => {
    setOptimising(true);
    setTimeout(() => {
      // Shuffle to simulate a different optimised order
      const o = [...optimised].reverse();
      setReordered(o);
      setOptimising(false);
      setDone(true);
    }, 1800);
  };

  const openGoogleMaps = () => {
    const waypoints = reordered.map(d => `${d.location.lat},${d.location.lng}`).join('|');
    const dest = reordered[reordered.length - 1];
    const url = `https://www.google.com/maps/dir/?api=1&destination=${dest.location.lat},${dest.location.lng}&waypoints=${waypoints}&travelmode=driving`;
    Linking.openURL(url);
  };

  const moveUp = (idx) => {
    if (idx === 0) return;
    const next = [...reordered];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setReordered(next);
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.card} />

      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Route Optimiser</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Map placeholder */}
      <View style={s.mapBox}>
        <View style={s.mapBg} />
        {/* Fake route path */}
        {reordered.map((stop, idx) => (
          <View
            key={stop.id}
            style={[
              s.mapPin,
              {
                left: `${18 + idx * 14}%`,
                top:  `${20 + (idx % 3) * 22}%`,
              },
            ]}
          >
            <View style={[s.pinCircle, idx === 0 && s.pinCircleStart]}>
              <Text style={s.pinNum}>{idx + 1}</Text>
            </View>
          </View>
        ))}
        <View style={s.mapOverlay}>
          <Text style={s.mapOverlayText}>Google Maps integration</Text>
          <Text style={s.mapOverlaySub}>{reordered.length} stops · ~{reordered.length * 8} min est.</Text>
        </View>
        {done && (
          <View style={s.optimisedBadge}>
            <Text style={s.optimisedBadgeText}>⚡ Optimised Route</Text>
          </View>
        )}
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Stop list — drag-to-reorder (simplified) */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Stop Order  <Text style={s.sectionSub}>(tap ↑ to reorder)</Text></Text>
          {reordered.map((stop, idx) => (
            <View key={stop.id} style={s.stopCard}>
              <View style={[s.stopNum, idx === 0 && s.stopNumStart]}>
                <Text style={[s.stopNumText, idx === 0 && { color: colors.primary }]}>
                  {idx === 0 ? '▶' : idx + 1}
                </Text>
              </View>
              <View style={s.stopInfo}>
                <Text style={s.stopName}>{stop.customerName}</Text>
                <Text style={s.stopAddress} numberOfLines={1}>{stop.address}</Text>
                <View style={s.stopMeta}>
                  <Text style={s.stopMetaText}>🪣 {stop.cans}</Text>
                  {stop.paymentMode === 'cod' && <Text style={[s.stopMetaText, s.codTag]}>💵 Cash</Text>}
                </View>
              </View>
              {idx > 0 && (
                <TouchableOpacity onPress={() => moveUp(idx)} style={s.moveUpBtn}>
                  <Text style={s.moveUpIcon}>↑</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <View style={s.actions}>
          <BigButton
            title={done ? 'Re-Optimise' : 'Optimise Route'}
            icon="⚡"
            onPress={handleOptimise}
            loading={optimising}
            color={colors.primary}
          />
          <BigButton
            title="Open in Google Maps"
            icon="🗺"
            onPress={openGoogleMaps}
            color={colors.accent}
          />
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backToList}>
            <Text style={s.backToListText}>← Back to Delivery List</Text>
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

  mapBox: {
    height: 200, backgroundColor: '#dbeafe', position: 'relative', overflow: 'hidden',
  },
  mapBg: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.25,
  },
  mapPin:       { position: 'absolute' },
  pinCircle:    { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.textMuted, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  pinCircleStart: { backgroundColor: colors.primary },
  pinNum:       { fontSize: 12, fontWeight: '800', color: '#fff' },
  mapOverlay:   { position: 'absolute', bottom: 10, left: 0, right: 0, alignItems: 'center' },
  mapOverlayText: { fontSize: 13, fontWeight: '600', color: '#1e3a5f' },
  mapOverlaySub:  { fontSize: 11, color: '#2563eb', marginTop: 2 },
  optimisedBadge: {
    position: 'absolute', top: 10, right: 10,
    backgroundColor: colors.primary, borderRadius: radius.full,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  optimisedBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },

  scroll: { flex: 1 },
  section: { padding: spacing.md },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  sectionSub:   { fontSize: 12, fontWeight: '400', color: colors.textMuted },

  stopCard: {
    backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md,
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginBottom: spacing.xs, ...shadow.sm,
  },
  stopNum:      { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.background, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stopNumStart: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  stopNumText:  { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  stopInfo:     { flex: 1 },
  stopName:     { fontSize: 14, fontWeight: '700', color: colors.text },
  stopAddress:  { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  stopMeta:     { flexDirection: 'row', gap: spacing.sm, marginTop: 4 },
  stopMetaText: { fontSize: 11, color: colors.textMuted },
  codTag:       { color: '#92400e', backgroundColor: '#fef3c7', paddingHorizontal: 4, borderRadius: 4 },
  moveUpBtn:    { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  moveUpIcon:   { fontSize: 16, fontWeight: '800', color: colors.primary },

  actions: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xxl },
  backToList: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg,
    paddingVertical: 14, alignItems: 'center',
  },
  backToListText: { fontSize: 15, color: colors.text, fontWeight: '600' },
});
