import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Animated, Linking,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import { activeOrder, orderStatuses } from '../data/mockData';

const STEPS = ['confirmed', 'assigned', 'out_delivery', 'delivered'];

function StepIndicator({ currentStatus }) {
  const currentIdx = STEPS.indexOf(currentStatus);
  return (
    <View style={styles.stepRow}>
      {STEPS.map((step, idx) => {
        const isDone    = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const cfg = orderStatuses.find(s => s.key === step);
        return (
          <React.Fragment key={step}>
            <View style={styles.stepItem}>
              <View style={[
                styles.stepCircle,
                isDone    && styles.stepCircleDone,
                isCurrent && styles.stepCircleCurrent,
              ]}>
                {isDone ? (
                  <Text style={styles.stepCheck}>✓</Text>
                ) : (
                  <View style={[styles.stepDot, isCurrent && styles.stepDotActive]} />
                )}
              </View>
              <Text style={[
                styles.stepLabel,
                isDone    && styles.stepLabelDone,
                isCurrent && styles.stepLabelCurrent,
              ]}>
                {cfg?.label}
              </Text>
            </View>
            {idx < STEPS.length - 1 && (
              <View style={[styles.stepLine, idx < currentIdx && styles.stepLineDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

function MapPlaceholder() {
  return (
    <View style={styles.mapContainer}>
      <View style={styles.mapGrid} />
      {/* Rider dot */}
      <View style={[styles.mapPin, styles.riderPin]}>
        <Text style={{ fontSize: 20 }}>🛵</Text>
      </View>
      {/* Destination pin */}
      <View style={[styles.mapPin, styles.destPin]}>
        <Text style={{ fontSize: 20 }}>🏠</Text>
      </View>
      {/* Dotted route */}
      <View style={styles.routeLine} />
      <View style={styles.mapOverlay}>
        <Text style={styles.mapOverlayText}>Live Map View</Text>
        <Text style={styles.mapOverlaySubtext}>Google Maps integration</Text>
      </View>
    </View>
  );
}

export default function TrackingScreen({ navigation }) {
  const order = activeOrder;
  const [status, setStatus] = useState(order?.status || 'out_delivery');
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Pulse animation for the live indicator
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const handleCall = () => {
    if (order?.deliveryPerson?.phone) {
      Linking.openURL(`tel:${order.deliveryPerson.phone}`);
    }
  };

  if (!order) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📦</Text>
          <Text style={styles.emptyTitle}>No active order</Text>
          <Text style={styles.emptySubtitle}>Place an order from the home screen</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backHomeBtn}>
            <Text style={styles.backHomeBtnText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order</Text>
        <View style={styles.liveIndicator}>
          <Animated.View style={[styles.liveDot, { transform: [{ scale: pulseAnim }] }]} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Map */}
        <MapPlaceholder />

        {/* ETA card */}
        <View style={styles.etaCard}>
          <View style={styles.etaMain}>
            <Text style={styles.etaNumber}>{order.eta}</Text>
            <Text style={styles.etaLabel}>Estimated Arrival</Text>
          </View>
          <View style={styles.etaDivider} />
          <View style={styles.etaDetail}>
            <Text style={styles.etaDetailLabel}>Delivery by</Text>
            <Text style={styles.etaDetailValue}>Murugan S</Text>
          </View>
          <TouchableOpacity onPress={handleCall} style={styles.callBtn}>
            <Text style={styles.callIcon}>📞</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Step indicator */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Order Status</Text>
            <StepIndicator currentStatus={status} />
          </View>

          {/* Order details */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Order Details</Text>
            <View style={styles.detailsGrid}>
              {[
                { label: 'Order ID',      value: order.id },
                { label: 'Cans',          value: `${order.cans} × 20L` },
                { label: 'Amount',        value: `₹${order.amount}` },
                { label: 'Slot',          value: 'Morning (7–10 AM)' },
                { label: 'Payment',       value: 'Wallet' },
                { label: 'Placed at',     value: order.placedAt },
              ].map(d => (
                <View key={d.label} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{d.label}</Text>
                  <Text style={styles.detailValue}>{d.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Delivery address */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Delivering to</Text>
            <View style={styles.addressRow}>
              <Text style={styles.addressPin}>📍</Text>
              <Text style={styles.addressText}>{order.address}</Text>
            </View>
          </View>

          {/* Cancel button */}
          {status !== 'delivered' && status !== 'out_delivery' && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelBtnText}>Cancel Order</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: {
    backgroundColor: colors.white,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 22, color: colors.text },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' },
  liveText: { fontSize: 12, fontWeight: '600', color: '#22c55e' },

  scroll: { flex: 1 },

  mapContainer: {
    height: 220, backgroundColor: '#e8f4fd',
    position: 'relative', overflow: 'hidden',
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  mapPin: { position: 'absolute' },
  riderPin: { left: '35%', top: '50%' },
  destPin:  { right: '25%', top: '25%' },
  routeLine: {
    position: 'absolute', left: '38%', top: '28%',
    width: '28%', height: 2,
    backgroundColor: colors.primary, opacity: 0.6,
    transform: [{ rotate: '-30deg' }],
  },
  mapOverlay: {
    position: 'absolute', bottom: 12, left: 0, right: 0,
    alignItems: 'center',
  },
  mapOverlayText: { fontSize: 13, fontWeight: '600', color: colors.primaryDark },
  mapOverlaySubtext: { fontSize: 11, color: colors.primary, marginTop: 2 },

  etaCard: {
    backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md, gap: spacing.md,
  },
  etaMain: { flex: 1 },
  etaNumber: { fontSize: 28, fontWeight: '800', color: colors.white },
  etaLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  etaDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.3)' },
  etaDetail: { flex: 1 },
  etaDetailLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  etaDetailValue: { fontSize: 15, fontWeight: '700', color: colors.white, marginTop: 2 },
  callBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  callIcon: { fontSize: 20 },

  content: { padding: spacing.md, gap: spacing.md },

  card: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.md, ...shadow.sm,
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.md },

  stepRow: { flexDirection: 'row', alignItems: 'center' },
  stepItem: { alignItems: 'center', flex: 1 },
  stepCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  stepCircleDone:    { backgroundColor: colors.success },
  stepCircleCurrent: { backgroundColor: colors.primary },
  stepCheck: { color: colors.white, fontSize: 14, fontWeight: '700' },
  stepDot:   { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.textLight },
  stepDotActive: { backgroundColor: colors.white },
  stepLine: { flex: 1, height: 2, backgroundColor: colors.border, marginBottom: 22 },
  stepLineDone: { backgroundColor: colors.success },
  stepLabel: { fontSize: 10, fontWeight: '500', color: colors.textLight, textAlign: 'center' },
  stepLabelDone:    { color: colors.success },
  stepLabelCurrent: { color: colors.primary, fontWeight: '700' },

  detailsGrid: { gap: spacing.xs },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.background,
  },
  detailLabel: { fontSize: 13, color: colors.textMuted },
  detailValue: { fontSize: 13, fontWeight: '600', color: colors.text },

  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs },
  addressPin: { fontSize: 18 },
  addressText: { flex: 1, fontSize: 14, color: colors.text, lineHeight: 20 },

  cancelBtn: {
    borderWidth: 1.5, borderColor: colors.error, borderRadius: radius.lg,
    paddingVertical: 14, alignItems: 'center',
  },
  cancelBtnText: { color: colors.error, fontSize: 15, fontWeight: '600' },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyEmoji: { fontSize: 60, marginBottom: spacing.md },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.text },
  emptySubtitle: { fontSize: 14, color: colors.textMuted, marginTop: 6 },
  backHomeBtn: {
    marginTop: spacing.lg, backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl, paddingVertical: 12, borderRadius: radius.full,
  },
  backHomeBtnText: { color: colors.white, fontWeight: '600' },
});
