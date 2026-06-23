import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, SafeAreaView,
  StatusBar, ActivityIndicator,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';

export default function LoginScreen({ navigation }) {
  const [step, setStep]       = useState('phone');
  const [phone, setPhone]     = useState('');
  const [otp, setOtp]         = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef([]);

  const sendOtp = () => {
    if (phone.length < 10) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('otp'); }, 1400);
  };

  const handleOtpChange = (val, idx) => {
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 3) otpRefs.current[idx + 1]?.focus();
    if (!val && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const verify = () => {
    if (otp.join('').length < 4) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); navigation.replace('Main'); }, 1400);
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <View style={s.header}>
        <Text style={s.appName}>CanOps</Text>
        <Text style={s.appRole}>Delivery Partner</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <View style={s.heroRow}>
            <Text style={s.heroEmoji}>🛵</Text>
            <View>
              <Text style={s.heroTitle}>Welcome back!</Text>
              <Text style={s.heroSub}>Log in to start your shift</Text>
            </View>
          </View>

          <View style={s.card}>
            {step === 'phone' ? (
              <>
                <Text style={s.label}>Mobile Number</Text>
                <View style={s.phoneRow}>
                  <View style={s.flag}>
                    <Text style={{ fontSize: 16 }}>🇮🇳 +91</Text>
                  </View>
                  <TextInput
                    style={s.input}
                    placeholder="94451 XXXXX"
                    placeholderTextColor={colors.textLight}
                    keyboardType="number-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={setPhone}
                    autoFocus
                  />
                </View>
                <TouchableOpacity
                  onPress={sendOtp}
                  disabled={phone.length < 10 || loading}
                  style={[s.btn, (phone.length < 10 || loading) && s.btnDisabled]}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={s.btnText}>Send OTP</Text>
                  }
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity onPress={() => setStep('phone')} style={s.backRow}>
                  <Text style={s.backArrow}>← </Text>
                  <Text style={s.backText}>+91 {phone}</Text>
                </TouchableOpacity>
                <Text style={s.label}>Enter 4-digit OTP</Text>
                <View style={s.otpRow}>
                  {otp.map((d, i) => (
                    <TextInput
                      key={i}
                      ref={r => { otpRefs.current[i] = r; }}
                      style={[s.otpBox, d && s.otpBoxFilled]}
                      value={d}
                      onChangeText={v => handleOtpChange(v.slice(-1), i)}
                      keyboardType="number-pad"
                      maxLength={1}
                      textAlign="center"
                    />
                  ))}
                </View>
                <TouchableOpacity
                  onPress={verify}
                  disabled={otp.join('').length < 4 || loading}
                  style={[s.btn, otp.join('').length < 4 && s.btnDisabled]}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={s.btnText}>Verify & Start Shift</Text>
                  }
                </TouchableOpacity>
                <TouchableOpacity style={s.resendRow}>
                  <Text style={s.resendText}>Resend OTP</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <Text style={s.dealer}>
            Session linked to: <Text style={{ fontWeight: '700', color: colors.primary }}>Sri Murugan Water Depot</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.primaryDark },
  header:  { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xl, alignItems: 'center' },
  appName: { fontSize: 34, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  appRole: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 2, letterSpacing: 1.5, textTransform: 'uppercase' },

  scroll: { flexGrow: 1, backgroundColor: colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: spacing.lg, paddingBottom: spacing.xxl },

  heroRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  heroEmoji: { fontSize: 48 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: colors.black },
  heroSub:   { fontSize: 14, color: colors.textMuted, marginTop: 2 },

  card: { backgroundColor: colors.card, borderRadius: radius.xl, padding: spacing.lg, ...shadow.md, marginBottom: spacing.md },

  label: { fontSize: 12, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: spacing.sm },

  phoneRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  flag: { backgroundColor: colors.background, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 15, borderWidth: 1, borderColor: colors.border, justifyContent: 'center' },
  input: { flex: 1, backgroundColor: colors.background, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 15, fontSize: 18, fontWeight: '700', color: colors.text, borderWidth: 1, borderColor: colors.border },

  btn: { backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center', marginTop: spacing.xs },
  btnDisabled: { opacity: 0.45 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  backArrow: { color: colors.primary, fontSize: 16 },
  backText:  { color: colors.primary, fontSize: 14, fontWeight: '600' },

  otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  otpBox: { width: 64, height: 64, borderRadius: radius.md, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.background, fontSize: 26, fontWeight: '800', color: colors.text },
  otpBoxFilled: { borderColor: colors.primary, backgroundColor: colors.primaryLight },

  resendRow: { alignItems: 'center', marginTop: spacing.md },
  resendText: { color: colors.primary, fontSize: 14, fontWeight: '600' },

  dealer: { textAlign: 'center', fontSize: 13, color: colors.textMuted },
});
