import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TripOverviewScreen({ route }) {
  const result = route.params?.result;

  const trip = useMemo(() => {
    if (!result) return null;

    const {
      start,
      end,
      route: tripRoute,
      budgetLkr,
      days,
      topPois = [],
      topHotels = [],
      preferredCategoryNames = [],
    } = result;

    return {
      start,
      end,
      tripRoute,
      budgetLkr,
      days,
      topPois,
      topHotels,
      preferredCategoryNames,
    };
  }, [result]);

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

  if (!trip) {
    return (
      <SafeAreaView style={styles.emptySafe}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No trip data available</Text>
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
          source={require("../../assets/search-travel.jpg")}
          style={styles.hero}
          imageStyle={styles.heroImage}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.heroBadge}>Trip Overview</Text>
            <Text style={styles.heroTitle}>
              {trip.start?.name} → {trip.end?.name}
            </Text>
            <Text style={styles.heroSubtitle}>
              View your complete route, attractions, hotels, and travel flow in one place
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Trip Summary</Text>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Budget</Text>
              <Text style={styles.summaryValue}>{formatMoney(trip.budgetLkr)}</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Days</Text>
              <Text style={styles.summaryValue}>{trip.days}</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Distance</Text>
              <Text style={styles.summaryValue}>
                {Number(trip.tripRoute?.distanceKm || 0).toFixed(2)} km
              </Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Duration</Text>
              <Text style={styles.summaryValue}>
                {toHrMin(Number(trip.tripRoute?.durationMin || 0))}
              </Text>
            </View>
          </View>

          <View style={styles.categoryWrap}>
            <Text style={styles.categoryText}>
              Categories: {trip.preferredCategoryNames.join(", ") || "N/A"}
            </Text>
          </View>
        </View>

        <View style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>Travel Flow</Text>

          <View style={styles.timelineItem}>
            <View style={[styles.dot, { backgroundColor: "green" }]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Start</Text>
              <Text style={styles.timelineText}>{trip.start?.name}</Text>
            </View>
          </View>

          {trip.topPois.length > 0 && (
            <View style={styles.groupLabelWrap}>
              <Text style={styles.groupLabel}>Places to Visit</Text>
            </View>
          )}

          {trip.topPois.map((place, index) => (
            <View
              style={styles.timelineItem}
              key={`place-${place.entity_id || index}`}
            >
              <View style={[styles.dot, { backgroundColor: "#f59e0b" }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>
                  Place {place.visit_order || index + 1}
                </Text>
                <Text style={styles.timelineText}>{place.name}</Text>
                <Text style={styles.smallText}>
                  Category: {getCategoryName(place.category_id)}
                </Text>
                <Text style={styles.smallText}>
                  Distance from Start:{" "}
                  {Number(place.distance_from_start_km_ui || 0).toFixed(2)} km
                </Text>
                <Text style={styles.smallText}>
                  ETA from Start:{" "}
                  {toHrMin(Number(place.duration_from_start_min_ui || 0))}
                </Text>
              </View>
            </View>
          ))}

          {trip.topHotels.length > 0 && (
            <View style={styles.groupLabelWrap}>
              <Text style={styles.groupLabel}>Recommended Hotels</Text>
            </View>
          )}

          {trip.topHotels.map((hotel, index) => (
            <View
              style={styles.timelineItem}
              key={`hotel-${hotel.entity_id || index}`}
            >
              <View style={[styles.dot, { backgroundColor: "#2563eb" }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Hotel {index + 1}</Text>
                <Text style={styles.timelineText}>{hotel.name}</Text>
                <Text style={styles.smallText}>
                  Price: {formatMoney(Math.round(Number(hotel.price_lkr || 0)))}
                </Text>
                <Text style={styles.smallText}>
                  Rating: {Number(hotel.rating || 0)} | Reviews:{" "}
                  {Number(hotel.review_count || 0)}
                </Text>
                <Text style={styles.smallText}>
                  Distance from Start:{" "}
                  {Number(hotel.distance_from_start_km_ui || 0).toFixed(2)} km
                </Text>
                <Text style={styles.smallText}>
                  ETA from Start:{" "}
                  {toHrMin(Number(hotel.duration_from_start_min_ui || 0))}
                </Text>
              </View>
            </View>
          ))}

          <View style={styles.timelineItem}>
            <View style={[styles.dot, { backgroundColor: "red" }]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>End</Text>
              <Text style={styles.timelineText}>{trip.end?.name}</Text>
            </View>
          </View>
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
  timelineCard: {
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 12,
  },
  groupLabelWrap: {
    marginTop: 6,
    marginBottom: 10,
  },
  groupLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    backgroundColor: "#f1f5f9",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 5,
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: "#fafcff",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eef2f7",
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0f172a",
  },
  timelineText: {
    fontSize: 14,
    color: "#334155",
    marginTop: 3,
    fontWeight: "600",
  },
  smallText: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
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
    fontSize: 16,
    color: "#64748b",
    fontWeight: "700",
  },
});