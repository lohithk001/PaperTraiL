import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, Plus, FileText, ShieldCheck, Tag } from 'lucide-react-native';

export default function MobileDocumentsScreen() {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = ['All', 'Insurance', 'Identity', 'Vehicle', 'Education', 'Warranty', 'Finance'];

  const sampleDocs = [
    { id: 'doc-1', title: 'Vehicle Insurance Policy', category: 'Insurance', size: '2.4 MB', days: 12, color: '#0861E8' },
    { id: 'doc-2', title: 'International Passport', category: 'Identity', size: '1.8 MB', days: null, verified: true, color: '#10B981' },
    { id: 'doc-3', title: 'College Marks Card & Degree', category: 'Education', size: '4.2 MB', days: null, verified: true, color: '#8B5CF6' },
    { id: 'doc-4', title: 'MacBook Pro AppleCare Warranty', category: 'Warranty', size: '890 KB', days: 45, color: '#F59E0B' },
  ];

  const filtered = sampleDocs.filter((d) => {
    if (selectedCat !== 'All' && d.category !== selectedCat) return false;
    if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Documents Vault</Text>
          <Text style={styles.subTitle}>{filtered.length} documents stored securely</Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/upload')}
          activeOpacity={0.8}
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.6} />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Search size={18} color="#9AA4B2" />
        <TextInput
          placeholder="Search by title, policy #..."
          placeholderTextColor="#9AA4B2"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Category Pills */}
      <View style={{ height: 44, marginVertical: 8 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setSelectedCat(c)}
              style={[styles.catPill, selectedCat === c && styles.catPillActive]}
            >
              <Text style={[styles.catPillText, selectedCat === c && styles.catPillTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/document/${item.id}`)}
            activeOpacity={0.85}
          >
            <View style={[styles.iconBox, { backgroundColor: item.color }]}>
              <FileText size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.tag}>{item.category}</Text>
                {item.days && (
                  <Text style={styles.daysBadge}>{item.days}d left</Text>
                )}
              </View>
              <Text style={styles.docTitle}>{item.title}</Text>
              <Text style={styles.docMeta}>{item.size}</Text>
            </View>
            {item.verified && <ShieldCheck size={20} color="#10B981" />}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F7F7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: '#14181F' },
  subTitle: { fontSize: 12, fontWeight: '600', color: '#697586', marginTop: 2 },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0861E8', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, gap: 4 },
  addBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', marginHorizontal: 20, paddingHorizontal: 14, height: 46, borderRadius: 20, borderWidth: 1, borderColor: '#E3E8EF', gap: 10, marginTop: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#14181F' },
  catPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E3E8EF', marginRight: 8, height: 36, justifyContent: 'center' },
  catPillActive: { backgroundColor: '#0861E8', borderColor: '#0861E8' },
  catPillText: { fontSize: 12, fontWeight: '700', color: '#4B5565' },
  catPillTextActive: { color: '#FFFFFF' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 24, borderWidth: 1, borderColor: '#E3E8EF', marginBottom: 10 },
  iconBox: { width: 46, height: 46, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  tag: { fontSize: 11, fontWeight: '700', color: '#4B5565', backgroundColor: '#F1F3F6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  daysBadge: { fontSize: 11, fontWeight: '800', color: '#EF4444', backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  docTitle: { fontSize: 15, fontWeight: '700', color: '#14181F', marginTop: 4 },
  docMeta: { fontSize: 12, color: '#9AA4B2', marginTop: 2 },
});
