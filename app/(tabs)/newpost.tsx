import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Navbar } from "@/components/Navbar";
import { createPost } from "@/services/firestore/posts";
import "@/firebaseConfig";

export default function NewPostScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.replace("/login");
      else setUser(u);
    });
    return unsub;
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !text.trim()) {
      Alert.alert("Erreur", "Le titre et le contenu sont obligatoires.");
      return;
    }
    setLoading(true);
    try {
      const authorName =
        user.displayName ?? user.email ?? "Anonyme";
      await createPost(title.trim(), text.trim(), authorName);
      Alert.alert("Succès", "Post publié !", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    } catch (e: any) {
      Alert.alert("Erreur", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Nouveau post</Text>
        <TextInput
          style={styles.input}
          placeholder="Titre"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Contenu..."
          value={text}
          onChangeText={setText}
          multiline
          numberOfLines={8}
          placeholderTextColor="#aaa"
          textAlignVertical="top"
        />
        <Pressable
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Publier</Text>
          )}
        </Pressable>
        <Pressable style={styles.btnCancel} onPress={() => router.back()}>
          <Text style={styles.btnCancelText}>Annuler</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { padding: 24 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1a1a2e", marginBottom: 24 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#1a1a2e",
    marginBottom: 16,
  },
  textarea: { height: 180 },
  btn: {
    backgroundColor: "#4f9cf9",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  btnCancel: { alignItems: "center", paddingVertical: 10 },
  btnCancelText: { color: "#888", fontSize: 15 },
});
