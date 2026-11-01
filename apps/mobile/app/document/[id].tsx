import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { X, Share2, Download, ShieldCheck, Clock, FileText } from 'lucide-react-native';

export default function MobileDocumentDetailScreen() {
  const { id } = useLocalSearchParams();
  const [verified, setVerified] = useState(true);

  const handleShare = async () => {
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      // In production, shares the local cached document file path
      Alert.alert('Native Share Sheet', 'Ready to share via AirDrop, Nearby Share, Messages, or Email.');
    } else {
      Alert.alert('Sharing Unavailable', 'Native sharing is not supported on this device.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.catPill}>
          <Text style={styles.catText}>Insurance</Text>
        </View>

        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X size={20} color="#14181F" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 60 }}>
        {/* Document Preview Canvas */}
        <View style={styles.previewBox}>
          <View style={styles.sealRow}>
            <Text style={styles.sealBadge}>PT</Text>
            <View>
              <Text style={styles.sealText}>Official Vault Seal</Text>
              <Text style={styles.issuerText}>GEICO Auto Insurance</Text>
            </View>
          </View>

          <View style={{ marginVertical: 24 }}>
            <Text style={styles.docTitle}>Vehicle Insurance Policy</Text>
            <Text style={styles.docId}>ID: POL-88392-GEICO</Text>
          </View>

          <View style={styles.previewFooter}>
            <Text style={styles.footerTag}>AES-256 ENCRYPTED</Text>
            <Text style={styles.footerTag}>2.4 MB • PDF</Text>
          </View>
        </View>

        {/* Metadata Grid */}
        <View style={styles.metaCard}>
          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Authority</Text>
              <Text style={styles.metaVal}>GEICO Auto</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Status</Text>
              <Text style={[styles.metaVal, { color: '#EF4444' }]}>12 days left</Text>
            </View>
          </View>

          <View style={[styles.metaGrid, { marginTop: 14 }]}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Issued Date</Text>
              <Text style={styles.metaVal}>2025-11-12</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Expiry Date</Text>
              <Text style={styles.metaVal}>2026-11-12</Text>
            </View>
          </View>

          <View style={styles.notesBox}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesVal}>
              Comprehensive collision & third-party liability coverage. Deductible $500.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Share2 size={18} color="#0861E8" />
            <Text style={styles.actionBtnText}>Share File</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => Alert.alert('Downloaded', 'Document saved to local device downloads.')}
          >
            <Download size={18} color="#0861E8" />
            <Text style={styles.actionBtnText}>Download</Text>
          </TouchableOpacity>
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={styles.verifyBtn}
          onPress={() => Alert.alert('Verified', 'Document authenticity confirmed.')}
        >
          <ShieldCheck size={20} color="#FFFFFF" />
          <Text style={styles.verifyBtnText}>Mark Authenticated & Verified</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F7F7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  catPill: { backgroundColor: '#EBF2FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  catText: { color: '#0861E8', fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  previewBox: { backgroundColor: '#14181F', borderRadius: 28, padding: 22, marginVertical: 14 },
  sealRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sealBadge: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#0861E8', color: '#FFF', fontWeight: '800', textAlign: 'center', lineHeight: 32 },
  sealText: { fontSize: 10, color: '#9AA4B2', textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700' },
  issuerText: { fontSize: 13, color: '#FFFFFF', fontWeight: '700' },
  docTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', lineHeight: 28 },
  docId: { fontSize: 13, color: '#38BDF8', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginTop: 4 },
  previewFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', paddingTop: 14 },
  footerTag: { fontSize: 11, color: '#9AA4B2', fontWeight: '600' },
  metaCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#E3E8EF', marginBottom: 14 },
  metaGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  metaItem: { flex: 1 },
  metaLabel: { fontSize: 11, color: '#9AA4B2', textTransform: 'uppercase', fontWeight: '700' },
  metaVal: { fontSize: 14, fontWeight: '700', color: '#14181F', marginTop: 2 },
  notesBox: { marginTop: 16, borderTopWidth: 1, borderTopColor: '#F1F3F6', paddingTop: 12 },
  notesLabel: { fontSize: 11, color: '#9AA4B2', textTransform: 'uppercase', fontWeight: '700', marginBottom: 4 },
  notesVal: { fontSize: 13, color: '#4B5565', lineHeight: 18 },
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', paddingVertical: 14, borderRadius: 20, borderWidth: 1, borderColor: '#E3E8EF', gap: 8 },
  actionBtnText: { fontSize: 13, fontWeight: '700', color: '#0861E8' },
  verifyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#10B981', paddingVertical: 14, borderRadius: 24, gap: 8 },
  verifyBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
