import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export type NavigationItem = {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
};

type SidebarProps = {
  items: NavigationItem[];
  showLogo?: boolean;
};

export default function Sidebar({ items, showLogo = true }: SidebarProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {showLogo && <Text style={[styles.logo, { color: colors.text }]}>TGuide</Text>}
      <View style={styles.itemsContainer}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.item, { paddingVertical: 12 }]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>{item.icon}</View>
            <Text style={[styles.itemText, { color: colors.text }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: '#E5E5E5',
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  itemsContainer: {
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 16,
  },
  iconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
