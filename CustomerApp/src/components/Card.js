import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme';

export default function Card({ children, style, padded = true }) {
  return (
    <View style={[styles.card, padded && styles.padded, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    ...shadow.sm,
  },
  padded: {
    padding: spacing.md,
  },
});
