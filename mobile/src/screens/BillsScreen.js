import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getBills } from "../services/billingService";

const BillsScreen = () => {
  const [bills, setBills] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await getBills();
      setBills(data);
    } catch (e) {
      // surfaced via empty state
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bills}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={load} />
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.invoice}>{item.billNumber}</Text>
              <Text style={styles.meta}>
                {item.customer?.name || "Walk-in"} ·{" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.amount}>
                ₹{(item.totalAmount || 0).toFixed(2)}
              </Text>
              <Text style={styles.payment}>{item.paymentMethod}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {refreshing ? "Loading…" : "No bills yet"}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fb", padding: 12 },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 6,
  },
  invoice: { fontWeight: "600", fontSize: 15 },
  meta: { color: "#6b7280", fontSize: 13 },
  amount: { fontWeight: "bold", fontSize: 15 },
  payment: { color: "#6b7280", fontSize: 13, textTransform: "capitalize" },
  empty: { textAlign: "center", color: "#6b7280", marginTop: 40 },
});

export default BillsScreen;
