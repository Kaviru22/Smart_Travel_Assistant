import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { apiPost } from "../api";
import { useAuth } from "../AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // success | error
  const [loading, setLoading] = useState(false);

  function isValidEmail(value) {
    return /\S+@\S+\.\S+/.test(value);
  }

  async function onLogin() {
    setMsg("");
    setMsgType("");

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setMsg("Please enter your email and password.");
      setMsgType("error");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setMsg("Please enter a valid email address.");
      setMsgType("error");
      return;
    }

    try {
      setLoading(true);

      const data = await apiPost("/auth/login", {
        email: cleanEmail,
        password: cleanPassword,
      });

      setMsg("Login successful. Welcome back!");
      setMsgType("success");

      setTimeout(async () => {
        await login(data.token);
      }, 900);
    } catch (e) {
      setMsg(e.message || "Invalid login. Please check your email and password.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <ImageBackground
        source={require("../../assets/login-travel.jpg")}
        style={styles.bg}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              contentContainerStyle={styles.scroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.hero}>
                <Text style={styles.badge}>Travel Smarter</Text>
                <Text style={styles.title}>Smart Travel Assistant</Text>
                <Text style={styles.subtitle}>
                  Discover routes, attractions, hotels, and better journeys in one place.
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Welcome Back</Text>
                <Text style={styles.cardSubtitle}>
                  Sign in to continue planning your next trip
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#94a3b8"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#94a3b8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>

                {!!msg && (
                  <View
                    style={[
                      styles.messageBox,
                      msgType === "success" ? styles.successBox : styles.errorBox,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        msgType === "success" ? styles.successText : styles.errorText,
                      ]}
                    >
                      {msg}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.primaryBtn, loading && styles.disabledBtn]}
                  onPress={onLogin}
                  activeOpacity={0.85}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryBtnText}>Login</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPassword")}
                  style={styles.secondaryBtn}
                  activeOpacity={0.85}
                >
                  <Text style={styles.secondaryBtnText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("Signup")}
                  style={styles.tertiaryBtn}
                  activeOpacity={0.85}
                >
                  <Text style={styles.tertiaryBtnText}>Create New Account</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  bg: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.58)",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
  },
  hero: {
    marginTop: 20,
    marginBottom: 30,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.18)",
    color: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "700",
    overflow: "hidden",
    marginBottom: 14,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: 40,
    letterSpacing: 0.4,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(255,255,255,0.9)",
    maxWidth: "92%",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.97)",
    borderRadius: 28,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 22,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
    marginLeft: 2,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#dbe4ee",
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0f172a",
  },
  messageBox: {
    marginTop: 6,
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  successBox: {
    backgroundColor: "#ecfdf3",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  messageText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  successText: {
    color: "#15803d",
  },
  errorText: {
    color: "#dc2626",
  },
  primaryBtn: {
    marginTop: 10,
    backgroundColor: "#ef4444",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },
  disabledBtn: {
    opacity: 0.75,
  },
  primaryBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  secondaryBtn: {
    marginTop: 14,
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  secondaryBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  tertiaryBtn: {
    marginTop: 12,
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  tertiaryBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});