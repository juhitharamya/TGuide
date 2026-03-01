import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { touristSpots, restaurants } from '@/constants/DummyData';
import { MapPin, Utensils } from 'lucide-react-native';

export default function MapScreen() {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Text style={[styles.title, { color: colors.text }]}>Explore Map</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Discover tourist spots & restaurants
                </Text>
                <Text style={[styles.webNote, { color: colors.primary }]}>
                    📱 Open in Expo Go for the interactive map
                </Text>
            </View>

            <ScrollView style={styles.listContent}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    📍 Tourist Spots
                </Text>
                {touristSpots.map((spot) => (
                    <View
                        key={spot.id}
                        style={[
                            styles.card,
                            { backgroundColor: colors.card, borderColor: colors.border },
                        ]}
                    >
                        <View style={[styles.iconBadge, { backgroundColor: colors.primary }]}>
                            <MapPin size={18} color="#FFFFFF" />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>
                                {spot.name}
                            </Text>
                            <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
                                {spot.description}
                            </Text>
                        </View>
                    </View>
                ))}

                <Text
                    style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}
                >
                    🍽️ Restaurants
                </Text>
                {restaurants.map((restaurant) => (
                    <View
                        key={restaurant.id}
                        style={[
                            styles.card,
                            { backgroundColor: colors.card, borderColor: colors.border },
                        ]}
                    >
                        <View style={[styles.iconBadge, { backgroundColor: '#ED4956' }]}>
                            <Utensils size={18} color="#FFFFFF" />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>
                                {restaurant.name}
                            </Text>
                            <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
                                {restaurant.cuisine}
                            </Text>
                        </View>
                        <View style={[styles.ratingBadge, { backgroundColor: colors.success }]}>
                            <Text style={styles.ratingText}>⭐ {restaurant.rating}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    title: { fontSize: 24, fontWeight: '700' },
    subtitle: { fontSize: 14, marginTop: 2 },
    webNote: { fontSize: 13, marginTop: 8, fontStyle: 'italic' },
    listContent: { padding: 16, paddingBottom: 40 },
    sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 10,
    },
    iconBadge: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    cardContent: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
    cardDesc: { fontSize: 13 },
    ratingBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ratingText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
});
