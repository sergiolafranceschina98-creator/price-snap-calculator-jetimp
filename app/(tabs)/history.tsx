
import React, { useState } from 'react';
import { colors, typography, spacing } from '@/styles/commonStyles';
import { Stack, useFocusEffect } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

interface CalculationHistoryItem {
  id: string;
  type?: 'calculate' | 'compare';
  price?: number;
  quantity?: number;
  unit?: string;
  pricePerUnit?: number;
  productA?: {
    price: number;
    quantity: number;
    unit: string;
    pricePerUnit: number;
  };
  productB?: {
    price: number;
    quantity: number;
    unit: string;
    pricePerUnit: number;
  };
  cheaperProduct?: 'A' | 'B';
  percentageDiff?: number;
  timestamp: number;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [clearAllModalVisible, setClearAllModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      console.log('History screen focused - loading history');
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      const historyJson = await AsyncStorage.getItem('calculationHistory');
      const loadedHistory = historyJson ? JSON.parse(historyJson) : [];
      console.log('Loaded history items:', loadedHistory.length);
      setHistory(loadedHistory);
    } catch (error) {
      console.log('Error loading history:', error);
    }
  };

  const deleteItem = async (id: string) => {
    console.log('Deleting history item:', id);
    try {
      const newHistory = history.filter((item) => item.id !== id);
      await AsyncStorage.setItem('calculationHistory', JSON.stringify(newHistory));
      setHistory(newHistory);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.log('Error deleting item:', error);
    }
  };

  const clearAllHistory = async () => {
    console.log('Clearing all history');
    try {
      await AsyncStorage.removeItem('calculationHistory');
      setHistory([]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.log('Error clearing history:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'Just now';
    }
    if (diffMins < 60) {
      const minuteText = diffMins === 1 ? 'minute' : 'minutes';
      return `${diffMins} ${minuteText} ago`;
    }
    if (diffHours < 24) {
      const hourText = diffHours === 1 ? 'hour' : 'hours';
      return `${diffHours} ${hourText} ago`;
    }
    if (diffDays < 7) {
      const dayText = diffDays === 1 ? 'day' : 'days';
      return `${diffDays} ${dayText} ago`;
    }
    
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const handleDeletePress = (id: string) => {
    console.log('User tapped delete for item:', id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItemToDelete(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete);
      setItemToDelete(null);
    }
    setDeleteModalVisible(false);
  };

  const handleClearAllPress = () => {
    console.log('User tapped Clear All History');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setClearAllModalVisible(true);
  };

  const confirmClearAll = () => {
    clearAllHistory();
    setClearAllModalVisible(false);
  };

  const renderHistoryItem = (item: CalculationHistoryItem) => {
    const dateText = formatDate(item.timestamp);
    
    if (item.type === 'compare' && item.productA && item.productB) {
      const priceAText = `$${item.productA.pricePerUnit.toFixed(3)}`;
      const priceBText = `$${item.productB.pricePerUnit.toFixed(3)}`;
      const savingsText = item.percentageDiff ? `${item.percentageDiff.toFixed(0)}%` : '';
      const cheaperText = item.cheaperProduct === 'A' ? 'A' : 'B';
      
      return (
        <View key={item.id} style={styles.historyItem}>
          <View style={styles.historyContent}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyType}>COMPARISON</Text>
              <Text style={styles.historyDate}>{dateText}</Text>
            </View>
            
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonProduct}>
                <Text style={styles.comparisonLabel}>Product A</Text>
                <Text style={styles.comparisonPrice}>{priceAText}</Text>
                <Text style={styles.comparisonUnit}>per {item.productA.unit}</Text>
              </View>
              
              <View style={styles.comparisonVs}>
                <Text style={styles.comparisonVsText}>vs</Text>
              </View>
              
              <View style={styles.comparisonProduct}>
                <Text style={styles.comparisonLabel}>Product B</Text>
                <Text style={styles.comparisonPrice}>{priceBText}</Text>
                <Text style={styles.comparisonUnit}>per {item.productB.unit}</Text>
              </View>
            </View>
            
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsText}>Product {cheaperText} saves {savingsText}</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeletePress(item.id)}
          >
            <Text style={styles.deleteButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    const priceText = item.price ? `$${item.price.toFixed(2)}` : '';
    const quantityText = item.quantity ? item.quantity.toString() : '';
    const unitText = item.unit || '';
    const pricePerUnitText = item.pricePerUnit ? `$${item.pricePerUnit.toFixed(3)}` : '';
    
    return (
      <View key={item.id} style={styles.historyItem}>
        <View style={styles.historyContent}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyType}>CALCULATION</Text>
            <Text style={styles.historyDate}>{dateText}</Text>
          </View>
          <Text style={styles.historyCalculation}>{priceText} / {quantityText}{unitText}</Text>
          <Text style={styles.historyResult}>{pricePerUnitText} per {unitText}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeletePress(item.id)}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'History',
          headerLargeTitle: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }}
      />

      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No History Yet</Text>
          <Text style={styles.emptyStateText}>Your calculations will appear here</Text>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {history.map((item) => renderHistoryItem(item))}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.clearAllButton}
              onPress={handleClearAllPress}
            >
              <Text style={styles.clearAllButtonText}>Clear All History</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Item?</Text>
            <Text style={styles.modalText}>This action cannot be undone.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDelete]}
                onPress={confirmDelete}
              >
                <Text style={styles.modalButtonTextDelete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={clearAllModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setClearAllModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Clear All History?</Text>
            <Text style={styles.modalText}>This will delete all your calculations and comparisons.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setClearAllModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDelete]}
                onPress={confirmClearAll}
              >
                <Text style={styles.modalButtonTextDelete}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyStateTitle: {
    ...typography.title,
    fontSize: 26,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    ...typography.body,
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  historyItem: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  historyContent: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  historyType: {
    ...typography.label,
    fontSize: 13,
    color: colors.primary,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  historyCalculation: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  historyResult: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  comparisonProduct: {
    flex: 1,
  },
  comparisonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  comparisonPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  comparisonUnit: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  comparisonVs: {
    paddingHorizontal: spacing.sm,
  },
  comparisonVsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  savingsBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  savingsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  deleteButtonText: {
    fontSize: 26,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 30,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl + 60,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  clearAllButton: {
    backgroundColor: colors.inputBackground,
    borderRadius: 16,
    padding: spacing.md + 6,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  clearAllButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    padding: spacing.md + 6,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: colors.inputBackground,
    borderWidth: 2,
    borderColor: colors.border,
  },
  modalButtonDelete: {
    backgroundColor: colors.error,
  },
  modalButtonTextCancel: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  modalButtonTextDelete: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
