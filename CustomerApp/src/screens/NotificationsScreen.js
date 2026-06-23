import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import { notifications } from '../data/mockData';

const TYPE_CONFIG = {
  delivery: { icon: '🚴', bg: '#dbeafe', label: 'Delivery' },
  payment:  { icon: '💳', bg: '#dcfce7', label: 'Payment' },
  promo:    { icon: '🎉', bg: '#fef9c3', label: 'Offer' },
};

export default function NotificationsScreen({ navigation }) {
  const [items, setItems] = useState(notifications);

  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
  const unreadCount = items.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Notifications {unreadCount > 0 && <Text style={styles.unreadBadge}>({unreadCount})</Text>}
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markRead}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={items}
        keyExtractor={n => n.id}
        contentContainerStyle={styles.list}
        renderItem={({ item: n }) => {
          const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.delivery;
          return (
            <TouchableOpacity
              onPress={() => setItems(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
              style={[styles.notifCard, !n.read && styles.notifCardUnread]}
            >
              <View style={[styles.notifIcon, { backgroundColor: cfg.bg }]}>
                <Text style={{ fontSize: 18 }}>{cfg.icon}</Text>
              </View>
              <View style={styles.notifContent}>
                <Text style={[styles.notifTitle, !n.read && styles.notifTitleBold]}>{n.title}</Text>
                <Text style={styles.notifBody}>{n.body}</Text>
                <Text style={styles.notifTime}>{n.time}</Text>
              </View>
              {!n.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔔</Text>
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 22, color: colors.text },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.text, flex: 1, textAlign: 'center' },
  unreadBadge: { color: colors.primary },
  markRead: { fontSize: 13, color: colors.primary, fontWeight: '500' },
  list: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xxl },
  notifCard: {
    backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md,
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, ...shadow.sm,
  },
  notifCardUnread: { backgroundColor: '#eff6ff', borderLeftWidth: 3, borderLeftColor: colors.primary },
  notifIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 14, fontWeight: '500', color: colors.text },
  notifTitleBold: { fontWeight: '700' },
  notifBody: { fontSize: 13, color: colors.textMuted, marginTop: 3, lineHeight: 18 },
  notifTime: { fontSize: 11, color: colors.textLight, marginTop: 4 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 4 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { fontSize: 16, color: colors.textMuted },
});
