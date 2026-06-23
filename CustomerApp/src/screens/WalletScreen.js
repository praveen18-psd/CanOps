import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, TextInput,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import Button from '../components/Button';
import { currentUser, walletTransactions } from '../data/mockData';

const TOP_UP_PRESETS = [100, 200, 500, 1000];

function TransactionRow({ tx }) {
  const isCredit = tx.type === 'credit';
  return (
    <View style={styles.txRow}>
      <View style={[styles.txIcon, { backgroundColor: isCredit ? '#dcfce7' : '#fee2e2' }]}>
        <Text style={{ fontSize: 16 }}>{isCredit ? '⬆️' : '⬇️'}</Text>
      </View>
      <View style={styles.txContent}>
        <Text style={styles.txLabel}>{tx.label}</Text>
        <Text style={styles.txDate}>{tx.date}</Text>
      </View>
      <View style={styles.txRight}>
        <Text style={[styles.txAmount, { color: isCredit ? colors.success : colors.error }]}>
          {isCredit ? '+' : '−'}₹{tx.amount}
        </Text>
        <Text style={styles.txBalance}>Bal: ₹{tx.balance}</Text>
      </View>
    </View>
  );
}

export default function WalletScreen({ navigation }) {
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [payMethod, setPayMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [tab, setTab] = useState('topup'); // 'topup' | 'history'

  const amount = selectedPreset || parseInt(customAmount) || 0;

  const handleTopUp = () => {
    if (amount < 10) return;
    setProcessing(true);
    setTimeout(() => setProcessing(false), 1800);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Balance hero */}
        <View style={styles.balanceHero}>
          <View style={styles.balanceCircle}>
            <Text style={styles.balanceSymbol}>₹</Text>
            <Text style={styles.balanceValue}>{currentUser.walletBalance}</Text>
          </View>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <View style={styles.balanceMeta}>
            <Text style={styles.balanceMetaText}>
              💳 Good for ~{Math.floor(currentUser.walletBalance / 50)} more orders
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {[{ key: 'topup', label: '+ Top Up' }, { key: 'history', label: '📋 History' }].map(t => (
            <TouchableOpacity
              key={t.key}
              onPress={() => setTab(t.key)}
              style={[styles.tab, tab === t.key && styles.tabActive]}
            >
              <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.content}>
          {tab === 'topup' ? (
            <>
              {/* Preset amounts */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Select Amount</Text>
                <View style={styles.presetsGrid}>
                  {TOP_UP_PRESETS.map(p => (
                    <TouchableOpacity
                      key={p}
                      onPress={() => { setSelectedPreset(p); setCustomAmount(''); }}
                      style={[styles.presetBtn, selectedPreset === p && styles.presetBtnActive]}
                    >
                      <Text style={[styles.presetText, selectedPreset === p && styles.presetTextActive]}>
                        ₹{p}
                      </Text>
                      {p === 200 && <Text style={styles.presetTag}>Popular</Text>}
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.orText}>or enter custom amount</Text>
                <View style={styles.customInput}>
                  <Text style={styles.rupeeSign}>₹</Text>
                  <TextInput
                    style={styles.customInputField}
                    placeholder="Enter amount"
                    placeholderTextColor={colors.textLight}
                    keyboardType="number-pad"
                    value={customAmount}
                    onChangeText={v => { setCustomAmount(v); setSelectedPreset(null); }}
                  />
                </View>
              </View>

              {/* Payment method */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Payment Method</Text>
                <View style={styles.payMethods}>
                  {[
                    { key: 'upi',    label: 'UPI',             icon: '📲', sub: 'GPay, PhonePe, Paytm' },
                    { key: 'card',   label: 'Debit / Credit',  icon: '💳', sub: 'Visa, Mastercard, RuPay' },
                    { key: 'netbank',label: 'Net Banking',      icon: '🏦', sub: 'All major banks' },
                  ].map(pm => (
                    <TouchableOpacity
                      key={pm.key}
                      onPress={() => setPayMethod(pm.key)}
                      style={[styles.payMethod, payMethod === pm.key && styles.payMethodActive]}
                    >
                      <Text style={styles.payMethodIcon}>{pm.icon}</Text>
                      <View style={styles.payMethodText}>
                        <Text style={[styles.payMethodLabel, payMethod === pm.key && { color: colors.primary }]}>
                          {pm.label}
                        </Text>
                        <Text style={styles.payMethodSub}>{pm.sub}</Text>
                      </View>
                      <View style={[styles.radioOuter, payMethod === pm.key && styles.radioOuterActive]}>
                        {payMethod === pm.key && <View style={styles.radioInner} />}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Cashback banner */}
              {amount >= 200 && (
                <View style={styles.cashbackBanner}>
                  <Text style={styles.cashbackText}>
                    🎉 Top up ₹{amount}+ and get ₹10 cashback!
                  </Text>
                </View>
              )}

              <Button
                title={amount >= 10 ? `Add ₹${amount} to Wallet` : 'Select an amount'}
                onPress={handleTopUp}
                loading={processing}
                disabled={amount < 10}
              />
            </>
          ) : (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Transaction History</Text>
              {walletTransactions.slice().reverse().map(tx => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </View>
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

  balanceHero: {
    backgroundColor: colors.primary, alignItems: 'center',
    paddingTop: spacing.xl, paddingBottom: spacing.xl + 16,
  },
  balanceCircle: { flexDirection: 'row', alignItems: 'flex-start' },
  balanceSymbol: { fontSize: 22, fontWeight: '700', color: 'rgba(255,255,255,0.8)', marginTop: 10 },
  balanceValue: { fontSize: 56, fontWeight: '800', color: colors.white, lineHeight: 64 },
  balanceLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  balanceMeta: {
    marginTop: spacing.sm, backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  },
  balanceMetaText: { fontSize: 13, color: colors.white },

  scroll: { flex: 1, marginTop: -16 },

  tabs: {
    flexDirection: 'row', backgroundColor: colors.white,
    borderRadius: radius.lg, margin: spacing.md, padding: 4, ...shadow.sm,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radius.md },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  tabTextActive: { color: colors.white },

  content: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl, gap: spacing.md },

  card: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.md, ...shadow.sm,
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.md },

  presetsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  presetBtn: {
    flex: 1, minWidth: '22%', alignItems: 'center', paddingVertical: spacing.md,
    borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.background, position: 'relative',
  },
  presetBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  presetText: { fontSize: 17, fontWeight: '700', color: colors.text },
  presetTextActive: { color: colors.primary },
  presetTag: {
    position: 'absolute', top: -8, right: 4,
    backgroundColor: colors.success, color: colors.white,
    fontSize: 9, fontWeight: '700', paddingHorizontal: 5, paddingVertical: 2,
    borderRadius: radius.full,
    overflow: 'hidden',
  },

  orText: { textAlign: 'center', color: colors.textLight, fontSize: 12, marginBottom: spacing.sm },
  customInput: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.background, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.border, paddingHorizontal: spacing.md,
  },
  rupeeSign: { fontSize: 18, fontWeight: '700', color: colors.text, marginRight: 4 },
  customInputField: { flex: 1, fontSize: 20, fontWeight: '700', color: colors.text, paddingVertical: 12 },

  payMethods: { gap: spacing.sm },
  payMethod: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.md, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.background, gap: spacing.sm,
  },
  payMethodActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  payMethodIcon: { fontSize: 22 },
  payMethodText: { flex: 1 },
  payMethodLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  payMethodSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  radioOuterActive: { borderColor: colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },

  cashbackBanner: {
    backgroundColor: '#dcfce7', borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2,
  },
  cashbackText: { fontSize: 13, fontWeight: '600', color: '#166534' },

  txRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1, borderBottomColor: colors.background,
  },
  txIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  txContent: { flex: 1 },
  txLabel: { fontSize: 13, fontWeight: '500', color: colors.text },
  txDate: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  txRight: { alignItems: 'flex-end' },
  txAmount: { fontSize: 14, fontWeight: '700' },
  txBalance: { fontSize: 11, color: colors.textLight, marginTop: 1 },
});
