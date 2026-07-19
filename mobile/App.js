import React from "react";
import { View, ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import LoginScreen from "./src/screens/LoginScreen";
import BillingScreen from "./src/screens/BillingScreen";
import BillsScreen from "./src/screens/BillsScreen";

const Tab = createBottomTabNavigator();

const LogoutButton = () => {
  const { logout } = useAuth();
  return (
    <TouchableOpacity onPress={logout} style={{ marginRight: 16 }}>
      <Text style={{ color: "#dc2626", fontWeight: "600" }}>Logout</Text>
    </TouchableOpacity>
  );
};

const AppTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerRight: () => <LogoutButton />,
      tabBarActiveTintColor: "#2563eb",
    }}
  >
    <Tab.Screen name="Billing" component={BillingScreen} />
    <Tab.Screen name="Bills" component={BillsScreen} />
  </Tab.Navigator>
);

const Root = () => {
  const { token, loading } = useAuth();
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }
  return token ? <AppTabs /> : <LoginScreen />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Root />
          <StatusBar style="auto" />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
