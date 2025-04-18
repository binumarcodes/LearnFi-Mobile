import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../util/firebase";

const Signup = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("English");
  const [subject, setSubject] = useState("Mathematics");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      console.log("User created:", user.uid);
  
      const walletResponse = await fetch("https://xion-backend.onrender.com/generate-wallet", {
        method: "GET", // Change to POST if needed
        headers: { "Content-Type": "application/json" },
      });
  
      const responseText = await walletResponse.text();
      console.log("Raw response:", responseText);
  
      if (!walletResponse.ok) {
        throw new Error(`Failed to generate XION wallet: ${walletResponse.status} ${responseText}`);
      }
  
      const walletData = JSON.parse(responseText);
      console.log("Wallet Data:", walletData);
  
      await setDoc(doc(db, "learners", user.uid), {
        name,
        email,
        language,
        subject,
        uid: user.uid,
        walletAddress: walletData.address,
        mnemonic: walletData.mnemonic,
        createdAt: new Date(),
      });
  
      navigation.navigate("main");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Create Account</Text>
        {error && <Text style={styles.error}>{error}</Text>}

        <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

        <View style={styles.pickerContainer}>
          <Picker selectedValue={language} onValueChange={(itemValue) => setLanguage(itemValue)} style={styles.picker}>
            <Picker.Item label="English" value="English" />
            <Picker.Item label="French" value="French" />
            <Picker.Item label="Hausa" value="Hausa" />
            <Picker.Item label="Yoruba" value="Yoruba" />
            <Picker.Item label="Igbo" value="Igbo" />
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker selectedValue={subject} onValueChange={(itemValue) => setSubject(itemValue)} style={styles.picker}>
            <Picker.Item label="Mathematics" value="Mathematics" />
            <Picker.Item label="Physics" value="Physics" />
            <Picker.Item label="Biology" value="Biology" />
            <Picker.Item label="Chemistry" value="Chemistry" />
            <Picker.Item label="English" value="English" />
          </Picker>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.navigate("login")}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  card: {
    width: "90%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 50,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  logo: {
    width: 80,
    height: 100,
    alignSelf: "center",
    marginBottom: 15,
  },
  linkText: {
    marginTop: 20,
    color: "#007bff",
    textAlign: "center",
  },
});

export default Signup;
