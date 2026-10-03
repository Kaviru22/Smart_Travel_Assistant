import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import SearchScreen from "../screens/SearchScreen";
import ResultsScreen from "../screens/ResultsScreen";
import HistoryScreen from "../screens/HistoryScreen";
import PlanDetailsScreen from "../screens/PlanDetailsScreen";
import CommentsScreen from "../screens/CommentsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import TripOverviewScreen from "../screens/TripOverviewScreen";
import DayWisePlanScreen from "../screens/DayWisePlanScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: "Plan Trip" }}
      />
      <Stack.Screen
        name="Results"
        component={ResultsScreen}
        options={{ title: "Travel Plan" }}
      />
      <Stack.Screen
        name="TripOverview"
        component={TripOverviewScreen}
        options={{ title: "Trip Overview" }}
      />
      <Stack.Screen
        name="DayWisePlan"
        component={DayWisePlanScreen}
        options={{ title: "Day-wise Plan" }}
      />
    </Stack.Navigator>
  );
}

function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: "Saved Plans" }}
      />
      <Stack.Screen
        name="PlanDetails"
        component={PlanDetailsScreen}
        options={{ title: "Saved Plan Details" }}
      />
    </Stack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: "center",
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#16a34a",
        tabBarInactiveTintColor: "#64748b",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginBottom: 4,
        },
        tabBarStyle: {
          position: "absolute",
          left: 10,
          right: 10,
          bottom: 10,
          height: 62,
          borderRadius: 18,
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          paddingTop: 4,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName = "ellipse";

          if (route.name === "PlanTab") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "HistoryTab") {
            iconName = focused ? "time" : "time-outline";
          } else if (route.name === "Comments") {
            iconName = focused
              ? "chatbubble-ellipses"
              : "chatbubble-ellipses-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          }

          return <Ionicons name={iconName} size={20} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="PlanTab"
        component={SearchStack}
        options={{
          title: "Plan Trip",
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="HistoryTab"
        component={HistoryStack}
        options={{
          title: "History",
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Comments"
        component={CommentsScreen}
        options={{ title: "Comments" }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}