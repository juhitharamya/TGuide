import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export type RecommendationItem = {
  label: string;
  onPress?: () => void;
};

type RecommendationsProps = {
  title: string;
  items: RecommendationItem[];
};

export default function Recommendations({ title, items }: RecommendationsProps) {
  const { colors } = useTheme();

  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <View style={styles.itemsContainer}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.item}
            onPress={item.onPress}
            activeOpacity={0.6}
          >
            <Text style={[styles.itemLabel, { color: colors.text }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  itemsContainer: {
    gap: 12,
  },
  item: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
});
