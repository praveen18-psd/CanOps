import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, StatusBar,
} from 'react-native';
import { colors, spacing, radius, typography, shadow } from '../theme';
import Button from '../components/Button';

const LANGUAGES = [
  { key: 'en', label: 'English' },
  { key: 'ta', label: 'தமிழ்' },
  { key: 'te', label: 'తెలుగు' },
  { key: 'kn', label: 'ಕನ್ನಡ' },
  { key: 'ml', label: 'മലയാളം' },
];

export default function LoginScreen({ navigation }) {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
  const otpRefs = useRef([]);

  const handleSendOtp = () => {
    if (phone.length < 10) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('otp'); }, 1500);
  };

  const handleOtpChange = (val, idx) => {
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 3) otpRefs.current[idx + 1]?.focus();
    if (!val && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleVerify = () => {
    if (otp.join('').length < 4) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Main');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Language selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.langRow}>
            {LANGUAGES.map(l => (
              <TouchableOpacity
                key={l.key}
                onPress={() => setSelectedLang(l.key)}
                style={[styles.langBtn, selectedLang === l.key && styles.langBtnActive]}
              >
                <Text style={[styles.langText, selectedLang === l.key && styles.langTextActive]}>
                  {l.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Logo & hero */}
          <View style={styles.hero}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>💧</Text>
            </View>
            <Text style={styles.appName}>CanOps</Text>
            <Text style={styles.tagline}>Water, On Your Way</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            {step === 'phone' ? (
              <>
                <Text style={styles.cardTitle}>Enter your mobile number</Text>
                <Text style={styles.cardSubtitle}>We'll send a 4-digit OTP to verify your number</Text>

                <View style={styles.phoneRow}>
                  <View style={styles.countryCode}>
                    <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="98400 XXXXX"
                    placeholderTextColor={colors.textLight}
                    keyboardType="number-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={setPhone}
                    autoFocus
                  />
                </View>

                <Button
                  title="Send OTP"
                  onPress={handleSendOtp}
                  loading={loading}
                  disabled={phone.length < 10}
                  style={styles.btn}
                />

                <Text style={styles.terms}>
                  By continuing, you agree to our{' '}
                  <Text style={{ color: colors.primary }}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={{ color: colors.primary }}>Privacy Policy</Text>
                </Text>
              </>
            ) : (
              <>
                <TouchableOpacity onPress={() => setStep('phone')} style={styles.backRow}>
                  <Text style={styles.backArrow}>←</Text>
                  <Text style={styles.backText}>Change number</Text>
                </TouchableOpacity>

                <Text style={styles.cardTitle}>Enter OTP</Text>
                <Text style={styles.cardSubtitle}>
                  Sent to <Text style={{ fontWeight: '600', color: colors.text }}>+91 {phone}</Text>
                </Text>

                <View style={styles.otpRow}>
                  {otp.map((digit, idx) => (
                    <TextInput
                      key={idx}
                      ref={ref => { otpRefs.current[idx] = ref; }}
                      style={[styles.otpBox, digit && styles.otpBoxFilled]}
                      value={digit}
                      onChangeText={val => handleOtpChange(val.slice(-1), idx)}
                      keyboardType="number-pad"
                      maxLength={1}
                      textAlign="center"
                    />
                  ))}
                </View>

                <Button
                  title="Verify & Continue"
                  onPress={handleVerify}
                  loading={loading}
                  disabled={otp.join('').length < 4}
                  style={styles.btn}
                />

                <TouchableOpacity style={styles.resendRow}>
                  <Text style={styles.resendText}>
                    Didn't receive? <Text style={{ color: colors.primary, fontWeight: '600' }}>Resend OTP</Text>
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.md, paddingBottom: spacing.xl },

  langRow: { marginTop: spacing.md, marginBottom: spacing.sm },
  langBtn: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    marginRight: spacing.xs,
    backgroundColor: colors.border,
  },
  langBtnActive: { backgroundColor: colors.primary },
  langText: { fontSize: 13, fontWeight: '500', color: colors.textMuted },
  langTextActive: { color: colors.white },

  hero: { alignItems: 'center', paddingVertical: spacing.xl },
  logoCircle: {
    width: 80, height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadow.md,
  },
  logoEmoji: { fontSize: 38 },
  appName: { fontSize: 32, fontWeight: '800', color: colors.primary, letterSpacing: -0.5 },
  tagline: { fontSize: 15, color: colors.textMuted, marginTop: 4 },

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadow.md,
  },
  cardTitle: { fontSize: 20, fontWeight: '700', color: colors.black, marginBottom: 6 },
  cardSubtitle: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.lg, lineHeight: 20 },

  phoneRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  countryCode: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 14,
    marginRight: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  countryCodeText: { fontSize: 15, fontWeight: '600', color: colors.text },
  phoneInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    borderWidth: 1, borderColor: colors.border,
  },

  btn: { marginTop: spacing.sm },

  terms: { fontSize: 12, color: colors.textLight, textAlign: 'center', marginTop: spacing.md, lineHeight: 18 },

  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  backArrow: { fontSize: 20, color: colors.primary, marginRight: 6 },
  backText: { fontSize: 14, color: colors.primary, fontWeight: '500' },

  otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg },
  otpBox: {
    width: 62, height: 62,
    borderRadius: radius.md,
    borderWidth: 2, borderColor: colors.border,
    fontSize: 24, fontWeight: '700', color: colors.text,
    backgroundColor: colors.background,
  },
  otpBoxFilled: { borderColor: colors.primary, backgroundColor: colors.primaryLight },

  resendRow: { alignItems: 'center', marginTop: spacing.md },
  resendText: { fontSize: 14, color: colors.textMuted },
});
