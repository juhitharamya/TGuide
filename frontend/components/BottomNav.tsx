import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

type BottomNavItem = {
  key: string;
  label: string;
  onPress: () => void;
};

type BottomNavProps = {
  items: BottomNavItem[];
  activeKey: string;
};

export default function BottomNav({ items, activeKey }: BottomNavProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const active = item.key === activeKey;

        return (
          <TouchableOpacity
            key={item.key}
            style={styles.item}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, { color: active ? colors.primary : colors.textSecondary }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
});
