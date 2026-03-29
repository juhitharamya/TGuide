import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

type DesktopLayoutProps = {
  header: React.ReactNode;
  leftSidebar: React.ReactNode;
  children: React.ReactNode;
  rightSidebar: React.ReactNode;
};

export default function DesktopLayout({
  header,
  leftSidebar,
  children,
  rightSidebar,
}: DesktopLayoutProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.body}>
        <View style={styles.leftSidebar}>{leftSidebar}</View>
        <View style={styles.center}>
          <View style={[styles.headerContainer, { borderBottomColor: colors.border }]}>
            {header}
          </View>
          <View style={styles.feedColumn}>{children}</View>
        </View>
        <View style={styles.rightSidebar}>{rightSidebar}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  leftSidebar: {
    width: 280,
    borderRightWidth: 1,
    borderRightColor: '#E5E5E5',
  },
  center: {
    flex: 1,
    maxWidth: 680,
    borderRightWidth: 1,
    borderRightColor: '#E5E5E5',
  },
  headerContainer: {
    borderBottomWidth: 1,
  },
  feedColumn: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rightSidebar: {
    width: 320,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
