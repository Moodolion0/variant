import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { livreurService } from "../services/livreurService";

const COLORS = {
  primary: "#19b3e6",
  background: "#f6f7f8",
  white: "#ffffff",
  textPrimary: "#111618",
  textSecondary: "#637f88",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
};

const TransactionCard = ({ transaction }: { transaction: any }) => {
  const isPositive = transaction.amount > 0;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.transactionCard}>
      <View style={styles.transactionIcon}>
        <MaterialCommunityIcons
          name={isPositive ? "arrow-down-circle" : "arrow-up-circle"}
          size={24}
          color={isPositive ? COLORS.success : COLORS.danger}
        />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription}>
          {transaction.description || (isPositive ? "Revenu" : "Dépense")}
        </Text>
        <Text style={styles.transactionDate}>{formatDate(transaction.created_at)}</Text>
      </View>
      <Text style={[styles.transactionAmount, { color: isPositive ? COLORS.success : COLORS.danger }]}>
        {isPositive ? "+" : ""}{transaction.amount.toFixed(2)} XOF
      </Text>
    </View>
  );
};

export default function WalletScreen() {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const fetchWallet = useCallback(async () => {
    try {
      const data = await livreurService.getWallet();
      setWallet(data);
    } catch (error) {
      console.error("Error fetching wallet:", error);
      Alert.alert("Erreur", "Impossible de charger le portefeuille");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWallet();
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Erreur", "Veuillez entrer un montant valide");
      return;
    }

    if (wallet && amount > wallet.balance) {
      Alert.alert("Erreur", "Solde insuffisant");
      return;
    }

    try {
      await livreurService.requestWithdraw(amount);
      Alert.alert("Succès", "Demande de retrait envoyée !");
      setShowWithdrawModal(false);
      setWithdrawAmount("");
      fetchWallet();
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Impossible de faire le retrait");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const balance = wallet?.balance || 0;
  const transactions = wallet?.transactions || [];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mon Portefeuille</Text>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <MaterialCommunityIcons name="wallet" size={32} color={COLORS.white} />
          <Text style={styles.balanceLabel}>Solde disponible</Text>
        </View>
        <Text style={styles.balanceValue}>{balance.toFixed(2)} XOF</Text>
        
        <TouchableOpacity
          style={styles.withdrawButton}
          onPress={() => setShowWithdrawModal(true)}
        >
          <MaterialCommunityIcons name="cash-out" size={20} color={COLORS.primary} />
          <Text style={styles.withdrawButtonText}>Demander un retrait</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={onRefresh}>
          <MaterialCommunityIcons name="refresh" size={24} color={COLORS.primary} />
          <Text style={styles.actionButtonText}>Actualiser</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="history" size={24} color={COLORS.primary} />
          <Text style={styles.actionButtonText}>Historique</Text>
        </TouchableOpacity>
      </View>

      {/* Withdraw Modal (Simple version) */}
      {showWithdrawModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Demander un retrait</Text>
            <Text style={styles.modalSubtitle}>
              Solde actuel: {balance.toFixed(2)} XOF
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Montant</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputPrefix}>XOF</Text>
                <TouchableOpacity 
                  style={styles.amountButtons}
                  onPress={() => setWithdrawAmount(Math.max(0, parseFloat(withdrawAmount) || 0 - 1000).toString())}
                >
                  <MaterialCommunityIcons name="minus" size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.amountButtons}
                  onPress={() => setWithdrawAmount((parseFloat(withdrawAmount) || 0 + 1000).toString())}
                >
                  <MaterialCommunityIcons name="plus" size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount("");
                }}
              >
                <Text style={styles.cancelModalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmModalButton]}
                onPress={handleWithdraw}
              >
                <Text style={styles.confirmModalButtonText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Transactions */}
      <View style={styles.transactionsSection}>
        <Text style={styles.sectionTitle}>Historique des transactions</Text>
        
        {transactions.length === 0 ? (
          <View style={styles.emptyTransactions}>
            <MaterialCommunityIcons name="wallet-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>Aucune transaction</Text>
          </View>
        ) : (
          transactions.map((transaction: any) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  balanceCard: {
    margin: 20,
    padding: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: COLORS.white + "cc",
  },
  balanceValue: {
    fontSize: 40,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 20,
  },
  withdrawButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  actionsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  transactionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 12,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  transactionDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  emptyTransactions: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 12,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modal: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  inputPrefix: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  amountButtons: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelModalButton: {
    backgroundColor: COLORS.background,
  },
  cancelModalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  confirmModalButton: {
    backgroundColor: COLORS.primary,
  },
  confirmModalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
});
