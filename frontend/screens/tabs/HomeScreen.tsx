import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Home, Compass, MessageCircle, User, SquarePlus } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { postsAPI } from '@/services/api';
import { useDeviceType } from '@/hooks/useDeviceType';
import MobileLayout from '@/layout/MobileLayout';
import DesktopLayout from '@/layout/DesktopLayout';
import Navbar from '@/components/Navbar';
import Sidebar, { NavigationItem } from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import Feed, { FeedPost } from '@/components/Feed';
import Recommendations from '@/components/Recommendations';

type PostResponse = FeedPost;

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { isMobile } = useDeviceType();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await postsAPI.getPosts();
      setPosts(Array.isArray(response) ? (response as PostResponse[]) : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setPosts([]);
      setError('Failed to load travel feed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleLike = async (postId: string) => {
    try {
      const result = await postsAPI.likePost(postId);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: typeof result?.likes === 'number' ? result.likes : post.likes,
                isLiked: typeof result?.isLiked === 'boolean' ? result.isLiked : post.isLiked,
              }
            : post
        )
      );
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Unable to update like right now.');
    }
  };

  const handleComment = (_postId: string) => {
    router.push('/(tabs)/posts');
  };

  const leftNavItems = useMemo(
    (): NavigationItem[] => [
      { 
        label: 'Home', 
        icon: <Home size={24} color={colors.text} />, 
        onPress: () => router.push('/(tabs)') 
      },
      { 
        label: 'Explore', 
        icon: <Compass size={24} color={colors.text} />, 
        onPress: () => router.push('/(tabs)/map') 
      },
      { 
        label: 'Chat', 
        icon: <MessageCircle size={24} color={colors.text} />, 
        onPress: () => router.push('/(tabs)/chatbot') 
      },
      {
        label: 'Create',
        icon: <SquarePlus size={24} color={colors.text} />,
        onPress: () => router.push('/state/create-post')
      },
      { 
        label: 'Profile', 
        icon: <User size={24} color={colors.text} />, 
        onPress: () => router.push('/(tabs)/profile') 
      },
    ],
    [colors.text, router]
  );

  const rightItems = useMemo(
    () => [],
    []
  );

  const bottomItems = useMemo(
    () => [
      { key: 'home', label: 'Home', onPress: () => router.push('/(tabs)') },
      { key: 'explore', label: 'Explore', onPress: () => router.push('/(tabs)/map') },
      { key: 'post', label: 'Post', onPress: () => router.push('/state/create-post') },
      { key: 'chat', label: 'Chat', onPress: () => router.push('/(tabs)/chatbot') },
      { key: 'profile', label: 'Profile', onPress: () => router.push('/(tabs)/profile') },
    ],
    [router]
  );

  const feed = (
    <Feed
      posts={posts}
      loading={loading}
      error={error}
      onRetry={loadPosts}
      onLike={handleLike}
      onComment={handleComment}
    />
  );

  const header = <Navbar title="TGuide" subtitle="Travel feed and inspiration" />;

  if (isMobile) {
    return (
      <MobileLayout
        header={header}
        bottomNav={<BottomNav items={bottomItems} activeKey="home" />}
      >
        {feed}
      </MobileLayout>
    );
  }

  return (
    <DesktopLayout
      header={header}
      leftSidebar={<Sidebar items={leftNavItems} showLogo={true} />}
      rightSidebar={<Recommendations title="Trending Places" items={rightItems} />}
    >
      <View style={[styles.feedWrapper, { backgroundColor: colors.background }]}>{feed}</View>
    </DesktopLayout>
  );
}

const styles = StyleSheet.create({
  feedWrapper: {
    flex: 1,
    borderRadius: 12,
  },
});
