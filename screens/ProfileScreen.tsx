import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { ProgressBar } from "react-native-paper";
import { auth, db } from "../util/firebase"; // Ensure Firebase is configured
import { doc, getDoc } from "firebase/firestore";

const { width } = Dimensions.get("window");

const CustomButton = ({ title, backgroundColor, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.gameButton, { backgroundColor }]}
      activeOpacity={0.8}
    >
      <Text style={styles.gameButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const progress = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "learners", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    Animated.timing(progress, {
      toValue: 0.75, // Final progress value
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* User Details */}
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: "https://sites.uci.edu/sbass/files/2022/05/AF7A55DF-ABEE-4850-B93D-846C75426F32-400x400.png",
          }}
          style={styles.profile}
        />
      </View>

      <View style={styles.topCard}>
        <View style={styles.userDetails}>
          <Text style={styles.username}>{userData ? userData.name : "Loading..."}</Text>
          <Text style={styles.bio}>
            {userData ? `${userData.subject} - ${userData.language}` : "Loading..."}
          </Text>
        </View>

        {/* Wallet & Token Balance */}
        <Text style={styles.walletText}>Wallet Connected: Xion</Text>
        <Text style={styles.tokenText}>Tokens: 320 LFI</Text>

        {/* Performance Stats */}
        <View style={styles.numbers}>
          <View style={styles.numberRow}>
            <Text style={styles.number}>14 📚</Text>
            <Text style={styles.numberTitle}>Lessons</Text>
          </View>
          <View style={styles.numberRow}>
            <Text style={styles.number}>175 🏆</Text>
            <Text style={styles.numberTitle}>XP Points</Text>
          </View>
          <View style={styles.numberRow}>
            <Text style={styles.number}>10 🔥</Text>
            <Text style={styles.numberTitle}>Streak</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <Text style={styles.progressText}>Level 3 - 75% XP</Text>
        <ProgressBar progress={0.75} color="#ffcc00" style={styles.progressBar} />

        {/* Buttons */}
        <View style={styles.buttons}>
          <CustomButton title="Chat" backgroundColor="#000" onPress={() => {}} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  topCard: { width: "100%", padding: 16, paddingTop: 18, backgroundColor: "#000" },
  userDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  username: { fontSize: 20, fontWeight: "600", color: "#fff" },
  bio: { fontSize: 14, fontWeight: "400", color: "#fff" },
  walletText: { fontSize: 14, color: "#ffcc00", marginTop: 5, textAlign: "center" },
  tokenText: { fontSize: 16, fontWeight: "bold", color: "#fff", textAlign: "center" },
  numbers: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  numberRow: {
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "gray",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 20,
  },
  number: { fontSize: 20, fontWeight: "600", color: "#fff" },
  numberTitle: { fontSize: 14, fontWeight: "400", color: "rgba(255,255,255,0.8)" },
  progressText: { fontSize: 14, color: "#fff", textAlign: "center", marginBottom: 5 },
  progressBar: {
    height: 8,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    width: "90%",
    alignSelf: "center",
    marginBottom: 16,
  },
  buttons: { flexDirection: "row", justifyContent: "center", marginTop: 150 },
  gameButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffcc00",
    backgroundColor: "#111",
    shadowColor: "#ffcc00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
    width: 200,
    alignSelf: "center",
  },
  gameButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffcc00",
    textTransform: "uppercase",
  },
  profileContainer: {
    width: "100%",
    height: 230,
    backgroundColor: "#ffcc00",
    alignItems: "center",
    justifyContent: "center",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  profile: {
    width: 230,
    height: 230,
    position: "absolute",
    bottom: 0,
  },
});

export default ProfileScreen;
