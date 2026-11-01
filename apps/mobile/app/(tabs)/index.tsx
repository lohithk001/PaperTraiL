import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  CheckCircle,
  MessageSquare,
  Bell,
  Clock,
  Flag,
  Check,
  ChevronRight,
  PenTool,
  ShieldCheck,
  FileText,
  Plus,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function MobileHomeScreen() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'recent' | 'expiring'>('all');
  const [sliderDone, setSliderDone] = useState(false);

  const filters = [
    { id: 'all', label: 'All', count: 6 },
    { id: 'recent', label: 'Recent', count: 3 },
    { id: 'expiring', label: 'Expiring soon', count: 2 },
  ];

  const handleSliderComplete = () => {
    setSliderDone(true);
    setTimeout(() => setSliderDone(false), 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Top Status & Profile Row */}
        <View style={styles.headerRow}>
          <View style={styles.profileInfo}>
            {/* Illustrated Avatar */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatarInner}>
                <Text style={{ fontSize: 20 }}>🧑‍🎨</Text>
              </View>
              <View style={styles.onlineDot} />
            </View>

            <View style={{ marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.userName}>Lohith Kumar</Text>
                <CheckCircle size={15} color="#0861E8" style={{ marginLeft: 4 }} />
              </View>
              <Text style={styles.userRole}>Personal Document Vault</Text>
            </View>
          </View>

          {/* Quick Action Icons */}
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.circleBtn} activeOpacity={0.8}>
              <MessageSquare size={18} color="#1F242D" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.circleBtn}
              activeOpacity={0.8}
              onPress={() => router.push('/upload')}
            >
              <Bell size={18} color="#1F242D" />
              <View style={styles.notifBadge} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Bold Greeting Typography */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>
            HI LOHITH, nice to{'\n'}see you!
          </Text>
          <Text style={styles.greetingSubtitle}>Your documents are safe with us!</Text>
        </View>

        {/* 3. Horizontal Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filters.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => setActiveFilter(f.id as any)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                activeOpacity={0.85}
              >
                <Text style={[styles.filterLabel, isActive && styles.filterLabelActive]}>
                  {f.label}
                </Text>
                <Text style={[styles.filterCount, isActive && styles.filterCountActive]}>
                  {f.count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 4. Signature 3D Layered Cobalt Hero Card */}
        <View style={styles.cardStackWrapper}>
          {/* Layer 2: Offset stacked card behind */}
          <View style={styles.stackedCardBack}>
            <Text style={styles.stackedCardText}>International Passport</Text>
            <View style={styles.tagPill}>
              <Text style={styles.tagPillText}>Identity</Text>
            </View>
          </View>

          {/* Layer 1: Foreground Cobalt Blue Card */}
          <View style={styles.heroCard}>
            {/* Top row inside hero card */}
            <View style={styles.heroTopRow}>
              {/* Overlapping badge circles */}
              <View style={styles.overlappingBadges}>
                <View style={[styles.miniBadge, { backgroundColor: '#FFE4E6' }]}>
                  <Text style={{ fontSize: 13 }}>🛡️</Text>
                </View>
                <View style={[styles.miniBadge, { backgroundColor: '#FEF3C7', marginLeft: -8 }]}>
                  <Text style={{ fontSize: 13 }}>🚗</Text>
                </View>
                <View style={[styles.miniBadge, { backgroundColor: '#E0E7FF', marginLeft: -8 }]}>
                  <Text style={{ fontSize: 13 }}>📑</Text>
                </View>
              </View>

              {/* Expiration pill */}
              <View style={styles.expiryPill}>
                <Clock size={12} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.expiryText}>12 Days Left</Text>
              </View>
            </View>

            {/* Status Flag */}
            <View style={styles.statusBadge}>
              <Flag size={11} color="#EF4444" fill="#EF4444" />
              <Text style={styles.statusText}>EXPIRING SOON</Text>
            </View>

            {/* Title */}
            <Text style={styles.heroTitle}>Vehicle{'\n'}Insurance{'\n'}Policy</Text>

            <Text style={styles.heroSubtitle}>
              GEICO Auto • POL-88392-GEICO
            </Text>

            {/* Bottom Slider & Circular Edit Button */}
            <View style={styles.heroBottomRow}>
              <TouchableOpacity
                style={styles.sliderPill}
                activeOpacity={0.85}
                onPress={handleSliderComplete}
              >
                <View style={styles.checkCircle}>
                  <Check size={18} color="#0861E8" strokeWidth={3} />
                </View>
                <Text style={styles.sliderText}>
                  {sliderDone ? 'Verified & Safe!' : 'Drag to mark done  >>>'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editBtn}
                activeOpacity={0.85}
                onPress={() => router.push('/document/doc-1')}
              >
                <PenTool size={18} color="#1F242D" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 5. Vault Documents Quick Access List */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Vault Documents (6)</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/documents')}>
              <Text style={styles.seeAllText}>See all &gt;</Text>
            </TouchableOpacity>
          </View>

          {/* Sample items */}
          <TouchableOpacity
            style={styles.docItem}
            activeOpacity={0.8}
            onPress={() => router.push('/document/doc-2')}
          >
            <View style={[styles.docIconBox, { backgroundColor: '#10B981' }]}>
              <FileText size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.docItemTitle}>International Passport</Text>
              <Text style={styles.docItemSub}>Identity • 1.8 MB • Valid till 2034</Text>
            </View>
            <ShieldCheck size={20} color="#10B981" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.docItem}
            activeOpacity={0.8}
            onPress={() => router.push('/document/doc-3')}
          >
            <View style={[styles.docIconBox, { backgroundColor: '#8B5CF6' }]}>
              <FileText size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.docItemTitle}>College Marks Card & Degree</Text>
              <Text style={styles.docItemSub}>Education • 4.2 MB • Permanent</Text>
            </View>
            <ChevronRight size={18} color="#9AA4B2" />
          </TouchableOpacity>
        </View>

        {/* Bottom padding for floating navigation */}
        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FBCFE8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#14181F',
  },
  userRole: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0861E8',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E3E8EF',
  },
  notifBadge: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  greetingSection: {
    marginVertical: 14,
  },
  greetingTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#14181F',
    lineHeight: 36,
  },
  greetingSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#697586',
    marginTop: 6,
  },
  filterScroll: {
    gap: 8,
    paddingVertical: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E3E8EF',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#0861E8',
    borderColor: '#0861E8',
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#323945',
  },
  filterLabelActive: {
    color: '#FFFFFF',
  },
  filterCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9AA4B2',
    marginLeft: 6,
  },
  filterCountActive: {
    color: 'rgba(255,255,255,0.85)',
  },
  cardStackWrapper: {
    position: 'relative',
    marginTop: 22,
    marginBottom: 20,
  },
  stackedCardBack: {
    position: 'absolute',
    top: -14,
    left: 12,
    right: 12,
    height: 120,
    borderRadius: 28,
    backgroundColor: '#0546aa',
    paddingHorizontal: 18,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stackedCardText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  tagPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tagPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  heroCard: {
    backgroundColor: '#0861E8',
    borderRadius: 32,
    padding: 24,
    shadowColor: '#0861E8',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 10,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  overlappingBadges: {
    flexDirection: 'row',
  },
  miniBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#0861E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expiryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  expiryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginBottom: 14,
  },
  statusText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '800',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 32,
  },
  heroSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 8,
    marginBottom: 20,
  },
  heroBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderPill: {
    flex: 1,
    height: 52,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  checkCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 12,
  },
  editBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  listSection: {
    marginTop: 10,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#14181F',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0861E8',
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E3E8EF',
    marginBottom: 10,
  },
  docIconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#14181F',
  },
  docItemSub: {
    fontSize: 12,
    color: '#697586',
    marginTop: 2,
  },
});
