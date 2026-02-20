import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useTheme } from '@/contexts/ThemeContext';
import { touristSpots, restaurants } from '@/constants/DummyData';
import { MapPin, Utensils, X, Star } from 'lucide-react-native';

type MarkerData = {
  id: string;
  name: string;
  type: 'monument' | 'restaurant';
  description?: string;
  cuisine?: string;
  rating?: number;
};

export default function MapScreen() {
  const { colors } = useTheme();
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const initialRegion = {
    latitude: 20.5937,
    longitude: 78.9629,
    latitudeDelta: 20,
    longitudeDelta: 20,
  };

  const handleMarkerPress = (marker: MarkerData) => {
    setSelectedMarker(marker);
    setModalVisible(true);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Explore Map
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Discover tourist spots & restaurants
        </Text>
      </View>

      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={initialRegion}
      >
        {touristSpots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={spot.coordinates}
            title={spot.name}
            description={spot.description}
            onPress={() =>
              handleMarkerPress({
                id: spot.id,
                name: spot.name,
                type: 'monument',
                description: spot.description,
              })
            }
          >
            <View
              style={[
                styles.markerContainer,
                { backgroundColor: colors.primary },
              ]}
            >
              <MapPin size={20} color="#FFFFFF" />
            </View>
          </Marker>
        ))}

        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={restaurant.coordinates}
            title={restaurant.name}
            description={restaurant.cuisine}
            onPress={() =>
              handleMarkerPress({
                id: restaurant.id,
                name: restaurant.name,
                type: 'restaurant',
                cuisine: restaurant.cuisine,
                rating: restaurant.rating,
              })
            }
          >
            <View
              style={[
                styles.markerContainer,
                { backgroundColor: colors.error },
              ]}
            >
              <Utensils size={20} color="#FFFFFF" />
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: colors.primary }]}
          />
          <Text style={[styles.legendText, { color: colors.text }]}>
            Tourist Spots
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: colors.error }]}
          />
          <Text style={[styles.legendText, { color: colors.text }]}>
            Restaurants
          </Text>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[styles.modalContent, { backgroundColor: colors.card }]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                {selectedMarker?.type === 'monument' ? (
                  <MapPin size={24} color={colors.primary} />
                ) : (
                  <Utensils size={24} color={colors.error} />
                )}
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {selectedMarker?.name}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedMarker?.type === 'monument' ? (
                <View>
                  <Text
                    style={[styles.modalLabel, { color: colors.textSecondary }]}
                  >
                    Description
                  </Text>
                  <Text style={[styles.modalText, { color: colors.text }]}>
                    {selectedMarker.description}
                  </Text>
                  <View style={styles.modalInfo}>
                    <Text
                      style={[styles.modalInfoText, { color: colors.text }]}
                    >
                      📍 Historic Monument
                    </Text>
                    <Text
                      style={[styles.modalInfoText, { color: colors.text }]}
                    >
                      🎫 Entry may require tickets
                    </Text>
                    <Text
                      style={[styles.modalInfoText, { color: colors.text }]}
                    >
                      📸 Photography allowed
                    </Text>
                  </View>
                </View>
              ) : (
                <View>
                  <Text
                    style={[styles.modalLabel, { color: colors.textSecondary }]}
                  >
                    Cuisine
                  </Text>
                  <Text style={[styles.modalText, { color: colors.text }]}>
                    {selectedMarker?.cuisine}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Star size={20} color="#FFD700" fill="#FFD700" />
                    <Text style={[styles.ratingText, { color: colors.text }]}>
                      {selectedMarker?.rating} / 5.0
                    </Text>
                  </View>
                  <View style={styles.modalInfo}>
                    <Text
                      style={[styles.modalInfoText, { color: colors.text }]}
                    >
                      🍽️ Dine-in available
                    </Text>
                    <Text
                      style={[styles.modalInfoText, { color: colors.text }]}
                    >
                      🚗 Parking available
                    </Text>
                    <Text
                      style={[styles.modalInfoText, { color: colors.text }]}
                    >
                      💳 Cards accepted
                    </Text>
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.directionsButton,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.directionsButtonText}>
                  Get Directions
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  legend: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
    flex: 1,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  modalInfo: {
    marginBottom: 20,
  },
  modalInfoText: {
    fontSize: 14,
    lineHeight: 24,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  directionsButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  directionsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
