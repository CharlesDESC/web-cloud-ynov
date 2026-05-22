import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Navbar } from "@/components/Navbar";
import { signup, signin } from "@/services/auth/password";
import { sendPhoneCode, verifyPhoneCode } from "@/services/auth/phone";
import { signinWithGithub } from "@/services/auth/github";
import { signinWithFacebook } from "@/services/auth/facebook";
import { signinAnonymously } from "@/services/auth/anonymous";

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <View style={[styles.toast, type === "success" ? styles.toastSuccess : styles.toastError]}>
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const onSuccess = (message = "Connexion réussie !") => {
    showToast(message, "success");
    setTimeout(() => router.replace("/profile"), 1000);
  };

  const validateEmailForm = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Format d'email invalide", "error");
      return false;
    }
    if (password.length < 6) {
      showToast("Le mot de passe doit contenir au moins 6 caractères", "error");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!name.trim()) { showToast("Entrez votre nom", "error"); return; }
    if (!validateEmailForm()) return;
    try {
      await signup(email, password, name);
      onSuccess("Compte créé avec succès !");
    } catch (e: any) {
      showToast(e.message || "Erreur lors de l'inscription", "error");
    }
  };

  const handleSignin = async () => {
    if (!validateEmailForm()) return;
    try {
      await signin(email, password);
      onSuccess();
    } catch (e: any) {
      showToast(e.message || "Erreur lors de la connexion", "error");
    }
  };

  const handleSendCode = async () => {
    if (!phoneNumber) { showToast("Entrez un numéro de téléphone", "error"); return; }
    try {
      const result = await sendPhoneCode(phoneNumber);
      setConfirmationResult(result);
      showToast("Code envoyé !", "success");
    } catch (e: any) {
      showToast(e.message || "Erreur lors de l'envoi du code", "error");
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) { showToast("Entrez le code reçu", "error"); return; }
    try {
      await verifyPhoneCode(confirmationResult, verificationCode);
      onSuccess();
    } catch (e: any) {
      showToast(e.message || "Code invalide", "error");
    }
  };

  const handleGithub = async () => {
    try {
      await signinWithGithub();
      onSuccess();
    } catch (e: any) {
      showToast(e.message || "Erreur connexion GitHub", "error");
    }
  };

  const handleFacebook = async () => {
    try {
      await signinWithFacebook();
      onSuccess();
    } catch (e: any) {
      showToast(e.message || "Erreur connexion Facebook", "error");
    }
  };

  const handleAnonymous = async () => {
    try {
      await signinAnonymously();
      onSuccess();
    } catch (e: any) {
      showToast(e.message || "Erreur connexion anonyme", "error");
    }
  };

  return (
    <View style={styles.container}>
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} />}
      {Platform.OS === "web" && <View nativeID="recaptcha-container" />}

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.toggle}>
          <Pressable
            style={[styles.toggleBtn, mode === "login" && styles.toggleActive]}
            onPress={() => setMode("login")}
          >
            <Text style={[styles.toggleText, mode === "login" && styles.toggleTextActive]}>
              Connexion
            </Text>
          </Pressable>
          <Pressable
            style={[styles.toggleBtn, mode === "register" && styles.toggleActive]}
            onPress={() => setMode("register")}
          >
            <Text style={[styles.toggleText, mode === "register" && styles.toggleTextActive]}>
              Inscription
            </Text>
          </Pressable>
        </View>

        {mode === "register" ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Créer un compte</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              onChangeText={setName}
              value={name}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              onChangeText={setPassword}
              value={password}
              secureTextEntry
            />
            <Pressable style={styles.btn} onPress={handleSignup}>
              <Text style={styles.btnText}>S'inscrire</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Email / Mot de passe</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
              />
              <Pressable style={styles.btn} onPress={handleSignin}>
                <Text style={styles.btnText}>Se connecter</Text>
              </Pressable>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Téléphone (OTP)</Text>
              <TextInput
                style={styles.input}
                placeholder="Numéro (+33...)"
                onChangeText={setPhoneNumber}
                value={phoneNumber}
                keyboardType="phone-pad"
              />
              <Pressable style={styles.btn} onPress={handleSendCode}>
                <Text style={styles.btnText}>Envoyer le code</Text>
              </Pressable>
              {confirmationResult && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Code de vérification"
                    onChangeText={setVerificationCode}
                    value={verificationCode}
                    keyboardType="number-pad"
                  />
                  <Pressable style={styles.btn} onPress={handleVerifyCode}>
                    <Text style={styles.btnText}>Vérifier le code</Text>
                  </Pressable>
                </>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Providers externes</Text>
              <Pressable style={[styles.btn, styles.btnGithub]} onPress={handleGithub}>
                <Text style={styles.btnText}>Se connecter avec GitHub</Text>
              </Pressable>
              <Pressable style={[styles.btn, styles.btnFacebook]} onPress={handleFacebook}>
                <Text style={styles.btnText}>Se connecter avec Facebook</Text>
              </Pressable>
              <Pressable style={[styles.btn, styles.btnAnonymous]} onPress={handleAnonymous}>
                <Text style={styles.btnText}>Continuer anonymement</Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scroll: { padding: 24, paddingBottom: 48 },
  toggle: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 28,
    alignSelf: "center",
  },
  toggleBtn: { paddingVertical: 10, paddingHorizontal: 36, borderRadius: 8 },
  toggleActive: { backgroundColor: "#4f9cf9" },
  toggleText: { fontWeight: "600", color: "#666" },
  toggleTextActive: { color: "#fff" },
  section: { marginBottom: 4 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1a1a2e",
    marginBottom: 12,
  },
  input: {
    height: 44,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#4f9cf9",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  btnGithub: { backgroundColor: "#24292e" },
  btnFacebook: { backgroundColor: "#1877f2" },
  btnAnonymous: { backgroundColor: "#888" },
  divider: { height: 1, backgroundColor: "#ddd", marginVertical: 20 },
  toast: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
    zIndex: 999,
  },
  toastSuccess: { backgroundColor: "#4CAF50" },
  toastError: { backgroundColor: "#f44336" },
  toastText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
