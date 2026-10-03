import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { apiGet, apiPut } from "../api";
import { useAuth } from "../AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { token, logout } = useAuth();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [updatingName, setUpdatingName] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  async function load() {
    setMsg("");
    setMsgType("");

    try {
      setLoadingProfile(true);
      const data = await apiGet("/user/me", token);
      setUser(data.user);
      setName(data.user?.name || "");
    } catch (e) {
      setMsg(e.message || "Failed to load user details.");
      setMsgType("error");
    } finally {
      setLoadingProfile(false);
    }
  }

  async function onUpdateName() {
    setMsg("");
    setMsgType("");

    const cleanName = name.trim();

    if (!cleanName) {
      setMsg("Please enter your name.");
      setMsgType("error");
      return;
    }

    if (cleanName.length < 3) {
      setMsg("Name must be at least 3 characters.");
      setMsgType("error");
      return;
    }

    try {
      setUpdatingName(true);
      await apiPut("/user/me", { name: cleanName }, token);
      setMsg("Name updated successfully.");
      setMsgType("success");
      await load();
    } catch (e) {
      setMsg(e.message || "Failed to update name.");
      setMsgType("error");
    } finally {
      setUpdatingName(false);
    }
  }

  async function onChangePassword() {
    setMsg("");
    setMsgType("");

    const cleanOldPassword = oldPassword.trim();
    const cleanNewPassword = newPassword.trim();

    if (!cleanOldPassword || !cleanNewPassword) {
      setMsg("Please enter both old and new password.");
      setMsgType("error");
      return;
    }

    if (cleanNewPassword.length < 6) {
      setMsg("New password must be at least 6 characters.");
      setMsgType("error");
      return;
    }

    try {
      setChangingPassword(true);
      await apiPut(
        "/user/change-password",
        { oldPassword: cleanOldPassword, newPassword: cleanNewPassword },
        token
      );
      setOldPassword("");
      setNewPassword("");
      setMsg("Password changed successfully.");
      setMsgType("success");
    } catch (e) {
      setMsg(e.message || "Failed to change password.");
      setMsgType("error");
    } finally {
      setChangingPassword(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={require("../../assets/setting-travel.jpg")}
          style={styles.hero}
          imageStyle={styles.heroImage}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.heroBadge}>Account Settings</Text>
            <Text style={styles.heroTitle}>Profile & Security</Text>
            <Text style={styles.heroSubtitle}>
              Manage your account details, password, and session securely
            </Text>
          </View>
        </ImageBackground>

        {loadingProfile ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Loading account details...</Text>
          </View>
        ) : (
          <>
            {user && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Account Information</Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>{user.name}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{user.email}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Verified</Text>
                  <Text style={styles.infoValue}>
                    {user.isVerified ? "Yes" : "No"}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Update Name</Text>

              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
              />

              <TouchableOpacity
                style={[styles.primaryBtn, updatingName && styles.disabledBtn]}
                onPress={onUpdateName}
                activeOpacity={0.85}
                disabled={updatingName}
              >
                {updatingName ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Update Name</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Change Password</Text>

              <Text style={styles.label}>Old Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter old password"
                placeholderTextColor="#94a3b8"
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry
              />

              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor="#94a3b8"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />

              <TouchableOpacity
                style={[styles.secondaryBtn, changingPassword && styles.disabledBtn]}
                onPress={onChangePassword}
                activeOpacity={0.85}
                disabled={changingPassword}
              >
                {changingPassword ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Change Password</Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={logout}
              activeOpacity={0.85}
            >
              <Text style={styles.btnText}>Logout</Text>
            </TouchableOpacity>

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
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#eef4f8",
  },
  container: {
    flex: 1,
    backgroundColor: "#eef4f8",
  },
  contentContainer: {
    paddingBottom: 110,
  },
  hero: {
    height: 210,
    justifyContent: "flex-end",
  },
  heroImage: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroOverlay: {
    backgroundColor: "rgba(15,23,42,0.45)",
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.18)",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 10,
    overflow: "hidden",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 30,
  },
  heroSubtitle: {
    marginTop: 6,
    color: "rgba(255,255,255,0.92)",
    fontSize: 13,
    lineHeight: 18,
  },
  loadingWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  loadingText: {
    marginTop: 10,
    color: "#475569",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 16,
    marginHorizontal: 14,
    marginTop: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  infoLabel: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  infoValue: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "700",
    flexShrink: 1,
    textAlign: "right",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
    marginTop: 6,
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
  primaryBtn: {
    marginTop: 18,
    backgroundColor: "#16a34a",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },
  secondaryBtn: {
    marginTop: 18,
    backgroundColor: "#2563eb",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },
  logoutBtn: {
    marginHorizontal: 14,
    marginTop: 16,
    backgroundColor: "#dc2626",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  messageBox: {
    marginHorizontal: 14,
    marginTop: 14,
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
});