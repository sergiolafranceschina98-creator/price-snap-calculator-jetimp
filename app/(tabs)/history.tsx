
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { colors, typography, spacing } from '@/styles/commonStyles';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

interface HistoryItem {
  id: string;
  price: number;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  timestamp: number;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [clearAllModalVisible, setClearAllModalVisible] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyJson = await AsyncStorage.getItem('history');
      if (historyJson) {
        const parsedHistory = JSON.parse(historyJson);
        setHistory(parsedHistory);
        console.log('Loaded history:', parsedHistory.length, 'items');
      }
    } catch (error) {
      console.log('Error loading history:', error);
    }
  };

  const deleteItem = async (id: string) => {
    console.log('Deleting history item:', id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const newHistory = history.filter((item) => item.id !== id);
      setHistory(newHistory);
      await AsyncStorage.setItem('history', JSON.stringify(newHistory));
      console.log('Item deleted successfully');
    } catch (error) {
      console.log('Error deleting item:', error);
    }
  };

  const clearAllHistory = async () => {
    console.log('Clearing all history');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      setHistory([]);
      await AsyncStorage.setItem('history', JSON.stringify([]));
      console.log('All history cleared');
    } catch (error) {
      console.log('Error clearing history:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const handleDeletePress = (id: string) => {
    setItemToDelete(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete);
    }
    setDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const handleClearAllPress = () => {
    setClearAllModalVisible(true);
  };

  const confirmClearAll = () => {
    clearAllHistory();
    setClearAllModalVisible(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'History',
          headerLargeTitle: true,
        }}
      />
      <View style={styles.container}>
        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No calculations yet</Text>
            <Text style={styles.emptySubtext}>
              Your calculation history will appear here
            </Text>
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {history.map((item) => {
                const dateText = formatDate(item.timestamp);
                const priceText = `$${item.price.toFixed(2)}`;
                const quantityText = `${item.quantity}${item.unit}`;
                const resultText = `$${item.pricePerUnit.toFixed(4)} per ${item.unit}`;

                return (
                  <View key={item.id} style={styles.historyItem}>
                    <View style={styles.historyContent}>
                      <View style={styles.historyRow}>
                        <Text style={styles.historyPrice}>{priceText}</Text>
                        <Text style={styles.historySeparator}>/</Text>
                        <Text style={styles.historyQuantity}>{quantityText}</Text>
                      </View>
                      <Text style={styles.historyResult}>{resultText}</Text>
                      <Text style={styles.historyDate}>{dateText}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeletePress(item.id)}
                    >
                      <Text style={styles.deleteButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={styles.clearAllButton}
              onPress={handleClearAllPress}
            >
              <Text style={styles.clearAllButtonText}>Clear All History</Text>
            </TouchableOpacity>
          </>
        )}

        <Modal
          visible={deleteModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Delete Item?</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to delete this calculation?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setDeleteModalVisible(false)}
                >
                  <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                  onPress={confirmDelete}
                >
                  <Text style={styles.modalButtonTextConfirm}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={clearAllModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setClearAllModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Clear All History?</Text>
              <Text style={styles.modalMessage}>
                This will permanently delete all your calculation history.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setClearAllModalVisible(false)}
                >
                  <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                  onPress={confirmClearAll}
                >
                  <Text style={styles.modalButtonTextConfirm}>Clear All</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.heading,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.subtitle,
    textAlign: 'center',
  },
  historyItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyContent: {
    flex: 1,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  historyPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  historySeparator: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.textSecondary,
    marginHorizontal: spacing.xs,
  },
  historyQuantity: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  historyResult: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  historyDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  deleteButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  clearAllButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: spacing.md,
    margin: spacing.lg,
    alignItems: 'center',
  },
  clearAllButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  modalMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: colors.inputBackground,
  },
  modalButtonConfirm: {
    backgroundColor: colors.error,
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
