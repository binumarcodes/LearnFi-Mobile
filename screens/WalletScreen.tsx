import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../util/firebase";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

function WalletScreen() {
  const [wallet, setWallet] = useState<{ balance: string; address: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not logged in");

        const userRef = doc(db, "learners", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setWallet({
            balance: docSnap.data().walletBalance,  // Assuming walletBalance exists in Firestore
            address: docSnap.data().walletAddress,
          });
        } else {
          console.error("No wallet data found in Firestore");
        }
      } catch (error) {
        console.error("Error fetching wallet:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>XION Wallet</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#bbb" />
      ) : wallet ? (
        <View style={styles.card}>
          
          <Text style={styles.info}>🏦 Address:</Text>
          <View style={styles.addressContainer}>
            <Text style={styles.address}>{shortenAddress(wallet.address)}</Text>
            <TouchableOpacity onPress={() => copyToClipboard(wallet.address)}>
              <Ionicons name="copy-outline" size={20} color="#bbb" style={styles.copyIcon} />
            </TouchableOpacity>
          </View>

          <Text style={styles.info}>💰 Balance:</Text>
          <Text style={styles.balance}>0.00</Text>

        </View>
      ) : (
        <Text style={styles.error}>No wallet found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#bbb",
  },
  card: {
    backgroundColor: "#1e1e1e",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 5,
    fontWeight: "bold",
    color: "#ddd",
  },
  balance: {
    fontSize: 18,
    color: "#aad4ff",
    textAlign: "center",
    marginBottom: 10,
    backgroundColor: "#003366",
    padding: 10,
    borderRadius: 5,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#003300",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 10,

  },
  address: {
    fontSize: 14,
    color: "#66ff66",
    flex: 1,
  },
  copyIcon: {
    marginLeft: 10,
  },
  error: {
    fontSize: 16,
    color: "#ff6666",
    textAlign: "center",
    marginTop: 10,
  },
});

export default WalletScreen;
