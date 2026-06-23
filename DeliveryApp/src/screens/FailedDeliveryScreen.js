import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, TextInput, Alert,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import BigButton from '../components/BigButton';
import { deliveries, FAILURE_REASONS } from '../data/mockData';

export default function FailedDeliveryScreen({ route, navigation }) {
  const { orderId } = route.params;
  const delivery = deliveries.find(d => d.id === orderId);

  const [selectedReason, setSelectedReason] = useState(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!delivery) return null;

  const handleSubmit = () => {
    if (!selectedReason) {
      Alert.alert('Select a reason', 'Please select why the delivery failed before submitting.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        'Failure reported',
        'The dealer has been notified. You can move to the next stop.',
        [{ text: 'OK', onPress: () => navigation.popToTop() }]
      );
    }, 1400);
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.card} />

      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Report Failed Delivery</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Customer card */}
        <View style={s.customerCard}>
          <View style={s.failIcon}>
            <Text style={s.failIconText}>✗</Text>
          </View>
          <View style={s.customerInfo}>
            <Text style={s.customerName}>{delivery.customerName}</Text>
            <Text style={s.customerAddress} numberOfLines={1}>{delivery.address}</Text>
            <Text style={s.customerMeta}>
              {delivery.cans} can{delivery.cans > 1 ? 's' : ''} · {delivery.paymentMode === 'cod' ? `₹${delivery.amount} cash` : 'Wallet'}
            </Text>
          </View>
        </View>

        {/* Reason selector */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Reason for Failure <Text style={s.required}>*</Text></Text>
          {FAILURE_REASONS.map((reason) => (
            <TouchableOpacity
              key={reason.key}
              onPress={() => setSelectedReason(reason.key)}
              style={[s.reasonCard, selectedReason === reason.key && s.reasonCardSelected]}
              activeOpacity={0.8}
            >
              <View style={[s.radioOuter, selectedReason === reason.key && s.radioOuterSelected]}>
                {selectedReason === reason.key && <View style={s.radioInner} />}
              </View>
              <View style={s.reasonContent}>
                <Text style={[s.reasonEmoji]}>{reason.emoji}</Text>
                <View>
                  <Text style={[s.reasonLabel, selectedReason === reason.key && s.reasonLabelSelected]}>
                    {reason.label}
                  </Text>
                  <Text style={s.reasonSub}>{reason.sub}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Additional notes */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Additional Notes <Text style={s.optional}>(optional)</Text></Text>
          <TextInput
            style={s.notesInput}
            placeholder="Any extra details the dealer should know…"
            placeholderTextColor={colors.textLight}
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>

        {/* Dealer notification note */}
        <View style={s.infoBox}>
          <Text style={s.infoEmoji}>📢</Text>
          <Text style={s.infoText}>
            The dealer will be notified via SMS/WhatsApp. A re-delivery can be scheduled from the dealer portal.
          </Text>
        </View>

        <View style={s.actions}>
          <BigButton
            title="Submit Failure Report"
            icon="📋"
            onPress={handleSubmit}
            loading={submitting}
            color={colors.error}
          />
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.cancelBtn}>
            <Text style={s.cancelText}>Cancel — go back</Text>
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

  scroll: { flex: 1 },

  customerCard: {
    backgroundColor: '#fef2f2', flexDirection: 'row', alignItems: 'center',
    gap: spacing.md, padding: spacing.md,
    borderBottomWidth: 1, borderBottomColor: '#fecaca',
  },
  failIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.error, alignItems: 'center', justifyContent: 'center',
  },
  failIconText: { fontSize: 20, fontWeight: '800', color: '#fff' },
  customerInfo: { flex: 1 },
  customerName:    { fontSize: 16, fontWeight: '700', color: colors.text },
  customerAddress: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  customerMeta:    { fontSize: 12, color: colors.textMuted, marginTop: 2 },

  section: { padding: spacing.md },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  required: { color: colors.error },
  optional: { fontWeight: '400', color: colors.textMuted },

  reasonCard: {
    backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.md,
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginBottom: spacing.xs, borderWidth: 2, borderColor: 'transparent', ...shadow.sm,
  },
  reasonCardSelected: { borderColor: colors.error, backgroundColor: '#fef2f2' },
  radioOuter: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2,
    borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  radioOuterSelected: { borderColor: colors.error },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.error },
  reasonContent: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  reasonEmoji: { fontSize: 22 },
  reasonLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  reasonLabelSelected: { color: colors.error },
  reasonSub:   { fontSize: 12, color: colors.textMuted, marginTop: 2 },

  notesInput: {
    backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md,
    fontSize: 14, color: colors.text, borderWidth: 1, borderColor: colors.border,
    minHeight: 100,
  },

  infoBox: {
    flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start',
    marginHorizontal: spacing.md, marginBottom: spacing.md,
    backgroundColor: '#f0fdf4', borderRadius: radius.md, padding: spacing.md,
    borderWidth: 1, borderColor: '#a7f3d0',
  },
  infoEmoji: { fontSize: 18 },
  infoText: { flex: 1, fontSize: 12, color: '#065f46', lineHeight: 18 },

  actions: { padding: spacing.md, paddingBottom: spacing.xxl, gap: spacing.sm },
  cancelBtn: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg,
    paddingVertical: 14, alignItems: 'center',
  },
  cancelText: { fontSize: 15, color: colors.textMuted, fontWeight: '600' },
});
