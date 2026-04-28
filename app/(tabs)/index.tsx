import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Platform } from "react-native";
import { signup } from "../../auth_signup_password";
import { signin } from "../../auth_signin_password";
import { sendPhoneCode, verifyPhoneCode } from "../../auth_phone";
import { signinWithGithub } from "../../auth_github_signin_popup";

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <View style={[styles.toast, type === "success" ? styles.toastSuccess : styles.toastError]}>
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
}

export default function HomeScreen() {
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

  // 1. Validation
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
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
    if (!validateForm()) return;
    try {
      await signup(email, password);
      showToast("Compte créé avec succès !", "success");
    } catch (error: any) {
      showToast(error.message || "Erreur lors de l'inscription", "error");
    }
  };

  const handleSignin = async () => {
    if (!validateForm()) return;
    try {
      await signin(email, password);
      showToast("Connexion réussie !", "success");
    } catch (error: any) {
      showToast(error.message || "Erreur lors de la connexion", "error");
    }
  };

  // 3. Phone auth
  const handleSendCode = async () => {
    if (!phoneNumber) {
      showToast("Entrez un numéro de téléphone", "error");
      return;
    }
    try {
      const result = await sendPhoneCode(phoneNumber);
      setConfirmationResult(result);
      showToast("Code envoyé !", "success");
    } catch (error: any) {
      showToast(error.message || "Erreur lors de l'envoi du code", "error");
    }
  };

  const handleGithubSignin = async () => {
    try {
      await signinWithGithub();
      showToast("Connexion GitHub réussie !", "success");
    } catch (error: any) {
      showToast(error.message || "Erreur lors de la connexion GitHub", "error");
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      showToast("Entrez le code reçu", "error");
      return;
    }
    try {
      await verifyPhoneCode(confirmationResult, verificationCode);
      showToast("Connexion par téléphone réussie !", "success");
    } catch (error: any) {
      showToast(error.message || "Code invalide", "error");
    }
  };

  return (
    <View style={styles.container}>
      {/* 2. Toaster */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Recaptcha container (web uniquement) */}
      {Platform.OS === "web" && <View nativeID="recaptcha-container" />}

      <Text style={styles.title}>Email / Mot de passe</Text>

      <Text>Email</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text>Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
      />
      <Button title="Sign Up!" onPress={handleSignup} />
      <Button title="Sign In!" onPress={handleSignin} />

      <View style={styles.separator} />

      <Text style={styles.title}>Providers externes</Text>
      <Button title="Se connecter avec GitHub" onPress={handleGithubSignin} />

      <View style={styles.separator} />

      <Text style={styles.title}>Téléphone</Text>

      <Text>Numéro de téléphone (+33...)</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPhoneNumber}
        value={phoneNumber}
        keyboardType="phone-pad"
      />
      <Button title="Envoyer le code" onPress={handleSendCode} />

      {confirmationResult && (
        <>
          <Text>Code de vérification</Text>
          <TextInput
            style={styles.input}
            onChangeText={setVerificationCode}
            value={verificationCode}
            keyboardType="number-pad"
          />
          <Button title="Vérifier le code" onPress={handleVerifyCode} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: 250,
    margin: 8,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
  toast: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
    zIndex: 999,
  },
  toastSuccess: {
    backgroundColor: "#4CAF50",
  },
  toastError: {
    backgroundColor: "#f44336",
  },
  toastText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
