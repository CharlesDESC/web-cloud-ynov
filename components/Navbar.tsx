import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";

const LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Connexion", href: "/login" },
  { label: "Profil", href: "/profile" },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.nav}>
      {LINKS.map((link) => (
        <Pressable
          key={link.href}
          onPress={() => router.push(link.href as any)}
          style={styles.link}
        >
          <Text style={[styles.linkText, pathname === link.href && styles.active]}>
            {link.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    paddingVertical: 14,
  },
  link: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  linkText: {
    color: "#aaa",
    fontSize: 14,
    fontWeight: "600",
  },
  active: {
    color: "#fff",
    borderBottomColor: "#4f9cf9",
  },
});
