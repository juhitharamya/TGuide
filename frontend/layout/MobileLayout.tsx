import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

type MobileLayoutProps = {
  header: React.ReactNode;
  children: React.ReactNode;
  bottomNav: React.ReactNode;
};

export default function MobileLayout({ header, children, bottomNav }: MobileLayoutProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={[styles.headerContainer, { borderBottomColor: colors.border }]}>{header}</View>
      <View style={styles.content}>{children}</View>
      <View style={[styles.bottomNavContainer, { borderTopColor: colors.border, backgroundColor: colors.card }]}>
        {bottomNav}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
  },
  bottomNavContainer: {
    borderTopWidth: 1,
  },
});
