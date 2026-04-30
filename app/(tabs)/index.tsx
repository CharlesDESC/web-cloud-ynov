import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Navbar } from "@/components/Navbar";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.content}>
        <Text style={styles.title}>Bienvenue</Text>
        <Text style={styles.subtitle}>Application Cloud & Authentification</Text>
        <Pressable style={styles.btn} onPress={() => router.push("/login")}>
          <Text style={styles.btnText}>Se connecter</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1a1a2e",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 48,
    textAlign: "center",
  },
  btn: {
    backgroundColor: "#4f9cf9",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
