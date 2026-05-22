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
import { useRouter, useLocalSearchParams } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Navbar } from "@/components/Navbar";
import { addComment } from "@/services/firestore/comments";
import "@/firebaseConfig";

export default function NewCommentScreen() {
  const router = useRouter();
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const [user, setUser] = useState<any>(null);
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
    if (!text.trim()) {
      Alert.alert("Erreur", "Le commentaire ne peut pas être vide.");
      return;
    }
    if (!postId) return;
    setLoading(true);
    try {
      const authorName = user.displayName ?? user.email ?? "Anonyme";
      await addComment(postId, text.trim(), authorName, user.uid);
      router.replace(`/post/${postId}`);
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
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Retour</Text>
        </Pressable>
        <Text style={styles.title}>Nouveau commentaire</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Écrivez votre commentaire..."
          value={text}
          onChangeText={setText}
          multiline
          numberOfLines={6}
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
            <Text style={styles.btnText}>Publier le commentaire</Text>
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
  back: { marginBottom: 16 },
  backText: { color: "#4f9cf9", fontSize: 15 },
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
  textarea: { height: 160 },
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
