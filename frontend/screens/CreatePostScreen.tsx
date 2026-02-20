import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { CustomButton } from '@/components/CustomButton';
import { ArrowLeft, Camera, MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { postsAPI } from '@/services/api';

export default function CreatePostScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectImage = () => {
    const dummyImage =
      'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=800';
    setSelectedImage(dummyImage);
    Alert.alert('Info', 'In production, this would open image picker');
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image');
      return;
    }
    if (!caption.trim()) {
      Alert.alert('Error', 'Please enter a caption');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('location', location);

      await postsAPI.createPost(formData);
      Alert.alert('Success', 'Post created successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create post. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Create Post
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity
          style={[
            styles.imageSelector,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={handleSelectImage}
          activeOpacity={0.7}
        >
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Camera size={48} color={colors.textSecondary} />
              <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
                Tap to select image
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Caption</Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Write a caption..."
              placeholderTextColor={colors.textSecondary}
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={500}
            />
            <Text style={[styles.charCount, { color: colors.textSecondary }]}>
              {caption.length}/500
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Location</Text>
            <View
              style={[
                styles.locationInput,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <MapPin size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Add location"
                placeholderTextColor={colors.textSecondary}
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          <CustomButton
            title="Share Post"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </View>
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
    paddingTop: 48,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  imageSelector: {
    margin: 16,
    height: 400,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  form: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});
