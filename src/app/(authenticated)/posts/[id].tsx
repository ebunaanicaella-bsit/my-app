import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, ImagePlus, Trash2, X } from "lucide-react-native";
import { useEffect, useState } from "react";
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

export default function PostDetail() {
  const { id } = useLocalSearchParams();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/${id}`);
        setName(data.name || "");
        setDescription(data.description || "");
        setImage(data.image || "");
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "Could not load post details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

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

  const handleUpdate = async () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert("Missing fields", "Title and description cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      await axios.put(`${API_URL}/${id}`, {
        name: name.trim(),
        description: description.trim(),
        image: image.trim(),
      });
      Alert.alert("Success", "Post updated successfully!");
      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not update the post.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setDeleting(true);
          try {
            await axios.delete(`${API_URL}/${id}`);
            router.back();
          } catch (error) {
            console.log(error);
            Alert.alert("Error", "Could not delete the post.");
            setDeleting(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color="#111827" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconBtn}
          hitSlop={10}
        >
          <ArrowLeft size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Post</Text>
        <TouchableOpacity
          onPress={handleDelete}
          style={[
            styles.iconBtn,
            { borderColor: "#FEE2E2", backgroundColor: "#FEF2F2" },
          ]}
          disabled={deleting}
          hitSlop={10}
        >
          {deleting ? (
            <ActivityIndicator size="small" color="#DC2626" />
          ) : (
            <Trash2 size={18} color="#DC2626" />
          )}
        </TouchableOpacity>
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
          {}
          <View style={styles.field}>
            <Text style={styles.label}>Photo</Text>

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

          {}
          <View style={styles.field}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              value={name}
              onChangeText={setName
              placeholder="Post title"
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
              placeholder="Post description"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              style={[styles.input, styles.textArea]}
            />
          </View>

          {/* Save Changes Button */}
          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.7 }]}
            activeOpacity={0.85}
            disabled={saving}
            onPress={handleUpdate}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveBtnText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
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
  iconBtn: {
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
  saveBtn: {
    backgroundColor: "#111827",
    borderRadius: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
