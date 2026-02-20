import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { indianStates } from '@/constants/DummyData';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Calendar, DollarSign } from 'lucide-react-native';

export default function StateDetailsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const state = indianStates.find((s) => s.id === id);

  if (!state) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          State not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: state.image }} style={styles.image} />
        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
          ]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]}>{state.name}</Text>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Calendar size={20} color={colors.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Best Time to Visit
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {state.bestTime}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <DollarSign size={20} color={colors.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Estimated Budget
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {state.budget}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Top Tourist Attractions
          </Text>
          {state.touristAttractions.map((attraction, index) => (
            <View
              key={index}
              style={[
                styles.attractionCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.attractionHeader}>
                <MapPin size={18} color={colors.primary} />
                <Text style={[styles.attractionName, { color: colors.text }]}>
                  {attraction.name}
                </Text>
              </View>
              <Text style={[styles.attractionDesc, { color: colors.textSecondary }]}>
                {attraction.description}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Popular Restaurants
          </Text>
          {state.restaurants.map((restaurant, index) => (
            <View
              key={index}
              style={[
                styles.restaurantCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.restaurantInfo}>
                <Text style={[styles.restaurantName, { color: colors.text }]}>
                  {restaurant.name}
                </Text>
                <Text style={[styles.restaurantCuisine, { color: colors.textSecondary }]}>
                  {restaurant.cuisine}
                </Text>
              </View>
              <View style={[styles.ratingBadge, { backgroundColor: colors.success }]}>
                <Text style={styles.ratingText}>⭐ {restaurant.rating}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Culture & Festivals
          </Text>
          <View
            style={[
              styles.infoCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.infoCardLabel, { color: colors.textSecondary }]}>
              Culture
            </Text>
            <Text style={[styles.infoCardValue, { color: colors.text }]}>
              {state.culture}
            </Text>
          </View>
          <View
            style={[
              styles.infoCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.infoCardLabel, { color: colors.textSecondary }]}>
              Major Festivals
            </Text>
            <Text style={[styles.infoCardValue, { color: colors.text }]}>
              {state.festivals}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 24,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  attractionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  attractionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  attractionName: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  attractionDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  restaurantCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  restaurantCuisine: {
    fontSize: 14,
  },
  ratingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  infoCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  infoCardValue: {
    fontSize: 15,
    lineHeight: 22,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});
