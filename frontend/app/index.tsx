import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
    const { user, isLoading } = useAuth();

    // While restoring persisted session, show a spinner
    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2C5364" />
            </View>
        );
    }

    // Logged in → go to main app
    if (user) {
        return <Redirect href="/(tabs)" />;
    }

    // Not logged in → go to login
    return <Redirect href="/auth/login" />;
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
});
