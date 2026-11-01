import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Lock, Mail, ArrowRight } from 'lucide-react-native';

export default function MobileLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // In production, uses Clerk useSignIn()
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.topLogo}>
          <View style={styles.logoBadge}>
            <Text style={{ fontSize: 28 }}>📑</Text>
          </View>
          <Text style={styles.title}>PaperTrail</Text>
          <Text style={styles.subTitle}>Never lose an important document again.</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Sign in to your vault</Text>

          <View style={styles.inputWrap}>
            <Mail size={18} color="#9AA4B2" />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#9AA4B2"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={[styles.inputWrap, { marginTop: 12 }]}>
            <Lock size={18} color="#9AA4B2" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9AA4B2"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginBtnText}>Unlock Vault</Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F7F7' },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  topLogo: { alignItems: 'center', marginBottom: 28 },
  logoBadge: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#EBF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#14181F' },
  subTitle: { fontSize: 13, color: '#697586', marginTop: 4 },
  formCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 28, borderWidth: 1, borderColor: '#E3E8EF', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 18, elevation: 2 },
  formTitle: { fontSize: 16, fontWeight: '700', color: '#14181F', marginBottom: 18 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E3E8EF', borderRadius: 16, paddingHorizontal: 14, height: 48, gap: 10 },
  input: { flex: 1, fontSize: 14, color: '#14181F' },
  loginBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0861E8', height: 50, borderRadius: 25, gap: 8, marginTop: 20 },
  loginBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
