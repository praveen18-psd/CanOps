import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Switch,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import Button from '../components/Button';
import { subscription, timeSlots } from '../data/mockData';

const FREQ_OPTIONS = [
  { key: 'daily',     label: 'Daily',           icon: '📅', desc: 'Every day' },
  { key: 'alternate', label: 'Alternate Days',  icon: '🔄', desc: 'Mon, Wed, Fri...' },
  { key: 'custom',    label: 'Custom Days',     icon: '⚙️', desc: 'Pick your days' },
];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function SubscriptionScreen({ navigation }) {
  const [active, setActive]     = useState(subscription.active);
  const [freq, setFreq]         = useState(subscription.type);
  const [slot, setSlot]         = useState(subscription.slot);
  const [cans, setCans]         = useState(subscription.cansPerDay);
  const [customDays, setCustomDays] = useState(['Mon', 'Wed', 'Fri']);
  const [paused, setPaused]     = useState(!!subscription.pausedUntil);
  const [saved, setSaved]       = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleDay = (day) => {
    setCustomDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription</Text>
        <View style={{ width: 36 }} />
      </View>

      {saved && (
        <View style={styles.savedBanner}>
          <Text style={styles.savedText}>✓ Subscription updated!</Text>
        </View>
      )}

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Status card */}
          <View style={[styles.statusCard, { backgroundColor: active ? colors.primaryLight : '#f1f5f9' }]}>
            <View>
              <Text style={styles.statusTitle}>
                {active ? '🔔 Active Subscription' : '⏸ Subscription Paused'}
              </Text>
              <Text style={styles.statusSub}>
                {active
                  ? `Next delivery: ${subscription.nextDelivery}`
                  : `Paused until: ${subscription.pausedUntil || 'Indefinitely'}`
                }
              </Text>
            </View>
            <Switch
              value={active}
              onValueChange={setActive}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          {/* Frequency */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Frequency</Text>
            <View style={styles.freqOptions}>
              {FREQ_OPTIONS.map(f => (
                <TouchableOpacity
                  key={f.key}
                  onPress={() => setFreq(f.key)}
                  style={[styles.freqBtn, freq === f.key && styles.freqBtnActive]}
                >
                  <Text style={styles.freqIcon}>{f.icon}</Text>
                  <Text style={[styles.freqLabel, freq === f.key && styles.freqLabelActive]}>
                    {f.label}
                  </Text>
                  <Text style={styles.freqDesc}>{f.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {freq === 'custom' && (
              <View style={styles.customDays}>
                <Text style={styles.customDaysLabel}>Select delivery days</Text>
                <View style={styles.daysRow}>
                  {DAYS.map(day => (
                    <TouchableOpacity
                      key={day}
                      onPress={() => toggleDay(day)}
                      style={[styles.dayBtn, customDays.includes(day) && styles.dayBtnActive]}
                    >
                      <Text style={[styles.dayBtnText, customDays.includes(day) && styles.dayBtnTextActive]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Cans per delivery */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cans per Delivery</Text>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                onPress={() => setCans(Math.max(1, cans - 1))}
                style={styles.qtyBtn}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <View style={styles.qtyCenter}>
                <Text style={styles.qtyValue}>{cans}</Text>
                <Text style={styles.qtyUnit}>can{cans > 1 ? 's' : ''} per delivery</Text>
              </View>
              <TouchableOpacity
                onPress={() => setCans(Math.min(5, cans + 1))}
                style={styles.qtyBtn}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Delivery slot */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Preferred Time Slot</Text>
            <View style={styles.slots}>
              {timeSlots.map(s => (
                <TouchableOpacity
                  key={s.key}
                  onPress={() => setSlot(s.key)}
                  style={[styles.slotBtn, slot === s.key && styles.slotBtnActive]}
                >
                  <Text style={styles.slotEmoji}>{s.icon}</Text>
                  <View style={styles.slotText}>
                    <Text style={[styles.slotLabel, slot === s.key && styles.slotLabelActive]}>
                      {s.label}
                    </Text>
                    <Text style={styles.slotTime}>{s.time}</Text>
                  </View>
                  <View style={[styles.radioOuter, slot === s.key && styles.radioOuterActive]}>
                    {slot === s.key && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Auto-deduct notice */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💡 Subscription orders are auto-debited from your wallet on delivery. Make sure your wallet balance stays topped up.
            </Text>
          </View>

          <Button title="Save Subscription" onPress={handleSave} />

          <TouchableOpacity style={styles.pauseBtn}>
            <Text style={styles.pauseBtnText}>{paused ? '▶ Resume Subscription' : '⏸ Pause for 7 Days'}</Text>
          </TouchableOpacity>
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

  savedBanner: {
    backgroundColor: '#dcfce7', paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: '#bbf7d0',
  },
  savedText: { fontSize: 14, fontWeight: '600', color: '#166534', textAlign: 'center' },

  scroll: { flex: 1 },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xxl },

  statusCard: {
    borderRadius: radius.lg, padding: spacing.md,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  statusTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  statusSub: { fontSize: 12, color: colors.textMuted, marginTop: 4 },

  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md, ...shadow.sm },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.md },

  freqOptions: { flexDirection: 'row', gap: spacing.xs },
  freqBtn: {
    flex: 1, alignItems: 'center', padding: spacing.sm,
    borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.background,
  },
  freqBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  freqIcon: { fontSize: 22, marginBottom: 4 },
  freqLabel: { fontSize: 12, fontWeight: '600', color: colors.text, textAlign: 'center' },
  freqLabelActive: { color: colors.primary },
  freqDesc: { fontSize: 10, color: colors.textLight, marginTop: 2, textAlign: 'center' },

  customDays: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.background },
  customDaysLabel: { fontSize: 12, fontWeight: '600', color: colors.textMuted, marginBottom: spacing.sm },
  daysRow: { flexDirection: 'row', gap: spacing.xs },
  dayBtn: {
    flex: 1, paddingVertical: spacing.sm, alignItems: 'center',
    borderRadius: radius.sm, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.background,
  },
  dayBtnActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  dayBtnText: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
  dayBtnTextActive: { color: colors.white },

  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  qtyBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnText: { color: colors.white, fontSize: 24, fontWeight: '700', lineHeight: 26 },
  qtyCenter: { alignItems: 'center' },
  qtyValue: { fontSize: 36, fontWeight: '800', color: colors.text },
  qtyUnit: { fontSize: 13, color: colors.textMuted, marginTop: 2 },

  slots: { gap: spacing.sm },
  slotBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    padding: spacing.md, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.background,
  },
  slotBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  slotEmoji: { fontSize: 22 },
  slotText: { flex: 1 },
  slotLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  slotLabelActive: { color: colors.primary },
  slotTime: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  radioOuterActive: { borderColor: colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },

  infoBox: {
    backgroundColor: '#fef9c3', borderRadius: radius.md,
    padding: spacing.md, borderLeftWidth: 3, borderLeftColor: '#eab308',
  },
  infoText: { fontSize: 13, color: '#713f12', lineHeight: 18 },

  pauseBtn: {
    borderWidth: 1.5, borderColor: colors.warning, borderRadius: radius.lg,
    paddingVertical: 14, alignItems: 'center',
  },
  pauseBtnText: { color: colors.warning, fontSize: 15, fontWeight: '600' },
});
