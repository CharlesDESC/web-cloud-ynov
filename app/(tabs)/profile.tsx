import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { uploadProfilePhoto } from "@/services/storage/upload";
import { Navbar } from "@/components/Navbar";
import "@/firebaseConfig";

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setLoading(false);
      if (!u) router.replace("/login");
      else {
        setUser(u);
        setDisplayName(u.displayName ?? "");
        setPhotoURL(u.photoURL ?? "");
      }
    });
    return unsub;
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission refusée", "L'accès à la galerie est nécessaire.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (result.canceled) return;
    setUploading(true);
    try {
      const downloadUrl = await uploadProfilePhoto(result.assets[0].uri);
      setUser((prev: any) => ({ ...prev, photoURL: downloadUrl }));
      setPhotoURL(downloadUrl);
      Alert.alert("Succès", "Photo de profil mise à jour !");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    const auth = getAuth();
    if (!auth.currentUser) return;
    setUpdating(true);
    try {
      await updateProfile(auth.currentUser, { displayName, photoURL });
      setUser({ ...auth.currentUser });
      Alert.alert("Succès", "Profil mis à jour !");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4f9cf9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Photo de profil */}
        <Pressable onPress={pickImage} disabled={uploading}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {user?.displayName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?"}
              </Text>
            </View>
          )}
          <View style={styles.avatarOverlay}>
            {uploading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.avatarOverlayText}>Modifier</Text>
            )}
          </View>
        </Pressable>

        <Text style={styles.title}>Mon Profil</Text>

        {/* Informations utilisateur */}
        <View style={styles.card}>
          <InfoRow label="UID" value={user?.uid} />
          <InfoRow label="Nom" value={user?.displayName ?? "—"} />
          <InfoRow label="Email" value={user?.isAnonymous ? "Anonyme" : user?.email} />
          <InfoRow label="Email vérifié" value={user?.emailVerified ? "Oui" : "Non"} />
          {user?.isAnonymous && <InfoRow label="Statut" value="Connecté anonymement" />}
        </View>

        {/* Infos provider */}
        {user?.providerData?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Providers</Text>
            {user.providerData.map((profile: any, i: number) => (
              <View key={i} style={styles.providerBlock}>
                <InfoRow label="Provider" value={profile.providerId} />
                <InfoRow label="UID provider" value={profile.uid} />
                {profile.displayName && <InfoRow label="Nom" value={profile.displayName} />}
                {profile.email && <InfoRow label="Email" value={profile.email} />}
              </View>
            ))}
          </View>
        )}

        {/* Formulaire de mise à jour */}
        {!user?.isAnonymous && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Modifier le profil</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom d'affichage"
              value={displayName}
              onChangeText={setDisplayName}
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              placeholder="URL de la photo"
              value={photoURL}
              onChangeText={setPhotoURL}
              placeholderTextColor="#aaa"
              autoCapitalize="none"
            />
            <Pressable
              style={[styles.btnUpdate, updating && styles.btnDisabled]}
              onPress={handleUpdateProfile}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Mettre à jour</Text>
              )}
            </Pressable>
          </View>
        )}

        <Pressable style={styles.btnLogout} onPress={handleLogout}>
          <Text style={styles.btnText}>Se déconnecter</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string | undefined }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label} :</Text>
      <Text style={styles.rowValue} numberOfLines={1} ellipsizeMode="middle">
        {value ?? "—"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { alignItems: "center", padding: 24, paddingBottom: 48 },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#4f9cf9",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: { fontSize: 36, color: "#fff", fontWeight: "bold" },
  avatarOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    alignItems: "center",
    paddingVertical: 4,
    marginBottom: 12,
  },
  avatarOverlayText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  title: { fontSize: 22, fontWeight: "bold", color: "#1a1a2e", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    width: "100%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cardTitle: { fontSize: 14, fontWeight: "700", color: "#4f9cf9", marginBottom: 10 },
  row: { flexDirection: "row", marginBottom: 6 },
  rowLabel: { width: 120, fontSize: 14, color: "#888", fontWeight: "600" },
  rowValue: { flex: 1, fontSize: 14, color: "#1a1a2e" },
  providerBlock: { borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 8, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    fontSize: 15,
    color: "#1a1a2e",
    backgroundColor: "#fafafa",
  },
  btnUpdate: {
    backgroundColor: "#4f9cf9",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnDisabled: { opacity: 0.6 },
  btnLogout: {
    backgroundColor: "#e53935",
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
    width: "100%",
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
