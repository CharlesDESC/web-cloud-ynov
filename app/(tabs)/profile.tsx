import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Navbar } from "@/components/Navbar";
import "../../firebaseConfig";

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (!user) router.replace("/login");
    });
    return unsub;
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.replace("/login");
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
      <View style={styles.content}>
        <Text style={styles.text}>Ici s'affichera prochainement votre profil</Text>
        <Pressable style={styles.btn} onPress={handleLogout}>
          <Text style={styles.btnText}>Se déconnecter</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  text: {
    fontSize: 18,
    color: "#1a1a2e",
    marginBottom: 48,
    textAlign: "center",
  },
  btn: {
    backgroundColor: "#e53935",
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
