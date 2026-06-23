import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DELIVERY_STATUSES } from '../data/mockData';
import { radius } from '../theme';

export default function DeliveryStatusBadge({ status, style }) {
  const cfg = DELIVERY_STATUSES[status] || DELIVERY_STATUSES.pending;
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }, style]}>
      <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
      <Text style={[styles.text, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: radius.full, alignSelf: 'flex-start',
  },
  dot:  { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 12, fontWeight: '600' },
});
