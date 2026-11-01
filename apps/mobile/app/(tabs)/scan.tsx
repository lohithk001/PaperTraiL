import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Camera, Zap, RotateCw, Check, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function MobileScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState(false);
  const [scanning, setScanning] = useState(false);
  const cameraRef = useRef<any>(null);

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0861E8" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.center, { padding: 24 }]}>
        <Camera size={48} color="#0861E8" style={{ marginBottom: 16 }} />
        <Text style={styles.permTitle}>Camera Access Required</Text>
        <Text style={styles.permDesc}>
          PaperTrail uses your camera to scan physical insurance cards, receipts, and government IDs.
        </Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Grant Camera Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleCapture = async () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      Alert.alert(
        'Document Captured & Processed',
        'Gemini AI auto-detected: "Property Tax Receipt 2026" (Category: Finance). Saved to vault.',
        [{ text: 'View in Vault', onPress: () => router.push('/(tabs)/documents') }],
      );
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        enableTorch={flash}
      >
        <SafeAreaView style={styles.overlay}>
          {/* Top Controls */}
          <View style={styles.topBar}>
            <Text style={styles.scanHeader}>Document Scanner</Text>
            <TouchableOpacity
              style={[styles.flashBtn, flash && styles.flashBtnActive]}
              onPress={() => setFlash(!flash)}
            >
              <Zap size={18} color={flash ? '#14181F' : '#FFFFFF'} />
            </TouchableOpacity>
          </View>

          {/* Document Framing Bounds */}
          <View style={styles.frameContainer}>
            <View style={styles.frame}>
              <View style={styles.frameHeader}>
                <Text style={styles.framePrompt}>Align edges within frame</Text>
              </View>
              {/* Animated laser line */}
              <View style={styles.laserLine} />
              <View style={styles.frameFooter}>
                <Text style={styles.autoCropBadge}>Auto-Crop Active</Text>
              </View>
            </View>
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.secondaryBtn}>
              <RotateCw size={22} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Shutter Button */}
            <TouchableOpacity
              style={styles.shutterOuter}
              activeOpacity={0.8}
              onPress={handleCapture}
              disabled={scanning}
            >
              <View style={styles.shutterInner}>
                {scanning ? (
                  <ActivityIndicator color="#0861E8" />
                ) : (
                  <Camera size={26} color="#0861E8" />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn}>
              <Sparkles size={22} color="#FBBF24" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F7F7' },
  overlay: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 20 },
  permTitle: { fontSize: 20, fontWeight: '800', color: '#14181F', marginBottom: 8 },
  permDesc: { fontSize: 14, color: '#697586', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  permBtn: { backgroundColor: '#0861E8', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 24 },
  permBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  scanHeader: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  flashBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  flashBtnActive: { backgroundColor: '#FBBF24' },
  frameContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  frame: { width: width * 0.86, height: height * 0.52, borderWidth: 2, borderColor: 'rgba(255,255,255,0.7)', borderRadius: 24, borderStyle: 'dashed', justifyContent: 'space-between', padding: 14 },
  frameHeader: { alignSelf: 'flex-start', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  framePrompt: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  laserLine: { height: 2, backgroundColor: '#38BDF8', width: '100%', shadowColor: '#38BDF8', shadowRadius: 10, shadowOpacity: 1 },
  frameFooter: { alignSelf: 'flex-end', backgroundColor: '#0861E8', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  autoCropBadge: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 40 },
  shutterOuter: { width: 78, height: 78, borderRadius: 39, borderWidth: 4, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  secondaryBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
});
