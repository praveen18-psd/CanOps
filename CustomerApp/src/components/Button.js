import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { colors, radius, typography } from '../theme';

export default function Button({
  title, onPress, variant = 'primary', size = 'md',
  loading = false, disabled = false, icon, style, textStyle,
}) {
  const isOutline = variant === 'outline';
  const isGhost   = variant === 'ghost';
  const isSm      = size === 'sm';

  const bg = isOutline || isGhost ? 'transparent' : colors.primary;
  const borderColor = isOutline ? colors.primary : 'transparent';
  const textColor   = isOutline || isGhost ? colors.primary : colors.white;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        { backgroundColor: bg, borderColor, borderWidth: isOutline ? 1.5 : 0 },
        isSm && styles.sm,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.row}>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text style={[styles.text, { color: textColor }, isSm && styles.textSm, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sm: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: radius.md },
  disabled: { opacity: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { marginRight: 8 },
  text: { fontSize: 16, fontWeight: '600', letterSpacing: 0.3 },
  textSm: { fontSize: 14 },
});
