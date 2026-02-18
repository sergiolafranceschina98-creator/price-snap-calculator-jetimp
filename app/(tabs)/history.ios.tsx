
import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { colors, typography, spacing } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('priceSnapHistory');
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
        console.log('Loaded history:', parsed.length, 'items');
      }
    } catch (error) {
      console.log('Error loading history:', error);
    }
  };

  const deleteItem = async (id: string) => {
    console.log('User tapped delete for item:', id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const updatedHistory = history.filter((item) => item.id !== id);
    setHistory(updatedHistory);
    
    try {
      await AsyncStorage.setItem('priceSnapHistory', JSON.stringify(updatedHistory));
      console.log('History updated after deletion');
    } catch (error) {
      console.log('Error saving history:', error);
    }
  };

  const clearAllHistory = async () => {
    console.log('User tapped Clear All History');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all history?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            setHistory([]);
            try {
              await AsyncStorage.removeItem('priceSnapHistory');
              console.log('All history cleared');
            } catch (error) {
              console.log('Error clearing history:', error);
            }
          },
        },
      ]
    );
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
      const minsText = diffMins === 1 ? 'min' : 'mins';
      return `${diffMins} ${minsText} ago`;
    }
    if (diffHours < 24) {
      const hoursText = diffHours === 1 ? 'hour' : 'hours';
      return `${diffHours} ${hoursText} ago`;
    }
    if (diffDays < 7) {
      const daysText = diffDays === 1 ? 'day' : 'days';
      return `${diffDays} ${daysText} ago`;
    }
    
    return date.toLocaleDateString();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'History',
          headerLargeTitle: true,
        }}
      />
      <View style={styles.container}>
        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>No History Yet</Text>
            <Text style={styles.emptySubtitle}>
              Your calculations will appear here
            </Text>
          </View>
        ) : (
          <>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
              {history.map((item) => {
                const priceText = `$${item.price.toFixed(2)}`;
                const quantityText = `${item.quantity}${item.unit}`;
                const resultText = `$${item.pricePerUnit.toFixed(4)}`;
                const unitText = item.unit;
                const dateText = formatDate(item.timestamp);

                return (
                  <View key={item.id} style={styles.historyCard}>
                    <View style={styles.historyContent}>
                      <View style={styles.historyMain}>
                        <Text style={styles.historyInput}>{priceText}</Text>
                        <Text style={styles.historySeparator}>/</Text>
                        <Text style={styles.historyInput}>{quantityText}</Text>
                        <Text style={styles.historyArrow}>→</Text>
                        <Text style={styles.historyResult}>{resultText}</Text>
                        <Text style={styles.historyUnit}>per {unitText}</Text>
                      </View>
                      <Text style={styles.historyDate}>{dateText}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteItem(item.id)}
                    >
                      <Text style={styles.deleteIcon}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.clearButton} onPress={clearAllHistory}>
                <Text style={styles.clearButtonText}>Clear All History</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </>
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
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  historyCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  historyContent: {
    flex: 1,
  },
  historyMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  historyInput: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: spacing.xs,
  },
  historySeparator: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  historyArrow: {
    fontSize: 16,
    color: colors.textSecondary,
    marginHorizontal: spacing.xs,
  },
  historyResult: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginRight: spacing.xs,
  },
  historyUnit: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  historyDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  deleteIcon: {
    fontSize: 20,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  clearButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
