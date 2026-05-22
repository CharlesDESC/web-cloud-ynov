import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Navbar } from "@/components/Navbar";
import { getComments } from "@/services/firestore/comments";
import "@/firebaseConfig";

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  useEffect(() => {
    if (!id) return;
    const db = getFirestore();
    Promise.all([
      getDoc(doc(db, "posts", id)),
      getComments(id),
    ]).then(([postSnap, commentsData]) => {
      if (postSnap.exists()) {
        setPost({ id: postSnap.id, ...postSnap.data() });
      }
      setComments(commentsData);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4f9cf9" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.centered}>
        <Text>Post introuvable.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Retour</Text>
        </Pressable>

        {/* Post */}
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.meta}>
          Par {post.createdBy} •{" "}
          {post.date?.toDate
            ? post.date.toDate().toLocaleDateString("fr-FR")
            : ""}
        </Text>
        <Text style={styles.body}>{post.text}</Text>

        {/* Commentaires */}
        <View style={styles.commentsHeader}>
          <Text style={styles.commentsTitle}>
            Commentaires ({comments.length})
          </Text>
          {user && (
            <Pressable
              style={styles.btnComment}
              onPress={() => router.push(`/post/new-comment?postId=${id}`)}
            >
              <Text style={styles.btnCommentText}>+ Commenter</Text>
            </Pressable>
          )}
        </View>

        {comments.length === 0 ? (
          <Text style={styles.noComments}>Aucun commentaire pour l'instant.</Text>
        ) : (
          comments.map((c) => (
            <View key={c.id} style={styles.commentCard}>
              <Text style={styles.commentAuthor}>{c.authorName}</Text>
              <Text style={styles.commentText}>{c.text}</Text>
              <Text style={styles.commentDate}>
                {c.date?.toDate
                  ? c.date.toDate().toLocaleDateString("fr-FR")
                  : ""}
              </Text>
            </View>
          ))
        )}

        {!user && (
          <Text style={styles.loginHint}>
            <Text style={styles.loginLink} onPress={() => router.push("/login")}>
              Connectez-vous
            </Text>{" "}
            pour laisser un commentaire.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { padding: 20, paddingBottom: 60 },
  back: { marginBottom: 16 },
  backText: { color: "#4f9cf9", fontSize: 15 },
  title: { fontSize: 26, fontWeight: "bold", color: "#1a1a2e", marginBottom: 6 },
  meta: { fontSize: 13, color: "#888", marginBottom: 20 },
  body: { fontSize: 16, color: "#333", lineHeight: 26, marginBottom: 32 },
  commentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 20,
  },
  commentsTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a2e" },
  btnComment: {
    backgroundColor: "#4f9cf9",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  btnCommentText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  noComments: { color: "#999", fontStyle: "italic", textAlign: "center", marginTop: 12 },
  commentCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  commentAuthor: { fontWeight: "700", color: "#1a1a2e", marginBottom: 4 },
  commentText: { fontSize: 14, color: "#444", marginBottom: 6 },
  commentDate: { fontSize: 11, color: "#aaa" },
  loginHint: { textAlign: "center", marginTop: 20, color: "#888" },
  loginLink: { color: "#4f9cf9", fontWeight: "600" },
});
