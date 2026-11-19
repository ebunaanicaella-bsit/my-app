import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import { Camera, LogOut, Pencil, User } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const STORAGE_KEY = "profile";

type ProfileType = {
  name: string;
  username: string;
  bio: string;
  photo: string | null;
};

export default function Profile() {
  const [profile, setProfile] = useState<ProfileType>({
    name: "Your Name",
    username: "username",
    bio: "short info about you...",
    photo: null,
  });
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftUsername, setDraftUsername] = useState("");
  const [draftBio, setDraftBio] = useState("");
  const [draftPhoto, setDraftPhoto] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(STORAGE_KEY)
        .then((raw: string | null) => {
          if (raw) {
            const parsed = JSON.parse(raw);
            setProfile({
              name: parsed.name || "Your Name",
              username: parsed.username || "@username",
              bio: parsed.bio || "short info about you...",
              photo: parsed.photo || null,
            });
          }
        })
        .catch((error: unknown) => console.log(error));
    }, []),
  );

  const openEdit = () => {
    setDraftName(profile.name);
    setDraftUsername(profile.username);
    setDraftBio(profile.bio);
    setDraftPhoto(profile.photo);
    setEditing(true);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setDraftPhoto(result.assets[0].uri);
    }
  };

  const save = async () => {
    if (!draftName.trim()) {
      Alert.alert("Missing name", "Please enter your name.");
      return;
    }

    const updated: ProfileType = {
      name: draftName.trim(),
      username: draftUsername.trim() || "username",
      bio: draftBio.trim(),
      photo: draftPhoto,
    };

    setProfile(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setEditing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <TouchableOpacity
            onPress={openEdit}
            activeOpacity={0.85}
            style={styles.avatarWrap}
          >
            {profile.photo ? (
              <Image source={{ uri: profile.photo }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={38} color="#6B7280" />
              </View>
            )}
            <View style={styles.cameraDot}>
              <Camera size={13} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.username}>{profile.username}</Text>
          <Text style={styles.bio}>{profile.bio}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            activeOpacity={0.85}
            onPress={openEdit}
          >
            <Pencil size={16} color="#111827" />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutBtn}
            activeOpacity={0.85}
            onPress={() => router.replace("/login" as any)}
          >
            <LogOut size={16} color="#DC2626" />
            <Text style={styles.logoutBtnText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={editing} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TouchableOpacity onPress={pickImage} style={styles.modalAvatarBtn}>
              {draftPhoto ? (
                <Image
                  source={{ uri: draftPhoto }}
                  style={styles.modalAvatar}
                />
              ) : (
                <View style={styles.modalAvatarPlaceholder}>
                  <Camera size={22} color="#6B7280" />
                </View>
              )}
              <Text style={styles.changePhotoText}>Change photo</Text>
            </TouchableOpacity>

            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                value={draftName}
                onChangeText={setDraftName}
                placeholder="Your Name"
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                value={draftUsername}
                onChangeText={setDraftUsername}
                placeholder="@username"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                value={draftBio}
                onChangeText={setDraftBio}
                placeholder="A short line about you..."
                style={styles.input}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditing(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={save}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.4,
  },
  content: {
    padding: 24,
  },
  profileSection: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  avatarWrap: { position: "relative" },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F3F4F6",
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginTop: 14,
  },
  username: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F46E5",
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
  },
  actions: {
    marginTop: 16,
    gap: 10,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    height: 48,
    borderRadius: 12,
  },
  editBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FEE2E2",
    height: 48,
    borderRadius: 12,
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#DC2626",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.4)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  modalAvatarBtn: {
    alignItems: "center",
    marginVertical: 16,
  },
  modalAvatar: { width: 76, height: 76, borderRadius: 38 },
  modalAvatarPlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  changePhotoText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4F46E5",
    marginTop: 6,
  },
  field: { marginTop: 12, gap: 6 },
  label: { fontSize: 13, fontWeight: "600", color: "#374151" },
  input: {
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 15,
    color: "#111827",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { fontSize: 14, fontWeight: "600", color: "#4B5563" },
  saveBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: { fontSize: 14, fontWeight: "600", color: "#FFFFFF" },
});
