import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { ArrowLeft, ImagePlus, X } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL =
  "https://6af3f9fe55a1de7dcf03745a.mockapi.io/api/products/items";

export default function CreatePost() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 10],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert("Missing fields", "Please add a title and description.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(API_URL, {
        name: name.trim(),
        description: description.trim(),
        image: image.trim(),
      });
      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not publish your post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={10}
        >
          <ArrowLeft size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Image Picker / Preview */}
          <View style={styles.field}>
            <Text style={styles.label}>Photo (Optional)</Text>

            {image ? (
              <View style={styles.previewWrap}>
                <Image source={{ uri: image }} style={styles.previewImg} />
                <TouchableOpacity
                  style={styles.removeImgBtn}
                  onPress={() => setImage("")}
                >
                  <X size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadBox}
                activeOpacity={0.8}
                onPress={pickImage}
              >
                <ImagePlus size={22} color="#6B7280" />
                <Text style={styles.uploadText}>Choose from gallery</Text>
              </TouchableOpacity>
            )}

            <TextInput
              value={image}
              onChangeText={setImage}
              placeholder="Or paste an image URL..."
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              style={[styles.input, { marginTop: 8 }]}
            />
          </View>

          {/* Title Input */}
          <View style={styles.field}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="What's this about?"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          {/* Description Input */}
          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Share your thoughts..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              style={[styles.input, styles.textArea]}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
            activeOpacity={0.85}
            disabled={submitting}
            onPress={handleSubmit}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>Publish Post</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  content: {
    padding: 20,
    gap: 18,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  uploadBox: {
    height: 130,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  previewWrap: {
    position: "relative",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  previewImg: {
    width: "100%",
    height: 180,
    backgroundColor: "#F3F4F6",
  },
  removeImgBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(17, 24, 39, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    color: "#111827",
  },
  textArea: {
    height: 110,
    paddingTop: 12,
    paddingBottom: 12,
  },
  submitBtn: {
    backgroundColor: "#111827",
    borderRadius: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
