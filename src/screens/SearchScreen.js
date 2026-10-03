import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { apiPost } from "../api";
import { useAuth } from "../AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORIES = [
  { id: 1, name: "Religious" },
  { id: 2, name: "Beach" },
  { id: 3, name: "Wildlife" },
  { id: 4, name: "Adventure" },
  { id: 5, name: "Historical" },
  { id: 6, name: "Cultural" },
  { id: 7, name: "Other" },
];

export default function SearchScreen({ navigation }) {
  const { token } = useAuth();

  const [startName, setStartName] = useState("Colombo");
  const [endName, setEndName] = useState("Galle");
  const [budgetLkr, setBudgetLkr] = useState("30000");
  const [days, setDays] = useState("2");
  const [preferredCategoryIds, setPreferredCategoryIds] = useState([1]);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [loading, setLoading] = useState(false);

  function toggleCategory(id) {
    setPreferredCategoryIds((prev) => {
      if (prev.includes(id)) {
        const updated = prev.filter((item) => item !== id);
        return updated.length > 0 ? updated : [1];
      }
      return [...prev, id];
    });
  }

  function getSelectedCategoryNames() {
    return preferredCategoryIds
      .map((id) => CATEGORIES.find((c) => c.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  }

  async function onGenerate() {
    setMsg("");
    setMsgType("");

    if (!startName.trim() || !endName.trim()) {
      setMsg("Please enter both start and destination locations.");
      setMsgType("error");
      return;
    }

    if (!budgetLkr.trim() || Number(budgetLkr) <= 0) {
      setMsg("Please enter a valid budget.");
      setMsgType("error");
      return;
    }

    if (!days.trim() || Number(days) <= 0) {
      setMsg("Please enter a valid number of days.");
      setMsgType("error");
      return;
    }

    try {
      setLoading(true);

      const data = await apiPost(
        "/plan/generate",
        {
          startName: startName.trim(),
          endName: endName.trim(),
          budgetLkr: Number(budgetLkr),
          days: Number(days),
          preferredCategoryIds,
        },
        token
      );

      navigation.navigate("Results", { result: data });
    } catch (e) {
      setMsg(e.message || "Failed to generate travel plan.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={require("../../assets/search-travel.jpg")}
          style={styles.hero}
          imageStyle={styles.heroImage}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.badge}>Smart Trip Planner</Text>
            <Text style={styles.heroTitle}>Smart Travel Assistant</Text>
            <Text style={styles.heroSubtitle}>
              Create personalized travel plans across Sri Lanka.
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Plan Your Journey</Text>
          <Text style={styles.formSubtitle}>
            Enter your travel details and generate a smart itinerary
          </Text>

          <Text style={styles.label}>Start Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter start location"
            placeholderTextColor="#94a3b8"
            value={startName}
            onChangeText={setStartName}
          />

          <Text style={styles.label}>Destination</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter destination"
            placeholderTextColor="#94a3b8"
            value={endName}
            onChangeText={setEndName}
          />

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>Budget (LKR)</Text>
              <TextInput
                style={styles.input}
                placeholder="30000"
                placeholderTextColor="#94a3b8"
                value={budgetLkr}
                onChangeText={setBudgetLkr}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.half}>
              <Text style={styles.label}>Days</Text>
              <TextInput
                style={styles.input}
                placeholder="2"
                placeholderTextColor="#94a3b8"
                value={days}
                onChangeText={setDays}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.label}>Preferred Categories</Text>
          <TouchableOpacity
            style={styles.dropdownBtn}
            onPress={() => setShowCategories(!showCategories)}
            activeOpacity={0.85}
          >
            <Text style={styles.dropdownText}>
              {getSelectedCategoryNames() || "Select category"}
            </Text>
            <Text style={styles.dropdownArrow}>{showCategories ? "▲" : "▼"}</Text>
          </TouchableOpacity>

          {showCategories && (
            <View style={styles.categoryBox}>
              {CATEGORIES.map((cat) => {
                const selected = preferredCategoryIds.includes(cat.id);
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryChip,
                      selected && styles.categoryChipActive,
                    ]}
                    onPress={() => toggleCategory(cat.id)}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        selected && styles.categoryChipTextActive,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

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
            onPress={onGenerate}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Generate Travel Plan</Text>
            )}
          </TouchableOpacity>
        </View>
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
    height: 190,
    justifyContent: "flex-end",
  },
  heroImage: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroOverlay: {
    backgroundColor: "rgba(15,23,42,0.38)",
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.22)",
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
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 28,
  },
  heroSubtitle: {
    marginTop: 6,
    color: "rgba(255,255,255,0.95)",
    fontSize: 13,
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 14,
    marginTop: -12,
    borderRadius: 22,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 5,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
  },
  formSubtitle: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 16,
    lineHeight: 18,
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
    paddingVertical: 13,
    fontSize: 15,
    color: "#0f172a",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  half: {
    flex: 1,
  },
  dropdownBtn: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#dbe4ee",
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginTop: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    color: "#0f172a",
    fontSize: 15,
    flex: 1,
    marginRight: 8,
  },
  dropdownArrow: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "700",
  },
  categoryBox: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#f8fafc",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  categoryChip: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#e2e8f0",
    marginRight: 8,
    marginBottom: 8,
  },
  categoryChipActive: {
    backgroundColor: "#2563eb",
  },
  categoryChipText: {
    color: "#334155",
    fontWeight: "700",
    fontSize: 13,
  },
  categoryChipTextActive: {
    color: "#fff",
  },
  messageBox: {
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
  primaryBtn: {
    marginTop: 18,
    backgroundColor: "#16a34a",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.4,
  },
  disabledBtn: {
    opacity: 0.7,
  },
});