import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ChatBubble } from '@/components/ChatBubble';
import { chatSuggestions } from '@/constants/DummyData';
import { Send, Sparkles } from 'lucide-react-native';
import { chatbotAPI } from '@/services/api';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
};

export default function ChatBotScreen() {
  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am your AI Travel Assistant. How can I help you plan your perfect trip today?',
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('goa')) {
      return `Here's a perfect plan for Goa:\n\n🏖️ Day 1-2: North Goa\n• Baga Beach & water sports\n• Fort Aguada sunset\n• Night markets\n\n🌴 Day 3: South Goa\n• Palolem Beach\n• Cabo de Rama Fort\n\n💰 Budget: ₹15,000-25,000 per person\n\n🏨 Hotels: Recommend staying in Calangute or Candolim\n\n🍽️ Must-try: Thalassa for Greek food, Brittos for seafood`;
    }

    if (lowerMessage.includes('kerala')) {
      return `Kerala Backwaters Experience:\n\n🚤 Itinerary:\n• Day 1: Arrive Kochi, explore Fort Kochi\n• Day 2-3: Alleppey houseboat stay\n• Day 4: Munnar tea gardens\n• Day 5: Periyar wildlife sanctuary\n\n💰 Budget: ₹30,000-45,000 per person\n\n🏠 Accommodation: Houseboat + Hill resort\n\n🍛 Food: Traditional Kerala Sadhya is a must!`;
    }

    if (lowerMessage.includes('budget') || lowerMessage.includes('cheap')) {
      return `Budget Travel Tips:\n\n💡 Best Budget Destinations:\n1. Rishikesh - ₹8,000 for 3 days\n2. Hampi - ₹10,000 for 4 days\n3. Varanasi - ₹12,000 for 3 days\n\n💰 Money-saving tips:\n• Travel during off-season\n• Use local transport\n• Stay in hostels\n• Eat at local restaurants\n\nWould you like details on any specific destination?`;
    }

    if (lowerMessage.includes('restaurant') || lowerMessage.includes('food')) {
      return `Top Restaurants by City:\n\n🍽️ Delhi:\n• Karim's - Mughlai\n• Indian Accent - Fine Dining\n• Paranthe Wali Gali - Street Food\n\n🍛 Mumbai:\n• Britannia - Parsi\n• Trishna - Seafood\n• Cafe Mondegar - Continental\n\n🥘 Bangalore:\n• MTR - South Indian\n• Karavalli - Coastal\n• Truffles - Burgers\n\nWhich city are you interested in?`;
    }

    return `I'd be happy to help you plan your trip! I can assist with:\n\n✈️ Trip Planning\n🏨 Hotel Recommendations\n🍽️ Restaurant Suggestions\n💰 Budget Estimation\n🗺️ Itinerary Creation\n\nCould you tell me more about:\n• Where you'd like to go?\n• Your budget range?\n• Duration of trip?\n• Interests (adventure, culture, relaxation)?`;
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputText),
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, botResponse]);
      setLoading(false);
    }, 1000);
  };

  const handleSuggestion = (suggestion: string) => {
    setInputText(suggestion);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <Sparkles size={24} color={colors.primary} />
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.text }]}>
              AI Travel Assistant
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Online
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          {loading && (
            <ChatBubble
              message="Typing..."
              isUser={false}
            />
          )}

          {messages.length === 1 && (
            <View style={styles.suggestionsContainer}>
              <Text style={[styles.suggestionsTitle, { color: colors.textSecondary }]}>
                Suggested prompts:
              </Text>
              {chatSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.suggestionChip,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                  onPress={() => handleSuggestion(suggestion)}
                >
                  <Text style={[styles.suggestionText, { color: colors.text }]}>
                    {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        <View
          style={[
            styles.inputContainer,
            { backgroundColor: colors.background, borderTopColor: colors.border },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Ask me anything about travel..."
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: inputText.trim() ? colors.primary : colors.border },
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Send
              size={20}
              color={inputText.trim() ? '#FFFFFF' : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  suggestionChip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
