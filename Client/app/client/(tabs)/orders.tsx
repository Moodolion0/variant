import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { orderService } from '../../shared/services/orderService';

// Couleurs temporaires
const colors = {
  primary: '#19b3e6',
  backgroundLight: '#f6f7f8',
  textPrimary: '#111618',
  textSecondary: '#637f88',
  white: '#ffffff',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
};

const getStatusColor = (status) => {
  switch (status) {
    case 'valide':
    case 'termine':
    case 'confirme':
      return colors.success;
    case 'en_attente':
      return colors.warning;
    case 'annule':
    case 'refuse':
      return colors.danger;
    default:
      return colors.textSecondary;
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'en_attente':
      return 'En attente';
    case 'valide':
      return 'Validée';
    case 'en_livraison':
      return 'En livraison';
    case 'termine':
      return 'Terminée';
    case 'annule':
      return 'Annulée';
    default:
      return status;
  }
};

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getClientOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderCard}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.orderDetails}>
        <View style={styles.orderInfo}>
          <MaterialCommunityIcons name="calendar" size={16} color={colors.textSecondary} />
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        <View style={styles.orderInfo}>
          <MaterialCommunityIcons name="package-variant" size={16} color={colors.textSecondary} />
          <Text style={styles.orderItems}>{item.itemsCount} article(s)</Text>
        </View>
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>{item.total.toFixed(2)} €</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Chargement de vos commandes...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Commandes</Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="package-variant-closed"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={styles.emptyText}>Vous n'avez pas encore de commandes</Text>
          <Text style={styles.emptySubtext}>Commencez vos achats pour voir vos commandes ici</Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => router.push('/client')}
          >
            <Text style={styles.shopButtonText}>Découvrir les produits</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  header: {
    padding: 16,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetails: {
    marginBottom: 12,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderDate: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
  orderItems: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.backgroundLight,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  shopButton: {
    marginTop: 24,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
