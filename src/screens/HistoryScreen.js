import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
  ActivityIndicator
} from "react-native";
import { apiGet } from "../api";
import { useAuth } from "../AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen({ navigation }) {
  const { token } = useAuth();
  const [plans, setPlans] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setMsg("");
    try {
      setLoading(true);
      const data = await apiGet("/plan/history", token);
      setPlans(data.plans || []);
    } catch (e) {
      setMsg(e.message || "Failed to load plans.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function formatMoney(value) {
    return `Rs. ${Number(value || 0).toLocaleString()}`;
  }

  function formatDate(date) {
    try {
      return new Date(date).toLocaleString();
    } catch {
      return "-";
    }
  }

  const renderPlan = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("PlanDetails", { plan: item })}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardBadge}>
          <Text style={styles.cardBadgeText}>{index + 1}</Text>
        </View>

        <View style={styles.cardHeaderText}>
          <Text style={styles.title}>
            {item.startName} → {item.endName}
          </Text>
          <Text style={styles.date}>
            Saved: {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Budget</Text>
        <Text style={styles.metaValue}>{formatMoney(item.budgetLkr)}</Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Days</Text>
        <Text style={styles.metaValue}>{item.days}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <FlatList
        data={plans}
        keyExtractor={(item, index) => item._id || String(index)}
        renderItem={renderPlan}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <ImageBackground
              source={require("../../assets/history-travel.jpg")}
              style={styles.hero}
              imageStyle={styles.heroImage}
              resizeMode="cover"
            >
              <View style={styles.heroOverlay}>
                <Text style={styles.heroBadge}>Your Travel History</Text>
                <Text style={styles.heroTitle}>Saved Trip Plans</Text>
                <Text style={styles.heroSubtitle}>
                  View and reopen your previously generated travel itineraries
                </Text>
              </View>
            </ImageBackground>

            {msg ? (
              <Text style={styles.err}>{msg}</Text>
            ) : null}

            {loading && (
              <View style={styles.loadingWrap}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.loadingText}>Loading plans...</Text>
              </View>
            )}

            {!loading && plans.length === 0 && (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No saved plans yet</Text>
              </View>
            )}
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#eef4f8",
  },

  listContent: {
    paddingBottom: 30,
    backgroundColor: "#eef4f8",
  },

  hero: {
    height: 250,
    justifyContent: "flex-end",
  },

  heroImage: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  heroOverlay: {
    backgroundColor: "rgba(15,23,42,0.45)",
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.18)",
    color: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 12,
  },

  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },

  heroSubtitle: {
    marginTop: 8,
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  cardBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  cardBadgeText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },

  cardHeaderText: {
    flex: 1,
  },

  title: {
    fontWeight: "800",
    fontSize: 16,
    color: "#0f172a",
  },

  date: {
    marginTop: 3,
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },

  metaLabel: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "600",
  },

  metaValue: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "700",
  },

  err: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },

  loadingWrap: {
    alignItems: "center",
    paddingVertical: 20,
  },

  loadingText: {
    marginTop: 10,
    color: "#475569",
    fontWeight: "600",
  },

  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: "center",
  },

  emptyText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 15,
  },
});