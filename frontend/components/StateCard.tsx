import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

type StateCardProps = {
  name: string;
  image: string;
  culture: string;
  festivals: string;
  famousPlaces: string;
  onPress: () => void;
};

export const StateCard: React.FC<StateCardProps> = ({
  name,
  image,
  culture,
  festivals,
  famousPlaces,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Culture
        </Text>
        <Text
          style={[styles.text, { color: colors.text }]}
          numberOfLines={2}
        >
          {culture}
        </Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Festivals
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>{festivals}</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Famous Places
        </Text>
        <Text
          style={[styles.text, { color: colors.text }]}
          numberOfLines={2}
        >
          {famousPlaces}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
});
