import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { ShieldCheck, Lock, Fingerprint, HardDrive, Download, Trash2 } from 'lucide-react-native';

export default function MobileSettingsScreen() {
  const [biometrics, setBiometrics] = useState(true);
  const [encryption, setEncryption] = useState(true);

  const handleBiometricToggle = async (val: boolean) => {
    if (val) {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        Alert.alert('Biometrics Unavailable', 'Device does not support or have enrolled biometrics.');
        return;
      }

      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock PaperTrail Vault',
      });

      if (auth.success) {
        setBiometrics(true);
      }
    } else {
      setBiometrics(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 100 }}>
        <Text style={styles.title}>Vault Settings</Text>
        <Text style={styles.subTitle}>Privacy, biometric security & profile</Text>

        {/* Profile Card */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.avatar}>
              <Text style={{ fontSize: 24 }}>🧑‍🎨</Text>
            </View>
            <View style={{ marginLeft: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.name}>Lohith Kumar</Text>
                <ShieldCheck size={16} color="#0861E8" />
              </View>
              <Text style={styles.email}>lohith.k@vault.io</Text>
            </View>
          </View>
        </View>

        {/* Storage Card */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <HardDrive size={18} color="#0861E8" />
              <Text style={styles.cardSectionTitle}>Vault Storage</Text>
            </View>
            <Text style={styles.storageText}>14.8 MB / 500 MB</Text>
          </View>

          <View style={styles.storageTrack}>
            <View style={[styles.storageBar, { width: '4%' }]} />
          </View>
          <Text style={styles.storageSubText}>6 encrypted documents stored client-side.</Text>
        </View>

        {/* Security Controls */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Security & Access</Text>

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Face ID / Biometric Lock</Text>
              <Text style={styles.settingDesc}>Require fingerprint or face scan on launch</Text>
            </View>
            <Switch
              value={biometrics}
              onValueChange={handleBiometricToggle}
              trackColor={{ false: '#CDD5DF', true: '#0861E8' }}
            />
          </View>

          <View style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: '#F1F3F6', paddingTop: 14 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>AES-256 Vault Seal</Text>
              <Text style={styles.settingDesc}>Client-side zero-knowledge encryption</Text>
            </View>
            <Switch
              value={encryption}
              onValueChange={setEncryption}
              trackColor={{ false: '#CDD5DF', true: '#0861E8' }}
            />
          </View>
        </View>

        {/* Backup Actions */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Data & Export</Text>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => Alert.alert('Vault Exported', 'Full JSON backup encrypted and exported.')}
          >
            <Download size={18} color="#0861E8" />
            <Text style={styles.actionBtnText}>Export Encrypted Vault Backup (.json)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F7F7' },
  title: { fontSize: 24, fontWeight: '800', color: '#14181F' },
  subTitle: { fontSize: 12, fontWeight: '600', color: '#697586', marginTop: 2, marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 24, borderWidth: 1, borderColor: '#E3E8EF', marginBottom: 14 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FBCFE8', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '700', color: '#14181F' },
  email: { fontSize: 13, color: '#0861E8', fontWeight: '500', marginTop: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardSectionTitle: { fontSize: 13, fontWeight: '800', color: '#14181F', textTransform: 'uppercase', letterSpacing: 0.5 },
  storageText: { fontSize: 12, fontWeight: '700', color: '#697586' },
  storageTrack: { height: 8, backgroundColor: '#F1F3F6', borderRadius: 4, overflow: 'hidden' },
  storageBar: { height: '100%', backgroundColor: '#0861E8', borderRadius: 4 },
  storageSubText: { fontSize: 11, color: '#9AA4B2', marginTop: 8 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 },
  settingLabel: { fontSize: 14, fontWeight: '700', color: '#14181F' },
  settingDesc: { fontSize: 12, color: '#697586', marginTop: 2 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, marginTop: 4 },
  actionBtnText: { fontSize: 13, fontWeight: '700', color: '#0861E8' },
});
