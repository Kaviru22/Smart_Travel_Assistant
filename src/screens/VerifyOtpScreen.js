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
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyOtpScreen({ route, navigation }) {
  const [email] = useState(route.params?.email || "");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // success | error
  const [loading, setLoading] = useState(false);

  async function onVerify() {
    setMsg("");
    setMsgType("");

    const cleanOtp = otp.trim();

    if (!email.trim()) {
      setMsg("Email is missing. Please go back and sign up again.");
      setMsgType("error");
      return;
    }

    if (!cleanOtp) {
      setMsg("Please enter the OTP code.");
      setMsgType("error");
      return;
    }

    if (cleanOtp.length < 4) {
      setMsg("Please enter a valid OTP.");
      setMsgType("error");
      return;
    }

    try {
      setLoading(true);

      await apiPost("/auth/verify", { email, otp: cleanOtp });

      setMsg("Account verified successfully. Redirecting to login...");
      setMsgType("success");

      setTimeout(() => {
        navigation.navigate("Login");
      }, 1000);
    } catch (e) {
      setMsg(e.message || "OTP verification failed.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <ImageBackground
        source={require("../../assets/sign-travel.jpg")}
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
                <Text style={styles.badge}>Account Verification</Text>

                <Text style={styles.title}>Smart Travel Assistant</Text>

                <Text style={styles.subtitle}>
                  Verify your email address to activate your account and begin your smart travel experience.
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Verify Account</Text>

                <Text style={styles.cardSubtitle}>
                  Enter the OTP sent to your registered email
                </Text>

                <Text style={styles.emailText}>OTP sent to: {email}</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>OTP Code</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter OTP"
                    placeholderTextColor="#94a3b8"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
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
                  onPress={onVerify}
                  activeOpacity={0.85}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryBtnText}>Verify Account</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => navigation.navigate("Login")}
                  activeOpacity={0.85}
                >
                  <Text style={styles.secondaryBtnText}>Back to Login</Text>
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
    backgroundColor: "rgba(15,23,42,0.60)",
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
    color: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 14,
    overflow: "hidden",
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 40,
    letterSpacing: 0.4,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 22,
    maxWidth: "95%",
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
    textAlign: "center",
    color: "#0f172a",
  },
  cardSubtitle: {
    textAlign: "center",
    marginTop: 6,
    marginBottom: 12,
    color: "#64748b",
    lineHeight: 20,
  },
  emailText: {
    textAlign: "center",
    color: "#334155",
    marginBottom: 18,
    fontWeight: "600",
    fontSize: 13,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontWeight: "700",
    marginBottom: 8,
    color: "#334155",
    marginLeft: 2,
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dbe4ee",
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 14,
    backgroundColor: "#f8fafc",
    fontSize: 15,
    color: "#0f172a",
  },
  messageBox: {
    marginBottom: 10,
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
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
  },
  successText: {
    color: "#15803d",
  },
  errorText: {
    color: "#dc2626",
  },
  primaryBtn: {
    marginTop: 10,
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.4,
  },
  secondaryBtn: {
    marginTop: 12,
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  secondaryBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  disabledBtn: {
    opacity: 0.7,
  },
});