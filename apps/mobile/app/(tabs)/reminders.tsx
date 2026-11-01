import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, Circle, Plus, Trash2, Calendar } from 'lucide-react-native';

export default function MobileRemindersScreen() {
  const [reminders, setReminders] = useState([
    {
      id: 'rem-1',
      title: 'Renew Geico Car Insurance before lapse',
      docTitle: 'Vehicle Insurance Policy',
      daysLeft: 12,
      urgency: 'critical',
      completed: false,
    },
    {
      id: 'rem-2',
      title: 'AppleCare+ 3-year extension eligibility deadline',
      docTitle: 'MacBook Pro AppleCare Warranty',
      daysLeft: 45,
      urgency: 'warning',
      completed: false,
    },
  ]);

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Expiration Alerts</Text>
          <Text style={styles.subTitle}>Never miss a renewal deadline or warranty</Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => Alert.alert('Add Reminder', 'Select a document to attach an alert.')}
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.6} />
          <Text style={styles.addBtnText}>Add Alert</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 }}
        renderItem={({ item }) => {
          const isCritical = item.urgency === 'critical';
          return (
            <View
              style={[
                styles.reminderCard,
                isCritical && { borderColor: '#FECDD3' },
                item.completed && { opacity: 0.6 },
              ]}
            >
              <TouchableOpacity
                onPress={() => toggleReminder(item.id)}
                style={{ padding: 4 }}
              >
                {item.completed ? (
                  <CheckCircle2 size={24} color="#10B981" />
                ) : (
                  <Circle size={24} color="#9AA4B2" />
                )}
              </TouchableOpacity>

              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.badgeRow}>
                  <Text
                    style={[
                      styles.urgencyBadge,
                      isCritical ? styles.urgencyCritical : styles.urgencyWarning,
                    ]}
                  >
                    {item.daysLeft} DAYS LEFT
                  </Text>
                </View>

                <Text
                  style={[
                    styles.reminderTitle,
                    item.completed && { textDecorationLine: 'line-through' },
                  ]}
                >
                  {item.title}
                </Text>
                <Text style={styles.docRefText}>{item.docTitle}</Text>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F7F7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: '800', color: '#14181F' },
  subTitle: { fontSize: 12, fontWeight: '600', color: '#697586', marginTop: 2 },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0861E8', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, gap: 4 },
  addBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  reminderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 24, borderWidth: 1, borderColor: '#E3E8EF', marginBottom: 12 },
  badgeRow: { flexDirection: 'row', marginBottom: 4 },
  urgencyBadge: { fontSize: 10, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  urgencyCritical: { backgroundColor: '#FEF2F2', color: '#EF4444' },
  urgencyWarning: { backgroundColor: '#FFFBEB', color: '#D97706' },
  reminderTitle: { fontSize: 14, fontWeight: '700', color: '#14181F', lineHeight: 18 },
  docRefText: { fontSize: 12, color: '#0861E8', fontWeight: '600', marginTop: 3 },
});
