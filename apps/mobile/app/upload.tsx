import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { X, UploadCloud, Check } from 'lucide-react-native';

export default function MobileUploadScreen() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Insurance');
  const [expiry, setExpiry] = useState('');
  const [file, setFile] = useState<any>(null);

  const handlePickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets[0]) {
        const picked = res.assets[0];
        setFile(picked);
        if (!title) {
          setTitle(picked.name.replace(/\.[^/.]+$/, ''));
        }
      }
    } catch (e) {
      console.warn('Document picker error:', e);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter a document title.');
      return;
    }

    Alert.alert(
      'Document Saved',
      `"${title}" was encrypted and stored in your vault.`,
      [{ text: 'OK', onPress: () => router.back() }],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Upload Document</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X size={20} color="#14181F" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 60 }}>
        {/* File Picker Zone */}
        <TouchableOpacity style={styles.pickerBox} onPress={handlePickDocument} activeOpacity={0.85}>
          <View style={styles.uploadIcon}>
            <UploadCloud size={24} color="#0861E8" />
          </View>
          {file ? (
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.fileName}>{file.name}</Text>
              <Text style={styles.fileSize}>{(file.size / (1024 * 1024)).toFixed(2)} MB • Tap to replace</Text>
            </View>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.pickerTitle}>Tap to select document file</Text>
              <Text style={styles.pickerSub}>PDF, PNG, JPG up to 50 MB</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Form Inputs */}
        <View style={styles.formCard}>
          <Text style={styles.label}>Document Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Geico Auto Insurance"
            placeholderTextColor="#9AA4B2"
          />

          <Text style={[styles.label, { marginTop: 14 }]}>Category</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="Insurance, Identity, Vehicle..."
            placeholderTextColor="#9AA4B2"
          />

          <Text style={[styles.label, { marginTop: 14 }]}>Expiry Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={expiry}
            onChangeText={setExpiry}
            placeholder="2027-11-12"
            placeholderTextColor="#9AA4B2"
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
            <Check size={18} color="#FFFFFF" strokeWidth={2.6} />
            <Text style={styles.submitBtnText}>Save to Vault</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F7F7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: '#14181F' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  pickerBox: { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#CDD5DF', borderStyle: 'dashed', borderRadius: 24, padding: 24, alignItems: 'center', marginVertical: 14 },
  uploadIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EBF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  fileName: { fontSize: 13, fontWeight: '700', color: '#14181F' },
  fileSize: { fontSize: 11, color: '#10B981', fontWeight: '600', marginTop: 2 },
  pickerTitle: { fontSize: 14, fontWeight: '700', color: '#14181F' },
  pickerSub: { fontSize: 12, color: '#9AA4B2', marginTop: 2 },
  formCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#E3E8EF' },
  label: { fontSize: 11, fontWeight: '700', color: '#697586', textTransform: 'uppercase', marginBottom: 6 },
  input: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E3E8EF', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#14181F' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0861E8', paddingVertical: 14, borderRadius: 24, gap: 8, marginTop: 22 },
  submitBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
