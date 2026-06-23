import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, StatusBar, Modal,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import StatusBadge from '../components/StatusBadge';
import { orderHistory } from '../data/mockData';

function StarRating({ rating }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map(s => (
        <Text key={s} style={{ fontSize: 12 }}>{s <= rating ? '⭐' : '☆'}</Text>
      ))}
    </View>
  );
}

function OrderDetailModal({ order, visible, onClose }) {
  const [rating, setRating] = useState(order?.rating || 0);
  if (!order) return null;
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Order Details</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.modalContent}>
          <View style={styles.modalOrderId}>
            <Text style={styles.modalOrderIdText}>{order.id}</Text>
            <StatusBadge status={order.status} />
          </View>

          {[
            { label: 'Date',           value: order.date },
            { label: 'Cans',           value: `${order.cans} × 20-litre` },
            { label: 'Amount Paid',    value: `₹${order.amount}` },
            { label: 'Payment Mode',   value: order.paymentMode === 'wallet' ? 'Wallet' : 'Cash on Delivery' },
            { label: 'Delivered by',   value: order.deliveryPerson },
          ].map(d => (
            <View key={d.label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{d.label}</Text>
              <Text style={styles.detailValue}>{d.value}</Text>
            </View>
          ))}

          {order.status === 'delivered' && (
            <View style={styles.ratingSection}>
              <Text style={styles.ratingTitle}>Rate this delivery</Text>
              <View style={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map(s => (
                  <TouchableOpacity key={s} onPress={() => setRating(s)}>
                    <Text style={[styles.ratingStar, s <= rating && styles.ratingStarFilled]}>
                      {s <= rating ? '⭐' : '☆'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {rating > 0 && (
                <TouchableOpacity style={styles.submitRatingBtn}>
                  <Text style={styles.submitRatingText}>Submit Rating</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default function HistoryScreen({ navigation }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = orderHistory.filter(o =>
    filter === 'all' || o.status === filter
  );

  const renderItem = ({ item: o }) => (
    <TouchableOpacity
      onPress={() => setSelectedOrder(o)}
      style={styles.orderCard}
    >
      <View style={styles.orderCardTop}>
        <View>
          <Text style={styles.orderId}>{o.id}</Text>
          <Text style={styles.orderDate}>{o.date}</Text>
        </View>
        <StatusBadge status={o.status} />
      </View>

      <View style={styles.orderCardBottom}>
        <View style={styles.orderMeta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Cans</Text>
            <Text style={styles.metaValue}>{o.cans}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Amount</Text>
            <Text style={styles.metaValue}>₹{o.amount}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Payment</Text>
            <Text style={styles.metaValue}>{o.paymentMode === 'wallet' ? 'Wallet' : 'Cash'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Rider</Text>
            <Text style={[styles.metaValue, { maxWidth: 80 }]} numberOfLines={1}>{o.deliveryPerson.split(' ')[0]}</Text>
          </View>
        </View>
        {o.rating && <StarRating rating={o.rating} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <Text style={styles.headerCount}>{orderHistory.length} orders</Text>
      </View>

      {/* Filter chips */}
      <View style={styles.filters}>
        {[
          { key: 'all',       label: 'All' },
          { key: 'delivered', label: '✓ Delivered' },
          { key: 'failed',    label: '✗ Failed' },
        ].map(f => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
          >
            <Text style={[styles.filterChipText, filter === f.key && styles.filterChipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={o => o.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
      />

      <OrderDetailModal
        order={selectedOrder}
        visible={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: {
    backgroundColor: colors.white,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 22, color: colors.text },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  headerCount: { fontSize: 13, color: colors.textMuted, fontWeight: '500' },

  filters: {
    flexDirection: 'row', gap: spacing.xs,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  filterChip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2,
    borderRadius: radius.full, backgroundColor: colors.background,
    borderWidth: 1, borderColor: colors.border,
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { fontSize: 13, fontWeight: '500', color: colors.textMuted },
  filterChipTextActive: { color: colors.white },

  list: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xxl },

  orderCard: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.md, ...shadow.sm,
  },
  orderCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  orderId: { fontSize: 14, fontWeight: '700', color: colors.text },
  orderDate: { fontSize: 12, color: colors.textMuted, marginTop: 2 },

  orderCardBottom: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.background,
  },
  orderMeta: { flexDirection: 'row', gap: spacing.md },
  metaItem: {},
  metaLabel: { fontSize: 10, color: colors.textLight, fontWeight: '600', textTransform: 'uppercase' },
  metaValue: { fontSize: 13, fontWeight: '600', color: colors.text, marginTop: 2 },
  stars: { flexDirection: 'row' },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { fontSize: 16, color: colors.textMuted },

  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  closeBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, borderRadius: 16 },
  closeText: { fontSize: 14, color: colors.textMuted },

  modalContent: { padding: spacing.md, gap: spacing.sm },
  modalOrderId: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  modalOrderIdText: { fontSize: 18, fontWeight: '800', color: colors.text },

  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.background,
  },
  detailLabel: { fontSize: 14, color: colors.textMuted },
  detailValue: { fontSize: 14, fontWeight: '600', color: colors.text },

  ratingSection: {
    marginTop: spacing.md, backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.md,
  },
  ratingTitle: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  ratingStars: { flexDirection: 'row', gap: spacing.sm },
  ratingStar: { fontSize: 28, color: colors.border },
  ratingStarFilled: { color: '#f59e0b' },
  submitRatingBtn: {
    marginTop: spacing.md, backgroundColor: colors.primary,
    borderRadius: radius.md, paddingVertical: 10, alignItems: 'center',
  },
  submitRatingText: { color: colors.white, fontWeight: '600' },
});
