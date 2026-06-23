import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { radius, typography } from '../theme';

const STATUS = {
  delivered:    { label: 'Delivered',        bg: '#dcfce7', text: '#16a34a' },
  out_delivery: { label: 'Out for Delivery', bg: '#fef3c7', text: '#d97706' },
  assigned:     { label: 'Assigned',         bg: '#ede9fe', text: '#7c3aed' },
  confirmed:    { label: 'Confirmed',        bg: '#dbeafe', text: '#2563eb' },
  failed:       { label: 'Failed',           bg: '#fee2e2', text: '#dc2626' },
  cancelled:    { label: 'Cancelled',        bg: '#f1f5f9', text: '#64748b' },
};

export default function StatusBadge({ status, style }) {
  const cfg = STATUS[status] || STATUS.confirmed;
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }, style]}>
      <Text style={[styles.text, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 12, fontWeight: '600' },
});
