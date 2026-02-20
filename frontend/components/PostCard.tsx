import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Heart, MessageCircle, Send } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

type PostCardProps = {
  username: string;
  userImage: string;
  postImage: string;
  caption: string;
  location: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
};

export const PostCard: React.FC<PostCardProps> = ({
  username,
  userImage,
  postImage,
  caption,
  location,
  likes,
  comments,
  timestamp,
  isLiked: initialIsLiked,
  onLike,
  onComment,
  onShare,
}) => {
  const { colors } = useTheme();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    onLike();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Image source={{ uri: userImage }} style={styles.userImage} />
        <View style={styles.headerText}>
          <Text style={[styles.username, { color: colors.text }]}>
            {username}
          </Text>
          <Text style={[styles.location, { color: colors.textSecondary }]}>
            {location}
          </Text>
        </View>
      </View>

      <Image source={{ uri: postImage }} style={styles.postImage} />

      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <Heart
              size={28}
              color={isLiked ? '#ED4956' : colors.text}
              fill={isLiked ? '#ED4956' : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onComment} style={styles.actionButton}>
            <MessageCircle size={28} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onShare} style={styles.actionButton}>
            <Send size={26} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.likes, { color: colors.text }]}>
          {likesCount.toLocaleString()} likes
        </Text>
        <View style={styles.captionContainer}>
          <Text style={[styles.username, { color: colors.text }]}>
            {username}{' '}
          </Text>
          <Text style={[styles.caption, { color: colors.text }]}>
            {caption}
          </Text>
        </View>
        {comments > 0 && (
          <TouchableOpacity onPress={onComment}>
            <Text style={[styles.viewComments, { color: colors.textSecondary }]}>
              View all {comments} comments
            </Text>
          </TouchableOpacity>
        )}
        <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
          {timestamp}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerText: {
    marginLeft: 12,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
  },
  location: {
    fontSize: 12,
    marginTop: 2,
  },
  postImage: {
    width: width,
    height: width,
    resizeMode: 'cover',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  leftActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 16,
  },
  content: {
    paddingHorizontal: 12,
  },
  likes: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  captionContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  caption: {
    fontSize: 14,
    flex: 1,
  },
  viewComments: {
    fontSize: 14,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
});
