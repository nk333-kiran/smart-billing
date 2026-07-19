import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {
  getProducts,
  getCustomers,
  createBill,
} from "../services/billingService";

const BillingScreen = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      Alert.alert("Error", "Failed to load products");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [search, products]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          Alert.alert("Stock", "Not enough stock");
          return prev;
        }
        return prev.map((i) =>
          i.productId === product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      if (product.stock <= 0) {
        Alert.alert("Stock", "Out of stock");
        return prev;
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          stock: product.stock,
        },
      ];
    });
  };

  const dec = (id) =>
    setCart((prev) =>
      prev
        .map((i) =>
          i.productId === id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );

  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.quantity, 0),
    [cart]
  );
  const tax = subtotal * 0.18;
  const grandTotal = subtotal + tax;

  const generate = async () => {
    if (cart.length === 0) return;
    setSaving(true);
    try {
      const payload = {
        paymentMethod: "cash",
        items: cart.map((i) => ({
          productId: i.productId,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          subtotal: i.price * i.quantity,
        })),
        subtotal,
        tax,
        discount: 0,
        totalAmount: grandTotal,
      };
      const bill = await createBill(payload);
      Alert.alert("Success", `Bill ${bill.billNumber} generated`);
      setCart([]);
      load();
    } catch (e) {
      Alert.alert(
        "Error",
        e.response?.data?.message || "Failed to generate bill"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search product…"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.productRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productMeta}>
                ₹{item.price} · Stock {item.stock}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => addToCart(item)}
            >
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No products found</Text>
        }
      />

      <View style={styles.cart}>
        <Text style={styles.cartTitle}>Cart ({cart.length})</Text>
        {cart.map((i) => (
          <View key={i.productId} style={styles.cartRow}>
            <Text style={{ flex: 1 }}>
              {i.name} × {i.quantity}
            </Text>
            <Text style={styles.cartTotal}>
              ₹{(i.price * i.quantity).toFixed(2)}
            </Text>
            <TouchableOpacity onPress={() => dec(i.productId)}>
              <Text style={styles.remove}>–</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.summaryRow}>
          <Text>Subtotal</Text>
          <Text>₹{subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>GST (18%)</Text>
          <Text>₹{tax.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.grand}>Grand Total</Text>
          <Text style={styles.grand}>₹{grandTotal.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.generateBtn,
            (cart.length === 0 || saving) && styles.buttonDisabled,
          ]}
          onPress={generate}
          disabled={cart.length === 0 || saving}
        >
          <Text style={styles.generateText}>
            {saving ? "Saving…" : "Generate Bill"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fb", padding: 12 },
  search: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  list: { flex: 1 },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  productName: { fontSize: 16, fontWeight: "500" },
  productMeta: { color: "#6b7280", fontSize: 13 },
  addBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addBtnText: { color: "#fff", fontWeight: "600" },
  empty: { textAlign: "center", color: "#6b7280", marginTop: 20 },
  cart: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  cartTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  cartRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  cartTotal: { marginRight: 12 },
  remove: {
    color: "#dc2626",
    fontSize: 22,
    fontWeight: "bold",
    paddingHorizontal: 6,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  grand: { fontWeight: "bold", fontSize: 16 },
  generateBtn: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonDisabled: { opacity: 0.4 },
  generateText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default BillingScreen;
