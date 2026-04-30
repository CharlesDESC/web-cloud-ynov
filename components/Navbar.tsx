import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../firebaseConfig";

const LINKS = [
  { label: "Accueil", href: "/", requiresAuth: false },
  { label: "Connexion", href: "/login", requiresAuth: false },
  { label: "Profil", href: "/profile", requiresAuth: true },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return unsub;
  }, []);

  return (
    <View style={styles.nav}>
      {LINKS.map((link) => {
        const disabled = link.requiresAuth && !isLoggedIn;
        const isActive = pathname === link.href;
        return (
          <Pressable
            key={link.href}
            onPress={() => router.push(link.href as any)}
            style={[styles.link, isActive && styles.linkActive]}
            disabled={disabled}
          >
            <Text style={[styles.linkText, isActive && styles.textActive, disabled && styles.textDisabled]}>
              {link.label}
            </Text>
          </Pressable>
        );
      })}
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
  linkActive: {
    borderBottomColor: "#4f9cf9",
  },
  linkText: {
    color: "#aaa",
    fontSize: 14,
    fontWeight: "600",
  },
  textActive: {
    color: "#fff",
  },
  textDisabled: {
    color: "#444",
  },
});
