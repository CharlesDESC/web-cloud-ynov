import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Navbar } from "@/components/Navbar";
import { getPosts } from "@/services/firestore/posts";
import "@/firebaseConfig";

export default function HomeScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.header}>
        <Text style={styles.title}>Blog</Text>
        {user && (
          <Pressable style={styles.btnNew} onPress={() => router.push("/newpost")}>
            <Text style={styles.btnNewText}>+ Nouveau post</Text>
          </Pressable>
        )}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#4f9cf9" size="large" />
      ) : posts.length === 0 ? (
        <Text style={styles.empty}>Aucun post pour l'instant.</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => router.push(`/post/${item.id}`)}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMeta}>
                Par {item.createdBy} •{" "}
                {item.date?.toDate
                  ? item.date.toDate().toLocaleDateString("fr-FR")
                  : ""}
              </Text>
              <Text style={styles.cardExcerpt} numberOfLines={2}>
                {item.text}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#1a1a2e" },
  btnNew: {
    backgroundColor: "#4f9cf9",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnNewText: { color: "#fff", fontWeight: "bold" },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cardTitle: { fontSize: 17, fontWeight: "700", color: "#1a1a2e", marginBottom: 4 },
  cardMeta: { fontSize: 12, color: "#888", marginBottom: 8 },
  cardExcerpt: { fontSize: 14, color: "#555" },
  empty: { textAlign: "center", marginTop: 60, color: "#999", fontSize: 16 },
});
