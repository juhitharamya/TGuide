import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Bookmark, Grid } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { profileAPI } from '@/services/api';

type SavedPlan = {
  id: string;
  destination: string;
  duration: string;
  budget: string;
};

type ProfileData = {
  id: string;
  username: string;
  name: string;
  bio: string;
  profileImage: string;
  followers: number;
  following: number;
  posts: string[];
  savedPlans: SavedPlan[];
};

export default function ProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user: authUser, logout } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!authUser?.id) {
        setLoadingProfile(false);
        return;
      }

      setLoadingProfile(true);
      try {
        const response = await profileAPI.getProfile(authUser.id);
        setProfile(response);
      } catch (err) {
        console.error(err);
        setProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [authUser]);

  const displayName = profile?.name || authUser?.name || authUser?.username || 'Traveler';
  const displayUsername = profile?.username || authUser?.username || 'user';
  const displayBio = profile?.bio || authUser?.bio || 'No bio added yet.';
  const displayImage = profile?.profileImage || authUser?.profileImage || '';
  const displayFollowers = profile?.followers ?? authUser?.followers ?? 0;
  const displayFollowing = profile?.following ?? authUser?.following ?? 0;
  const displayPosts = profile?.posts || [];
  const displaySavedPlans = profile?.savedPlans || [];

  const handleEditProfile = () => {
    router.push('/state/edit-profile');
  };

  const handleCreatePost = () => {
    router.push('/state/create-post');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.username, { color: colors.text }]}>
          {displayUsername}
        </Text>
        <TouchableOpacity onPress={handleLogout}>
          <Settings size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            {displayImage ? (
              <Image
                source={{ uri: displayImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profileImage, styles.profileImagePlaceholder, { backgroundColor: colors.border }]}>
                <Text style={[styles.profileImageInitial, { color: colors.text }]}>
                  {(displayName || 'U').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {displayPosts.length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Posts
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {displayFollowers.toLocaleString()}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Followers
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {displayFollowing}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Following
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.name, { color: colors.text }]}>
              {displayName}
            </Text>
            <Text style={[styles.bio, { color: colors.text }]}>
              {displayBio}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleEditProfile}
            >
              <Text style={styles.actionButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.secondaryActionButton,
                { borderColor: colors.border, backgroundColor: colors.card },
              ]}
              onPress={handleCreatePost}
            >
              <Text style={[styles.secondaryActionButtonText, { color: colors.text }]}>Create Post</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.tabsContainer, { borderTopColor: colors.border }]}>
          <TouchableOpacity style={styles.tab}>
            <Grid size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Bookmark size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.postsGrid}>
          {displayPosts.map((post, index) => (
            <TouchableOpacity key={index} style={styles.gridItem}>
              <Image source={{ uri: post }} style={styles.gridImage} />
            </TouchableOpacity>
          ))}
          {!loadingProfile && displayPosts.length === 0 && (
            <View style={styles.emptySection}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No posts yet.</Text>
            </View>
          )}
        </View>

        <View style={styles.savedSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Saved Travel Plans
          </Text>
          {loadingProfile && (
            <View style={styles.loadingSection}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          )}
          {!loadingProfile && displaySavedPlans.map((plan) => (
            <View
              key={plan.id}
              style={[
                styles.planCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.planInfo}>
                <Text style={[styles.planTitle, { color: colors.text }]}>
                  {plan.destination}
                </Text>
                <View style={styles.planDetails}>
                  <Text style={[styles.planDetail, { color: colors.textSecondary }]}>
                    ⏱️ {plan.duration}
                  </Text>
                  <Text style={[styles.planDetail, { color: colors.textSecondary }]}>
                    💰 {plan.budget}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.viewButton,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          ))}
          {!loadingProfile && displaySavedPlans.length === 0 && (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No saved plans yet.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
  },
  profileSection: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  profileImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageInitial: {
    fontSize: 30,
    fontWeight: '700',
  },
  stats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  profileInfo: {
    marginBottom: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryActionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryActionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 1,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  savedSection: {
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  planCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  planDetails: {
    flexDirection: 'row',
  },
  planDetail: {
    fontSize: 14,
    marginRight: 16,
  },
  viewButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingSection: {
    paddingVertical: 10,
  },
  emptySection: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
