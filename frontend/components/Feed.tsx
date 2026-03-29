import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { PostCard } from '@/components/PostCard';
import { useTheme } from '@/contexts/ThemeContext';

export type FeedPost = {
  id: string;
  username: string;
  userImage: string;
  postImage: string;
  caption: string;
  location: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked: boolean;
};

type FeedProps = {
  posts: FeedPost[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
};

export default function Feed({ posts, loading, error, onRetry, onLike, onComment }: FeedProps) {
  const { colors } = useTheme();

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <Text style={[styles.message, { color: colors.textSecondary }]}>Loading feed...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContent}>
        <Text style={[styles.message, { color: colors.text }]}>{error}</Text>
        <Text style={[styles.retry, { color: colors.primary }]} onPress={onRetry}>
          Try again
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <PostCard
          username={item.username}
          userImage={item.userImage}
          postImage={item.postImage}
          caption={item.caption}
          location={item.location}
          likes={item.likes}
          comments={item.comments}
          timestamp={item.timestamp}
          isLiked={item.isLiked}
          onLike={() => onLike(item.id)}
          onComment={() => onComment(item.id)}
          onShare={() => undefined}
        />
      )}
      ListEmptyComponent={
        <View style={styles.centerContent}>
          <Text style={[styles.message, { color: colors.textSecondary }]}>No travel posts yet.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 16,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
  },
  retry: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
  },
});
