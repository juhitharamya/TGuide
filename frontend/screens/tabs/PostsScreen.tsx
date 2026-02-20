import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { PostCard } from '@/components/PostCard';
import { posts as initialPosts } from '@/constants/DummyData';
import { Plus, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function PostsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const handleLike = (postId: string) => {
    console.log('Liked post:', postId);
  };

  const handleComment = (postId: string) => {
    setSelectedPostId(postId);
    setCommentModalVisible(true);
  };

  const handleShare = (postId: string) => {
    Alert.alert('Share', 'Share functionality coming soon!');
  };

  const handleCreatePost = () => {
    router.push('/create-post');
  };

  const submitComment = () => {
    if (commentText.trim()) {
      Alert.alert('Success', 'Comment posted!');
      setCommentText('');
      setCommentModalVisible(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>TravelSphere</Text>
      </View>

      <FlatList
        data={posts}
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
            onLike={() => handleLike(item.id)}
            onComment={() => handleComment(item.id)}
            onShare={() => handleShare(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleCreatePost}
        activeOpacity={0.8}
      >
        <Plus size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={commentModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.card },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Add Comment
              </Text>
              <TouchableOpacity
                onPress={() => setCommentModalVisible(false)}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.commentInput,
                {
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Write a comment..."
              placeholderTextColor={colors.textSecondary}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              autoFocus
            />

            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={submitComment}
            >
              <Text style={styles.submitButtonText}>Post Comment</Text>
            </TouchableOpacity>
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
