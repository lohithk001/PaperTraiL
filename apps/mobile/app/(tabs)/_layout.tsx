import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Home, FileText, ScanLine, Calendar, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <Home size={20} color={focused ? '#FFFFFF' : '#4B5565'} strokeWidth={2.4} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <FileText size={20} color={focused ? '#FFFFFF' : '#4B5565'} strokeWidth={2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, styles.scanButton]}>
              <ScanLine size={22} color="#0861E8" strokeWidth={2.4} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <Calendar size={20} color={focused ? '#FFFFFF' : '#4B5565'} strokeWidth={2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <Settings size={20} color={focused ? '#FFFFFF' : '#4B5565'} strokeWidth={2} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    height: 64,
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    paddingHorizontal: 8,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    backgroundColor: '#0861E8',
    width: 60,
    borderRadius: 22,
  },
  scanButton: {
    backgroundColor: '#EBF2FF',
  },
});
