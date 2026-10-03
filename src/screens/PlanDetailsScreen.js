import React from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  ImageBackground,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlanDetailsScreen({ route }) {
  const plan = route.params?.plan;

  function toHrMin(min) {
    const totalMin = Number(min || 0);
    const h = Math.floor(totalMin / 60);
    const m = Math.round(totalMin % 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  function formatMoney(value) {
    return `Rs. ${Number(value || 0).toLocaleString()}`;
  }

  if (!plan) {
    return (
      <SafeAreaView style={styles.emptySafe}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No plan data found</Text>
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
          source={require("../../assets/plan-travel.jpg")}
          style={styles.hero}
          imageStyle={styles.heroImage}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <Text style={styles.badge}>Trip Overview</Text>
            <Text style={styles.heroTitle}>
              {plan.startName} → {plan.endName}
            </Text>
            <Text style={styles.heroSubtitle}>
              Discover your personalized smart travel plan
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Plan Summary</Text>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Budget</Text>
              <Text style={styles.summaryValue}>
                {formatMoney(plan.budgetLkr)}
              </Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Days</Text>
              <Text style={styles.summaryValue}>{plan.days}</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Category</Text>
              <Text style={styles.summaryValue}>
                {plan.preferredCategoryId || "N/A"}
              </Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Route</Text>
              <Text style={styles.summaryValue}>
                {Number(plan.route?.distanceKm || 0).toFixed(1)} km
              </Text>
            </View>
          </View>

          <View style={styles.routeTimeWrap}>
            <Text style={styles.routeTimeText}>
              Estimated Travel Time: {toHrMin(plan.route?.durationMin || 0)}
            </Text>
          </View>
        </View>

        <View style={styles.sectionWrap}>
          <Text style={styles.mainSectionTitle}>Places to Visit</Text>

          {plan.topPois?.length ? (
            plan.topPois.map((p, idx) => (
              <View key={idx} style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.numberBadge}>
                    <Text style={styles.numberBadgeText}>
                      {p.visit_order || idx + 1}
                    </Text>
                  </View>

                  <View style={styles.cardHeaderTextWrap}>
                    <Text style={styles.cardTitle}>{p.name}</Text>
                    <Text style={styles.cardTag}>Recommended attraction</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Total Distance from Start Place :</Text>
                  <Text style={styles.infoValue}>
                    {Number(p.distance_from_start_km_ui || 0).toFixed(2)} km
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Time Duration :</Text>
                  <Text style={styles.infoValue}>
                    {toHrMin(Number(p.duration_from_start_min_ui || 0))}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyCardText}>No places found</Text>
            </View>
          )}
        </View>

        <View style={styles.sectionWrap}>
          <Text style={styles.mainSectionTitle}>Hotels</Text>

          {plan.topHotels?.length ? (
            plan.topHotels.map((h, idx) => (
              <View key={idx} style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.numberBadge, styles.hotelBadge]}>
                    <Text style={styles.numberBadgeText}>{idx + 1}</Text>
                  </View>

                  <View style={styles.cardHeaderTextWrap}>
                    <Text style={styles.cardTitle}>{h.name}</Text>
                    <Text style={styles.cardTag}>Suggested stay option</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Price :</Text>
                  <Text style={styles.infoValue}>
                    {formatMoney(Math.round(h.price_lkr || 0))}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Rating :</Text>
                  <Text style={styles.infoValue}>{h.rating ?? "N/A"}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Total Distance from Start Place :</Text>
                  <Text style={styles.infoValue}>
                    {Number(h.distance_from_start_km_ui || 0).toFixed(2)} km
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Time Duration :</Text>
                  <Text style={styles.infoValue}>
                    {toHrMin(Number(h.duration_from_start_min_ui || 0))}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyCardText}>No hotels found</Text>
            </View>
          )}
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
  overlay: {
    backgroundColor: "rgba(15,23,42,0.45)",
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 14,
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
  routeTimeWrap: {
    marginTop: 4,
    backgroundColor: "#e0f2fe",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  routeTimeText: {
    textAlign: "center",
    color: "#075985",
    fontWeight: "700",
    fontSize: 14,
  },
  sectionWrap: {
    marginTop: 18,
    paddingHorizontal: 16,
  },
  mainSectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 12,
  },
  card: {
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
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  numberBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  hotelBadge: {
    backgroundColor: "#2563eb",
  },
  numberBadgeText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  cardHeaderTextWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
  },
  cardTag: {
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
  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
  },
  emptyCardText: {
    color: "#64748b",
    fontWeight: "600",
  },
});