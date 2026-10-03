import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function MapScreen({ route }) {
  const result = route.params?.result;
  const mapRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);

  if (!result) {
    return (
      <View style={styles.center}>
        <Text>No map data</Text>
      </View>
    );
  }

  const { start, end, topPois = [], topHotels = [], route: tripRoute, budgetLkr, days } = result;

  const startPoint = {
    latitude: Number(start.lat),
    longitude: Number(start.lon),
  };

  const endPoint = {
    latitude: Number(end.lat),
    longitude: Number(end.lon),
  };

  const visitPoints = topPois.map((p) => ({
    latitude: Number(p.lat),
    longitude: Number(p.lon),
  }));

  const hotelPoints = topHotels.map((h) => ({
    latitude: Number(h.lat),
    longitude: Number(h.lon),
  }));

  const allPoints = [startPoint, endPoint, ...visitPoints, ...hotelPoints].filter(
    (p) =>
      !isNaN(p.latitude) &&
      !isNaN(p.longitude) &&
      Math.abs(p.latitude) <= 90 &&
      Math.abs(p.longitude) <= 180
  );

  const routePath = [startPoint, ...visitPoints, endPoint].filter(
    (p) => !isNaN(p.latitude) && !isNaN(p.longitude)
  );

  useEffect(() => {
    if (mapRef.current && allPoints.length > 0) {
      setTimeout(() => {
        mapRef.current.fitToCoordinates(allPoints, {
          edgePadding: { top: 140, right: 60, bottom: 210, left: 60 },
          animated: true,
        });
      }, 500);
    }
  }, []);

  function toHrMin(min) {
    const total = Number(min || 0);
    const h = Math.floor(total / 60);
    const m = Math.round(total % 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  return (
    <View style={styles.container}>
      {/* Legend */}
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
          <View style={[styles.legendDot, { backgroundColor: "#f57c00" }]} />
          <Text style={styles.legendText}>Places to Visit</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#1a73e8" }]} />
          <Text style={styles.legendText}>Hotels</Text>
        </View>
      </View>

      {/* Trip Summary */}
      <View style={styles.summaryBar}>
        <Text style={styles.summaryTitle}>
          {start.name} → {end.name}
        </Text>
        <Text style={styles.summaryText}>
          {Number(tripRoute?.distanceKm || 0).toFixed(2)} km | {toHrMin(Number(tripRoute?.durationMin || 0))}
        </Text>
        <Text style={styles.summaryText}>
          Budget Rs. {Math.round(Number(budgetLkr || 0))} | Days {Number(days || 0)}
        </Text>
      </View>

      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: startPoint.latitude || 7.8731,
          longitude: startPoint.longitude || 80.7718,
          latitudeDelta: 2,
          longitudeDelta: 2,
        }}
        onPress={() => setSelectedItem(null)}
      >
        {routePath.length >= 2 && (
          <Polyline
            coordinates={routePath}
            strokeWidth={4}
            strokeColor="#1a73e8"
          />
        )}

        <Marker
          coordinate={startPoint}
          title={`Start: ${start.name}`}
          description="Trip starting point"
          pinColor="green"
          onPress={() =>
            setSelectedItem({
              type: "start",
              title: start.name,
              subtitle: "Trip starting point",
            })
          }
        />

        <Marker
          coordinate={endPoint}
          title={`End: ${end.name}`}
          description="Trip destination"
          pinColor="red"
          onPress={() =>
            setSelectedItem({
              type: "end",
              title: end.name,
              subtitle: "Trip destination",
            })
          }
        />

        {topPois.map((p, index) => (
          <Marker
            key={`visit-${p.entity_id}`}
            coordinate={{
              latitude: Number(p.lat),
              longitude: Number(p.lon),
            }}
            onPress={() =>
              setSelectedItem({
                type: "visit",
                title: `${p.visit_order || index + 1}. ${p.name}`,
                category: p.category_id,
                score: Number(p.pred_score || 0).toFixed(4),
                distance: Number(p.distance_from_start_km_ui || 0).toFixed(2),
                eta: toHrMin(Number(p.duration_from_start_min_ui || 0)),
              })
            }
          >
            <View style={styles.visitMarker}>
              <Text style={styles.visitMarkerText}>{p.visit_order || index + 1}</Text>
            </View>
          </Marker>
        ))}

        {topHotels.map((h, index) => (
          <Marker
            key={`hotel-${h.entity_id}`}
            coordinate={{
              latitude: Number(h.lat),
              longitude: Number(h.lon),
            }}
            onPress={() =>
              setSelectedItem({
                type: "hotel",
                title: h.name,
                price: Math.round(Number(h.price_lkr || 0)),
                rating: Number(h.rating || 0),
                reviews: Number(h.review_count || 0),
                distance: Number(h.distance_from_start_km_ui || 0).toFixed(2),
                eta: toHrMin(Number(h.duration_from_start_min_ui || 0)),
                label: `H${index + 1}`,
              })
            }
          >
            <View style={styles.hotelMarker}>
              <Text style={styles.hotelMarkerText}>H{index + 1}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {selectedItem && (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{selectedItem.title}</Text>

          {(selectedItem.type === "start" || selectedItem.type === "end") && (
            <Text style={styles.infoText}>{selectedItem.subtitle}</Text>
          )}

          {selectedItem.type === "visit" && (
            <>
              <Text style={styles.infoText}>Type: Place to Visit</Text>
              <Text style={styles.infoText}>Category: {selectedItem.category}</Text>
              <Text style={styles.infoText}>Distance from Start: {selectedItem.distance} km</Text>
              <Text style={styles.infoText}>ETA from Start: {selectedItem.eta}</Text>
              <Text style={styles.infoText}>Suitability Score: {selectedItem.score}</Text>
            </>
          )}

          {selectedItem.type === "hotel" && (
            <>
              <Text style={styles.infoText}>Type: Hotel</Text>
              <Text style={styles.infoText}>Price: Rs. {selectedItem.price}</Text>
              <Text style={styles.infoText}>
                Rating: {selectedItem.rating} | Reviews: {selectedItem.reviews}
              </Text>
              <Text style={styles.infoText}>Distance from Start: {selectedItem.distance} km</Text>
              <Text style={styles.infoText}>ETA from Start: {selectedItem.eta}</Text>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  legend: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: "#ffffffee",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },

  legendText: {
    fontSize: 11,
    fontWeight: "600",
  },

  summaryBar: {
    position: "absolute",
    top: 60,
    left: 10,
    right: 10,
    backgroundColor: "#ffffffee",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    zIndex: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  summaryTitle: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },

  summaryText: {
    fontSize: 13,
    textAlign: "center",
    color: "#333",
    marginTop: 2,
  },

  visitMarker: {
    backgroundColor: "#f57c00",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#fff",
    minWidth: 32,
    alignItems: "center",
  },

  visitMarkerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  hotelMarker: {
    backgroundColor: "#1a73e8",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#fff",
    minWidth: 36,
    alignItems: "center",
  },

  hotelMarkerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  infoCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  infoText: {
    fontSize: 14,
    color: "#333",
    marginTop: 2,
  },
});