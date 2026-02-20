import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

type ChatBubbleProps = {
  message: string;
  isUser: boolean;
  timestamp?: string;
};

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isUser,
  timestamp,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.botContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser
            ? { backgroundColor: colors.primary }
            : { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text
          style={[
            styles.message,
            { color: isUser ? '#FFFFFF' : colors.text },
          ]}
        >
          {message}
        </Text>
        {timestamp && (
          <Text
            style={[
              styles.timestamp,
              { color: isUser ? 'rgba(255,255,255,0.7)' : colors.textSecondary },
            ]}
          >
            {timestamp}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  botContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  message: {
    fontSize: 15,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
});
