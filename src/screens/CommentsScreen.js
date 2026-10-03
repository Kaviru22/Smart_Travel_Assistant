import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { apiGet, apiPost } from "../api";
import { useAuth } from "../AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CommentsScreen() {
  const { token } = useAuth();

  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);

  async function load() {
    try {
      setLoadingComments(true);
      const data = await apiGet("/comments", token);
      setComments(data.comments || []);
    } catch (e) {
      setMsg(e.message || "Failed to load comments.");
      setMsgType("error");
    } finally {
      setLoadingComments(false);
    }
  }

  async function onSend() {
    setMsg("");
    setMsgType("");

    const cleanMessage = message.trim();

    if (!cleanMessage) {
      setMsg("Please enter your comment.");
      setMsgType("error");
      return;
    }

    try {
      setLoading(true);

      await apiPost(
        "/comments",
        {
          message: cleanMessage,
          rating: rating > 0 ? rating : null,
          general: true,
        },
        token
      );

      setMessage("");
      setRating(0);

      await load();

      setMsg("Comment added successfully.");
      setMsgType("success");
    } catch (e) {
      setMsg(e.message || "Failed to submit comment.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function formatDate(dateValue) {
    if (!dateValue) return "-";
    try {
      return new Date(dateValue).toLocaleString();
    } catch {
      return "-";
    }
  }

  function renderStars(ratingValue) {
    const r = Number(ratingValue || 0);
    let stars = "";

    for (let i = 1; i <= 5; i++) {
      stars += i <= r ? "★" : "☆";
    }

    return stars;
  }

  const renderComment = ({ item, index }) => (
    <View style={styles.commentCard}>
      <View style={styles.commentHeader}>
        <View style={styles.commentBadge}>
          <Text style={styles.commentBadgeText}>{index + 1}</Text>
        </View>

        <View style={styles.commentHeaderText}>
          <Text style={styles.commentTitle}>Traveler Feedback</Text>
          <Text style={styles.commentDate}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>

      <Text style={styles.commentMessage}>{item.message}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Rating</Text>
        <Text style={styles.metaStars}>
          {item.rating ? renderStars(item.rating) : "No rating"}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <FlatList
        data={comments}
        keyExtractor={(item, index) => item._id || String(index)}
        renderItem={renderComment}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <ImageBackground
              source={require("../../assets/comment-travel.jpg")}
              style={styles.hero}
              imageStyle={styles.heroImage}
              resizeMode="cover"
            >
              <View style={styles.heroOverlay}>
                <Text style={styles.heroBadge}>Suggestions & Feedback</Text>
                <Text style={styles.heroTitle}>Traveler Comments</Text>
                <Text style={styles.heroSubtitle}>
                  Share your thoughts and rate your experience
                </Text>
              </View>
            </ImageBackground>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Add Your Comment</Text>

              <Text style={styles.label}>Comment</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Write your comment here..."
                placeholderTextColor="#94a3b8"
                value={message}
                onChangeText={setMessage}
                multiline
                textAlignVertical="top"
              />

              <Text style={styles.label}>Rating (Optional)</Text>

              {/* ⭐ Star Rating Selector */}
              <View style={styles.starInputRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                    style={styles.starTouch}
                  >
                    <Text
                      style={[
                        styles.starButton,
                        star <= rating
                          ? styles.starSelected
                          : styles.starUnselected,
                      ]}
                    >
                      ★
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity onPress={() => setRating(0)}>
                <Text style={styles.clearRating}>Clear rating</Text>
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
                      msgType === "success"
                        ? styles.successText
                        : styles.errorText,
                    ]}
                  >
                    {msg}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.submitBtn, loading && styles.disabledBtn]}
                onPress={onSend}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>Submit Comment</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.sectionWrap}>
              <Text style={styles.sectionTitle}>Recent Comments</Text>
            </View>

            {loadingComments && (
              <View style={styles.loadingWrap}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.loadingText}>Loading comments...</Text>
              </View>
            )}

            {!loadingComments && comments.length === 0 && (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>
                  No comments available yet
                </Text>
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
    paddingBottom: 28,
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
    backgroundColor: "rgba(15,23,42,0.42)",
    padding: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  heroBadge: {
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
    marginTop: 6,
    color: "rgba(255,255,255,0.92)",
  },

  formCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: -22,
    borderRadius: 24,
    padding: 18,
    elevation: 6,
  },

  formTitle: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#dbe4ee",
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 14,
  },

  textArea: {
    minHeight: 110,
  },

  starInputRow: {
    flexDirection: "row",
    marginTop: 6,
    marginBottom: 10,
  },

  starTouch: {
    marginRight: 6,
  },

  starButton: {
    fontSize: 32,
  },

  starSelected: {
    color: "#fbbf24",
  },

  starUnselected: {
    color: "#cbd5e1",
  },

  clearRating: {
    color: "#2563eb",
    fontWeight: "700",
    marginBottom: 6,
  },

  submitBtn: {
    marginTop: 12,
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  submitBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },

  disabledBtn: {
    opacity: 0.7,
  },

  sectionWrap: {
    paddingHorizontal: 16,
    marginTop: 16,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
  },

  loadingWrap: {
    alignItems: "center",
    paddingVertical: 20,
  },

  loadingText: {
    marginTop: 10,
  },

  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginHorizontal: 16,
    alignItems: "center",
  },

  emptyText: {
    color: "#64748b",
    fontWeight: "600",
  },

  commentCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    elevation: 4,
  },

  commentHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },

  commentBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  commentBadgeText: {
    color: "#fff",
    fontWeight: "800",
  },

  commentHeaderText: {
    flex: 1,
  },

  commentTitle: {
    fontWeight: "800",
  },

  commentDate: {
    fontSize: 12,
    color: "#64748b",
  },

  commentMessage: {
    marginBottom: 10,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  metaLabel: {
    fontWeight: "600",
  },

  metaStars: {
    fontSize: 20,
    color: "#fbbf24",
    letterSpacing: 2,
  },
});