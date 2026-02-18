
import React, { useState, useEffect } from 'react';
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
      if (historyJson) {
        const parsedHistory = JSON.parse(historyJson);
        setHistory(parsedHistory);
        console.log('Loaded history:', parsedHistory.length, 'items');
      } else {
        console.log('No history found in storage');
        setHistory([]);
      }
    } catch (error) {
      console.log('Error loading history:', error);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const newHistory = history.filter((item) => item.id !== id);
      await AsyncStorage.setItem('calculationHistory', JSON.stringify(newHistory));
      setHistory(newHistory);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      console.log('Deleted history item:', id);
    } catch (error) {
      console.log('Error deleting item:', error);
    }
  };

  const clearAllHistory = async () => {
    try {
      await AsyncStorage.removeItem('calculationHistory');
      setHistory([]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      console.log('Cleared all history');
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

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
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
    }
    setDeleteModalVisible(false);
    setItemToDelete(null);
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
          <Text style={styles.emptyStateText}>
            Your calculations will appear here
          </Text>
        </View>
      ) : (
        <>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {history.map((item, index) => {
              const formattedDate = formatDate(item.timestamp);
              const priceText = `$${item.price.toFixed(2)}`;
              const quantityText = `${item.quantity}${item.unit}`;
              const resultText = `$${item.pricePerUnit.toFixed(3)} per ${item.unit}`;

              return (
                <React.Fragment key={item.id}>
                  <View style={styles.historyCard}>
                    <View style={styles.historyContent}>
                      <View style={styles.historyHeader}>
                        <Text style={styles.historyInput}>{priceText}</Text>
                        <Text style={styles.historySeparator}>/</Text>
                        <Text style={styles.historyInput}>{quantityText}</Text>
                      </View>
                      <Text style={styles.historyResult}>{resultText}</Text>
                      <Text style={styles.historyDate}>{formattedDate}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeletePress(item.id)}
                    >
                      <Text style={styles.deleteButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                </React.Fragment>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearAllPress}>
              <Text style={styles.clearButtonText}>Clear All History</Text>
            </TouchableOpacity>
          </View>
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
            <Text style={styles.modalText}>
              This calculation will be removed from your history.
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
            <Text style={styles.modalText}>
              All your calculation history will be permanently deleted.
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
    paddingBottom: spacing.xxl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyStateTitle: {
    ...typography.heading,
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  historyCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  historyContent: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  historyInput: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  historySeparator: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.textSecondary,
    marginHorizontal: spacing.sm,
  },
  historyResult: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  historyDate: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  deleteButtonText: {
    fontSize: 28,
    fontWeight: '300',
    color: colors.error,
    lineHeight: 28,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  clearButton: {
    backgroundColor: colors.error,
    borderRadius: 16,
    padding: spacing.md + 4,
    alignItems: 'center',
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  clearButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  modalTitle: {
    ...typography.heading,
    fontSize: 22,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modalText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    padding: spacing.md + 2,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: colors.inputBackground,
    borderWidth: 2,
    borderColor: colors.border,
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
