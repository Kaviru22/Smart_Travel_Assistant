import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DayWisePlanScreen({ route }) {
  const result = route.params?.result;
  const dayWisePlan = result?.dayWisePlan || [];

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

  if (!result) {
    return (
      <SafeAreaView style={styles.emptySafe}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No day-wise plan available</Text>
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
            <Text style={styles.heroBadge}>Day-wise Itinerary</Text>
            <Text style={styles.heroTitle}>
              {result.start.name} → {result.end.name}
            </Text>
            <Text style={styles.heroSubtitle}>
              Explore your journey broken down day by day with places and hotel suggestions
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

        {dayWisePlan.length === 0 ? (
          <View style={styles.emptyDayCard}>
            <Text style={styles.emptyDayText}>No day-wise plan available</Text>
          </View>
        ) : (
          dayWisePlan.map((dayItem) => (
            <View key={`day-${dayItem.day}`} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <View style={styles.dayBadge}>
                  <Text style={styles.dayBadgeText}>{dayItem.day}</Text>
                </View>
                <View>
                  <Text style={styles.dayTitle}>Day {dayItem.day}</Text>
                  <Text style={styles.daySubTitle}>Daily trip plan</Text>
                </View>
              </View>

              <View style={styles.daySummaryBox}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Start</Text>
                  <Text style={styles.infoValue}>{dayItem.startLabel}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>End</Text>
                  <Text style={styles.infoValue}>{dayItem.endLabel}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Travel Distance</Text>
                  <Text style={styles.infoValue}>
                    {Number(dayItem.totalDistanceKm || 0).toFixed(2)} km
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Travel Time</Text>
                  <Text style={styles.infoValue}>
                    {toHrMin(dayItem.totalTravelMin)}
                  </Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Places to Visit</Text>

              {dayItem.placesToVisit.length === 0 ? (
                <View style={styles.emptyInnerCard}>
                  <Text style={styles.emptyInnerText}>
                    No places assigned for this day
                  </Text>
                </View>
              ) : (
                dayItem.placesToVisit.map((place, index) => (
                  <View key={`place-${place.entity_id || index}`} style={styles.itemCard}>
                    <View style={styles.itemHeader}>
                      <View style={styles.poiBadge}>
                        <Text style={styles.badgeText}>{index + 1}</Text>
                      </View>

                      <View style={styles.itemHeaderText}>
                        <Text style={styles.itemTitle}>{place.name}</Text>
                        <Text style={styles.itemSubTitle}>
                          {getCategoryName(place.category_id)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Distance from Start</Text>
                      <Text style={styles.infoValue}>
                        {Number(place.distance_from_start_km_ui || 0).toFixed(2)} km
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>ETA from Start</Text>
                      <Text style={styles.infoValue}>
                        {toHrMin(place.duration_from_start_min_ui)}
                      </Text>
                    </View>
                  </View>
                ))
              )}

              <Text style={styles.sectionTitle}>Suggested Hotels</Text>

              {dayItem.hotels.length === 0 ? (
                <View style={styles.emptyInnerCard}>
                  <Text style={styles.emptyInnerText}>
                    No hotel assigned for this day
                  </Text>
                </View>
              ) : (
                dayItem.hotels.map((hotel, index) => (
                  <View key={`hotel-${hotel.entity_id || index}`} style={styles.itemCard}>
                    <View style={styles.itemHeader}>
                      <View style={styles.hotelBadge}>
                        <Text style={styles.badgeText}>{index + 1}</Text>
                      </View>

                      <View style={styles.itemHeaderText}>
                        <Text style={styles.itemTitle}>{hotel.name}</Text>
                        <Text style={styles.itemSubTitle}>Suggested stay option</Text>
                      </View>
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Price</Text>
                      <Text style={styles.infoValue}>
                        {formatMoney(Math.round(Number(hotel.price_lkr || 0)))}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Rating</Text>
                      <Text style={styles.infoValue}>{Number(hotel.rating || 0)}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Reviews</Text>
                      <Text style={styles.infoValue}>
                        {Number(hotel.review_count || 0)}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Distance from Start</Text>
                      <Text style={styles.infoValue}>
                        {Number(hotel.distance_from_start_km_ui || 0).toFixed(2)} km
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>ETA from Start</Text>
                      <Text style={styles.infoValue}>
                        {toHrMin(hotel.duration_from_start_min_ui)}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          ))
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
  dayCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  dayBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  dayBadgeText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  dayTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
  },
  daySubTitle: {
    marginTop: 3,
    color: "#64748b",
    fontSize: 13,
    fontWeight: "600",
  },
  daySummaryBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginTop: 8,
    marginBottom: 10,
  },
  itemCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eef2f7",
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
    fontSize: 16,
    fontWeight: "800",
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
    flex: 1,
    marginRight: 10,
  },
  infoValue: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "700",
    flexShrink: 1,
    textAlign: "right",
  },
  emptyDayCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    alignItems: "center",
  },
  emptyDayText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 15,
  },
  emptyInnerCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    alignItems: "center",
  },
  emptyInnerText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 14,
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