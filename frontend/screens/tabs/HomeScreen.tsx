import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { StateCard } from '@/components/StateCard';
import { indianStates } from '@/constants/DummyData';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const handleStatePress = (stateId: string) => {
    router.push(`/state/${stateId}`);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Explore India
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Discover amazing destinations
        </Text>
      </View>

      <FlatList
        data={indianStates}
        renderItem={({ item }) => (
          <StateCard
            name={item.name}
            image={item.image}
            culture={item.culture}
            festivals={item.festivals}
            famousPlaces={item.famousPlaces}
            onPress={() => handleStatePress(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  list: {
    paddingBottom: 16,
  },
});
