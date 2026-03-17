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
import { User, Mail, Lock, Eye, EyeOff, MapPin } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

type Errors = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

function passwordStrength(pw: string): { level: number; label: string; color: string } {
  if (!pw) return { level: 0, label: '', color: '#E8E8E8' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: 'Weak', color: '#FF6B6B' };
  if (score === 2) return { level: 2, label: 'Fair', color: '#FFA726' };
  if (score === 3) return { level: 3, label: 'Good', color: '#66BB6A' };
  return { level: 4, label: 'Strong', color: '#2C5364' };
}

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const strength = passwordStrength(password);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const clearError = (key: keyof Errors) =>
    setErrors((e) => ({ ...e, [key]: undefined, general: undefined }));

  const validate = () => {
    const newErrors: Errors = {};
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) shake();
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await signup(username.trim(), email.trim(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'Sign up failed. Please try again.';
      setErrors({ general: msg });
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
          {/* ── Hero ── */}
          <View style={styles.hero}>
            <View style={styles.iconCircle}>
              <MapPin size={36} color="#fff" strokeWidth={2} />
            </View>
            <Text style={styles.appName}>TGuide</Text>
            <Text style={styles.tagline}>Join the India travel community</Text>
          </View>

          {/* ── Card ── */}
          <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}>
            <Text style={styles.cardTitle}>Create account</Text>
            <Text style={styles.cardSubtitle}>It's free and takes under a minute</Text>

            {/* General error */}
            {errors.general ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{errors.general}</Text>
              </View>
            ) : null}

            {/* Username */}
            <View style={styles.fieldWrapper}>
              <View style={[styles.inputRow, errors.username ? styles.inputError : null]}>
                <User size={18} color={errors.username ? '#FF6B6B' : '#8E8E8E'} strokeWidth={1.8} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#8E8E8E"
                  value={username}
                  onChangeText={(t) => { setUsername(t); clearError('username'); }}
                  autoCapitalize="none"
                  autoComplete="username"
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              </View>
              {errors.username ? <Text style={styles.fieldError}>{errors.username}</Text> : null}
            </View>

            {/* Email */}
            <View style={styles.fieldWrapper}>
              <View style={[styles.inputRow, errors.email ? styles.inputError : null]}>
                <Mail size={18} color={errors.email ? '#FF6B6B' : '#8E8E8E'} strokeWidth={1.8} />
                <TextInput
                  ref={emailRef}
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="#8E8E8E"
                  value={email}
                  onChangeText={(t) => { setEmail(t); clearError('email'); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>
              {errors.email ? <Text style={styles.fieldError}>{errors.email}</Text> : null}
            </View>

            {/* Password */}
            <View style={styles.fieldWrapper}>
              <View style={[styles.inputRow, errors.password ? styles.inputError : null]}>
                <Lock size={18} color={errors.password ? '#FF6B6B' : '#8E8E8E'} strokeWidth={1.8} />
                <TextInput
                  ref={passwordRef}
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#8E8E8E"
                  value={password}
                  onChangeText={(t) => { setPassword(t); clearError('password'); }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => confirmRef.current?.focus()}
                />
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
                  {showPassword
                    ? <EyeOff size={18} color="#8E8E8E" strokeWidth={1.8} />
                    : <Eye size={18} color="#8E8E8E" strokeWidth={1.8} />}
                </TouchableOpacity>
              </View>
              {password.length > 0 && (
                <View style={styles.strengthRow}>
                  {[1, 2, 3, 4].map((i) => (
                    <View
                      key={i}
                      style={[
                        styles.strengthBar,
                        { backgroundColor: i <= strength.level ? strength.color : '#E8E8E8' },
                      ]}
                    />
                  ))}
                  <Text style={[styles.strengthLabel, { color: strength.color }]}>
                    {strength.label}
                  </Text>
                </View>
              )}
              {errors.password ? <Text style={styles.fieldError}>{errors.password}</Text> : null}
            </View>

            {/* Confirm Password */}
            <View style={styles.fieldWrapper}>
              <View style={[styles.inputRow, errors.confirmPassword ? styles.inputError : null]}>
                <Lock size={18} color={errors.confirmPassword ? '#FF6B6B' : '#8E8E8E'} strokeWidth={1.8} />
                <TextInput
                  ref={confirmRef}
                  style={styles.input}
                  placeholder="Confirm password"
                  placeholderTextColor="#8E8E8E"
                  value={confirmPassword}
                  onChangeText={(t) => { setConfirmPassword(t); clearError('confirmPassword'); }}
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleSignup}
                />
                <TouchableOpacity onPress={() => setShowConfirm((v) => !v)} style={styles.eyeBtn}>
                  {showConfirm
                    ? <EyeOff size={18} color="#8E8E8E" strokeWidth={1.8} />
                    : <Eye size={18} color="#8E8E8E" strokeWidth={1.8} />}
                </TouchableOpacity>
              </View>
              {errors.confirmPassword ? (
                <Text style={styles.fieldError}>{errors.confirmPassword}</Text>
              ) : null}
            </View>

            {/* Sign Up button */}
            <TouchableOpacity
              style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryBtnText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Terms note */}
            <Text style={styles.terms}>
              By signing up you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> &{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>

            {/* Switch to login */}
            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.switchLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },

  /* Hero */
  hero: { alignItems: 'center', marginBottom: 28 },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  appName: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 6,
  },
  tagline: { fontSize: 15, color: 'rgba(255,255,255,0.65)', letterSpacing: 0.3 },

  /* Card */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  cardTitle: { fontSize: 24, fontWeight: '700', color: '#111', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#8E8E8E', marginBottom: 24 },

  /* Error banner */
  errorBanner: {
    backgroundColor: '#FFF0F0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B6B',
  },
  errorBannerText: { color: '#D32F2F', fontSize: 13, fontWeight: '500' },

  /* Input */
  fieldWrapper: { marginBottom: 16 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
  },
  inputError: { borderColor: '#FF6B6B', backgroundColor: '#FFF5F5' },
  input: { flex: 1, fontSize: 15, color: '#111', height: '100%' },
  eyeBtn: { padding: 4 },
  fieldError: { color: '#FF6B6B', fontSize: 12, marginTop: 5, marginLeft: 4 },

  /* Password strength */
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: { fontSize: 11, fontWeight: '700', marginLeft: 4, width: 44 },

  /* Primary button */
  primaryBtn: {
    backgroundColor: '#2C5364',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  primaryBtnDisabled: { opacity: 0.65 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },

  /* Terms */
  terms: { fontSize: 12, color: '#BDBDBD', textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  termsLink: { color: '#2C5364', fontWeight: '600' },

  /* Switch */
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  switchText: { fontSize: 14, color: '#8E8E8E' },
  switchLink: { fontSize: 14, color: '#2C5364', fontWeight: '700' },
});
