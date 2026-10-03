import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
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

export default function ResultsScreen({ route, navigation }) {
  const { token } = useAuth();
  const [result] = useState(route.params?.result);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [saving, setSaving] = useState(false);

  function toHrMin(min) {
    const total = Number(min || 0);
    const h = Math.floor(total / 60);
    const m = Math.round(total % 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  function formatMoney(value) {
    return `Rs. ${Number(value || 0).toLocaleString()}`;
  }

  function getCategoryName(categoryId) {
    const map = {
      1: "Religious",
      2: "Beach",
      3: "Wildlife",
      4: "Adventure",
      5: "Historical",
      6: "Cultural",
      7: "Other",
    };
    return map[Number(categoryId)] || `Category ${categoryId}`;
  }

  async function onSave() {
    if (!result) return;

    setMsg("");
    setMsgType("");

    try {
      setSaving(true);

      const payload = {
        startName: result.start.name,
        endName: result.end.name,
        budgetLkr: result.budgetLkr,
        days: result.days,
        preferredCategoryIds: result.preferredCategoryIds,
        preferredCategoryNames: result.preferredCategoryNames,
        route: {
          distanceKm: result.route.distanceKm,
          durationMin: result.route.durationMin,
        },
        topPois: result.topPois,
        topHotels: result.topHotels,
        dayWisePlan: result.dayWisePlan,
      };

      await apiPost("/plan/save", payload, token);
      setMsg("Plan saved to history successfully.");
      setMsgType("success");
    } catch (e) {
      setMsg(e.message || "Failed to save plan.");
      setMsgType("error");
    } finally {
      setSaving(false);
    }
  }

  const PlaceCard = ({ item, index }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.poiBadge}>
          <Text style={styles.badgeText}>{item.visit_order || index + 1}</Text>
        </View>

        <View style={styles.itemHeaderText}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemSubTitle}>
            {getCategoryName(item.category_id)}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Total Distance from Start Place :</Text>
        <Text style={styles.infoValue}>
          {Number(item.distance_from_start_km_ui || 0).toFixed(2)} km
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Time Duration :</Text>
        <Text style={styles.infoValue}>
          {toHrMin(item.duration_from_start_min_ui)}
        </Text>
      </View>
    </View>
  );

  const HotelCard = ({ item, index }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.hotelBadge}>
          <Text style={styles.badgeText}>{index + 1}</Text>
        </View>

        <View style={styles.itemHeaderText}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemSubTitle}>Recommended stay option</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Price :</Text>
        <Text style={styles.infoValue}>
          {formatMoney(Math.round(Number(item.price_lkr || 0)))}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Rating :</Text>
        <Text style={styles.infoValue}>{Number(item.rating || 0)}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Reviews :</Text>
        <Text style={styles.infoValue}>{Number(item.review_count || 0)}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Total Distance from Start Place :</Text>
        <Text style={styles.infoValue}>
          {Number(item.distance_from_start_km_ui || 0).toFixed(2)} km
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Time Duration :</Text>
        <Text style={styles.infoValue}>
          {toHrMin(item.duration_from_start_min_ui)}
        </Text>
      </View>
    </View>
  );

  if (!result) {
    return (
      <SafeAreaView style={styles.emptySafe}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No results found</Text>
        </View>
      </SafeAreaView>
    );
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
          source={require("../../assets/result-travel.jpg")}
          style={styles.hero}
          imageStyle={styles.heroImage}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.heroBadge}>Travel Plan Ready</Text>
            <Text style={styles.heroTitle}>
              {result.start.name} → {result.end.name}
            </Text>
            <Text style={styles.heroSubtitle}>
              Your smart itinerary with recommended attractions and hotels
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Trip Summary</Text>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Budget</Text>
              <Text style={styles.summaryValue}>{formatMoney(result.budgetLkr)}</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Days</Text>
              <Text style={styles.summaryValue}>{result.days}</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Distance</Text>
              <Text style={styles.summaryValue}>
                {Number(result.route?.distanceKm || 0).toFixed(1)} km
              </Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Duration</Text>
              <Text style={styles.summaryValue}>
                {toHrMin(result.route?.durationMin)}
              </Text>
            </View>
          </View>

          <View style={styles.categoryWrap}>
            <Text style={styles.categoryText}>
              Categories: {(result.preferredCategoryNames || []).join(", ") || "N/A"}
            </Text>
          </View>
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "green" }]} />
            <Text style={styles.legendText}>Start</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "red" }]} />
            <Text style={styles.legendText}>End</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#f59e0b" }]} />
            <Text style={styles.legendText}>Places</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#2563eb" }]} />
            <Text style={styles.legendText}>Hotels</Text>
          </View>
        </View>

        <View style={styles.actionsWrap}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.saveBtn]}
            onPress={onSave}
            activeOpacity={0.85}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.actionBtnText}>Save Plan</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.dayBtn]}
            onPress={() => navigation.navigate("DayWisePlan", { result })}
            activeOpacity={0.85}
          >
            <Text style={styles.actionBtnText}>Day-wise Plan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.commentBtn]}
            onPress={() => navigation.navigate("Comments")}
            activeOpacity={0.85}
          >
            <Text style={styles.actionBtnText}>Add Comment</Text>
          </TouchableOpacity>
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

        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>Recommended Places to Visit</Text>
          <FlatList
            data={result.topPois || []}
            keyExtractor={(item, index) =>
              "poi-" + (item.entity_id || item.poi_id || index)
            }
            renderItem={({ item, index }) => (
              <PlaceCard item={item} index={index} />
            )}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>Recommended Hotels</Text>
          <FlatList
            data={result.topHotels || []}
            keyExtractor={(item, index) =>
              "hotel-" + (item.entity_id || item.hotel_id || index)
            }
            renderItem={({ item, index }) => (
              <HotelCard item={item} index={index} />
            )}
            scrollEnabled={false}
          />
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
    paddingBottom: 28,
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
    backgroundColor: "rgba(15,23,42,0.42)",
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
    overflow: "hidden",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 34,
  },
  heroSubtitle: {
    marginTop: 8,
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: -22,
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 14,
    textAlign: "center",
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  summaryBox: {
    width: "48%",
    backgroundColor: "#f8fafc",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "700",
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 15,
    color: "#0f172a",
    fontWeight: "800",
  },
  categoryWrap: {
    marginTop: 4,
    backgroundColor: "#ecfeff",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  categoryText: {
    textAlign: "center",
    color: "#0f766e",
    fontWeight: "700",
    fontSize: 14,
  },
  legend: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 4,
    marginVertical: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },
  actionsWrap: {
    paddingHorizontal: 16,
    marginTop: 14,
  },
  actionBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 10,
  },
  saveBtn: {
    backgroundColor: "#16a34a",
  },
  dayBtn: {
    backgroundColor: "#8e24aa",
  },
  tripBtn: {
    backgroundColor: "#6a1b9a",
  },
  commentBtn: {
    backgroundColor: "#2563eb",
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  messageBox: {
    marginHorizontal: 16,
    marginTop: 6,
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
  sectionWrap: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  poiBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f59e0b",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  hotelBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  itemHeaderText: {
    flex: 1,
  },
  itemTitle: {
    fontWeight: "800",
    fontSize: 16,
    color: "#0f172a",
  },
  itemSubTitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  infoLabel: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "600",
  },
  infoValue: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "700",
  },
  emptySafe: {
    flex: 1,
    backgroundColor: "#eef4f8",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyWrap: {
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#334155",
  },
});