import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Mail, ArrowLeft, MapPin, CheckCircle } from 'lucide-react-native';
import { authAPI } from '@/services/api';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const validate = () => {
    if (!email.trim()) { setEmailError('Email is required'); shake(); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Enter a valid email address'); shake(); return false;
    }
    return true;
  };

  const handleReset = async () => {
    setEmailError(''); setGeneralError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await authAPI.forgotPassword(email.trim());
      setSent(true);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Something went wrong. Try again.';
      setGeneralError(msg);
      shake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient colors={['#0F2027', '#203A43', '#2C5364']} style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.iconCircle}>
              <MapPin size={36} color="#fff" strokeWidth={2} />
            </View>
            <Text style={styles.appName}>TGuide</Text>
          </View>

          <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}>

            {/* Back button */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ArrowLeft size={20} color="#2C5364" strokeWidth={2} />
              <Text style={styles.backText}>Back to login</Text>
            </TouchableOpacity>

            {sent ? (
              /* ── Success state ── */
              <View style={styles.successContainer}>
                <CheckCircle size={56} color="#4CAF50" strokeWidth={1.5} />
                <Text style={styles.successTitle}>Check your inbox</Text>
                <Text style={styles.successBody}>
                  We've sent password reset instructions to{'\n'}
                  <Text style={{ fontWeight: '700', color: '#2C5364' }}>{email}</Text>
                </Text>
                <TouchableOpacity style={styles.primaryBtn} onPress={() => router.back()}>
                  <Text style={styles.primaryBtnText}>Back to Log In</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* ── Form state ── */
              <>
                <Text style={styles.cardTitle}>Reset password</Text>
                <Text style={styles.cardSubtitle}>
                  Enter your account email and we'll send you a reset link.
                </Text>

                {generalError ? (
                  <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>{generalError}</Text>
                  </View>
                ) : null}

                <View style={styles.fieldWrapper}>
                  <View style={[styles.inputRow, emailError ? styles.inputError : null]}>
                    <Mail size={18} color={emailError ? '#FF6B6B' : '#8E8E8E'} strokeWidth={1.8} />
                    <TextInput
                      style={styles.input}
                      placeholder="Email address"
                      placeholderTextColor="#8E8E8E"
                      value={email}
                      onChangeText={(t) => { setEmail(t); setEmailError(''); setGeneralError(''); }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      returnKeyType="done"
                      onSubmitEditing={handleReset}
                    />
                  </View>
                  {emailError ? <Text style={styles.fieldError}>{emailError}</Text> : null}
                </View>

                <TouchableOpacity
                  style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                  onPress={handleReset}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.primaryBtnText}>Send Reset Link</Text>}
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 },

  hero: { alignItems: 'center', marginBottom: 28 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)',
  },
  appName: { fontSize: 38, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1 },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25, shadowRadius: 24, elevation: 12,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 24 },
  backText: { fontSize: 14, color: '#2C5364', fontWeight: '600' },

  cardTitle: { fontSize: 24, fontWeight: '700', color: '#111', marginBottom: 8 },
  cardSubtitle: { fontSize: 14, color: '#8E8E8E', lineHeight: 21, marginBottom: 24 },

  errorBanner: {
    backgroundColor: '#FFF0F0', borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 14, marginBottom: 16,
    borderLeftWidth: 3, borderLeftColor: '#FF6B6B',
  },
  errorBannerText: { color: '#D32F2F', fontSize: 13, fontWeight: '500' },

  fieldWrapper: { marginBottom: 20 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F7F7F7', borderRadius: 12,
    borderWidth: 1.5, borderColor: '#E8E8E8',
    paddingHorizontal: 14, height: 52, gap: 10,
  },
  inputError: { borderColor: '#FF6B6B', backgroundColor: '#FFF5F5' },
  input: { flex: 1, fontSize: 15, color: '#111', height: '100%' },
  fieldError: { color: '#FF6B6B', fontSize: 12, marginTop: 5, marginLeft: 4 },

  primaryBtn: {
    backgroundColor: '#2C5364', borderRadius: 12,
    height: 52, alignItems: 'center', justifyContent: 'center',
  },
  primaryBtnDisabled: { opacity: 0.65 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },

  // Success state
  successContainer: { alignItems: 'center', paddingVertical: 16, gap: 16 },
  successTitle: { fontSize: 22, fontWeight: '700', color: '#111' },
  successBody: { fontSize: 14, color: '#8E8E8E', textAlign: 'center', lineHeight: 22 },
});
