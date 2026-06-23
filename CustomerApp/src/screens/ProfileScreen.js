import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Switch, Alert,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import { currentUser } from '../data/mockData';

function MenuItem({ icon, label, sublabel, onPress, rightElement, destructive }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.menuItem} activeOpacity={0.7}>
      <Text style={styles.menuItemIcon}>{icon}</Text>
      <View style={styles.menuItemContent}>
        <Text style={[styles.menuItemLabel, destructive && styles.menuItemDestructive]}>{label}</Text>
        {sublabel && <Text style={styles.menuItemSublabel}>{sublabel}</Text>}
      </View>
      {rightElement || <Text style={styles.menuItemArrow}>›</Text>}
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ navigation }) {
  const [notifications, setNotifications] = useState(true);
  const [whatsapp, setWhatsapp] = useState(true);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => navigation.replace('Login') },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar & info */}
        <View style={styles.profileHero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{currentUser.name.charAt(0)}</Text>
          </View>
          <Text style={styles.profileName}>{currentUser.name}</Text>
          <Text style={styles.profilePhone}>{currentUser.phone}</Text>
          <View style={styles.dealerBadge}>
            <Text style={styles.dealerBadgeText}>
              🏪 {currentUser.dealer.name}
            </Text>
          </View>
        </View>

        {/* Address card */}
        <View style={styles.addressCard}>
          <View style={styles.addressCardHeader}>
            <Text style={styles.addressCardTitle}>📍 Delivery Address</Text>
            <TouchableOpacity><Text style={styles.editLink}>Edit</Text></TouchableOpacity>
          </View>
          <Text style={styles.addressText}>{currentUser.address}</Text>
          <Text style={styles.zoneTag}>Zone: {currentUser.zone}</Text>
        </View>

        {/* Account section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account</Text>
          <View style={styles.menuGroup}>
            <MenuItem icon="👤" label="Edit Profile" sublabel="Name, phone number" onPress={() => {}} />
            <MenuItem icon="🏠" label="Manage Addresses" sublabel="Add or edit delivery locations" onPress={() => {}} />
            <MenuItem icon="🔄" label="Subscription" sublabel="Manage recurring orders" onPress={() => navigation.navigate('Subscription')} />
            <MenuItem icon="📋" label="Order History" sublabel={`${currentUser.orderCount || 87} orders placed`} onPress={() => navigation.navigate('History')} />
          </View>
        </View>

        {/* Notifications section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Notifications</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon="🔔"
              label="Push Notifications"
              sublabel="Order updates, delivery alerts"
              rightElement={
                <Switch value={notifications} onValueChange={setNotifications}
                  trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.white} />
              }
            />
            <MenuItem
              icon="💬"
              label="WhatsApp Alerts"
              sublabel="Receive updates on WhatsApp"
              rightElement={
                <Switch value={whatsapp} onValueChange={setWhatsapp}
                  trackColor={{ false: colors.border, true: '#25d366' }} thumbColor={colors.white} />
              }
            />
          </View>
        </View>

        {/* Language section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Language</Text>
          <View style={styles.menuGroup}>
            {[
              { key: 'en', label: 'English', native: 'English' },
              { key: 'ta', label: 'Tamil',   native: 'தமிழ்' },
              { key: 'te', label: 'Telugu',  native: 'తెలుగు' },
              { key: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
              { key: 'ml', label: 'Malayalam',native: 'മലയാളം' },
            ].map(lang => (
              <TouchableOpacity key={lang.key} style={styles.menuItem}>
                <View style={[styles.langDot, currentUser.language === lang.key && styles.langDotActive]} />
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemLabel}>{lang.native}</Text>
                  <Text style={styles.menuItemSublabel}>{lang.label}</Text>
                </View>
                {currentUser.language === lang.key && (
                  <Text style={{ color: colors.primary, fontSize: 18 }}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Support & Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Support</Text>
          <View style={styles.menuGroup}>
            <MenuItem icon="📞" label="Contact Dealer" sublabel={currentUser.dealer.phone} onPress={() => {}} />
            <MenuItem icon="❓" label="FAQ & Help" onPress={() => {}} />
            <MenuItem icon="📄" label="Terms of Service" onPress={() => {}} />
            <MenuItem icon="🔒" label="Privacy Policy" onPress={() => {}} />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.menuGroup}>
            <MenuItem icon="🚪" label="Log Out" onPress={handleLogout} destructive />
          </View>
        </View>

        <Text style={styles.appVersion}>CanOps v1.0.0 · Water, On Your Way</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.white, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.text },

  scroll: { flex: 1 },

  profileHero: {
    backgroundColor: colors.white, alignItems: 'center',
    paddingTop: spacing.xl, paddingBottom: spacing.lg,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md, ...shadow.md,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: colors.white },
  profileName: { fontSize: 22, fontWeight: '800', color: colors.text },
  profilePhone: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  dealerBadge: {
    marginTop: spacing.sm, backgroundColor: colors.primaryLight,
    borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  },
  dealerBadgeText: { fontSize: 12, fontWeight: '600', color: colors.primaryDark },

  addressCard: {
    backgroundColor: colors.white, margin: spacing.md, borderRadius: radius.lg,
    padding: spacing.md, ...shadow.sm,
  },
  addressCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  addressCardTitle: { fontSize: 13, fontWeight: '700', color: colors.text },
  editLink: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  addressText: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  zoneTag: { fontSize: 11, color: colors.primary, fontWeight: '600', marginTop: spacing.xs },

  section: { marginHorizontal: spacing.md, marginBottom: spacing.md },
  sectionHeader: {
    fontSize: 11, fontWeight: '700', color: colors.textLight, textTransform: 'uppercase',
    letterSpacing: 0.8, marginBottom: spacing.xs, marginLeft: 4,
  },
  menuGroup: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    overflow: 'hidden', ...shadow.sm,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md,
    paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.background,
  },
  menuItemIcon: { fontSize: 20, marginRight: spacing.md },
  menuItemContent: { flex: 1 },
  menuItemLabel: { fontSize: 15, fontWeight: '500', color: colors.text },
  menuItemDestructive: { color: colors.error },
  menuItemSublabel: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  menuItemArrow: { fontSize: 20, color: colors.textLight, fontWeight: '300' },

  langDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: colors.border, marginRight: spacing.md,
  },
  langDotActive: { backgroundColor: colors.primary },

  appVersion: {
    textAlign: 'center', fontSize: 12, color: colors.textLight,
    paddingVertical: spacing.xl,
  },
});
