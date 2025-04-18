import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const giftOptions = [
  { id: "1", name: "Small Gift", price: 10 },
  { id: "2", name: "Medium Gift", price: 20 },
  { id: "3", name: "Large Gift", price: 50 },
];

export default function VideoControls({ profile, likes, shares }: any) {
  const [liked, setLiked] = useState(false);
  const [isGiftModalVisible, setIsGiftModalVisible] = useState(false);
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [isGiftSent, setIsGiftSent] = useState(false);  // To track if gift is sent
  const fadeAnim = useState(new Animated.Value(0))[0];  // For modal fade-in animation

  // Gift handler
  const handleGiftSelection = (gift: any) => {
    setSelectedGift(gift.id); // Store the gift ID to highlight the selected gift
    setIsGiftSent(false);  // Reset the sent status when selecting a new gift
  };

  const handleSendGift = () => {
    if (selectedGift) {
      const selectedGiftName = giftOptions.find(gift => gift.id === selectedGift)?.name;
      alert(`You have sent the ${selectedGiftName} to the tutor!`);
      setIsGiftSent(true);
      setSelectedGift(null);  // Reset selected gift after sending
      setIsGiftModalVisible(false);  // Close modal after sending the gift
    }
  };

  // Modal fade-in animation
  const openModal = () => {
    setIsGiftModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Close modal with fade-out
  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsGiftModalVisible(false));
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: profile }} style={styles.profile} />

      {/* Like Button */}
      <TouchableOpacity onPress={() => setLiked(!liked)} style={styles.iconButton}>
        <Ionicons name={liked ? "heart" : "heart-outline"} size={30} color={liked ? "#ff4757" : "#fff"} />
        <Text style={styles.count}>{likes}</Text>
      </TouchableOpacity>

      {/* Gift Button */}
      <TouchableOpacity onPress={openModal} style={styles.iconButton}>
        <Ionicons name="gift" size={30} color="white" />
        <Text style={styles.count}>Gift</Text>
      </TouchableOpacity>

      {/* Share Button */}
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="arrow-redo" size={30} color="white" />
        <Text style={styles.count}>{shares}</Text>
      </TouchableOpacity>

      {/* Bookmark Button */}
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="bookmark" size={30} color="white" />
        <Text style={styles.count}>Bookmark</Text>
      </TouchableOpacity>

      {/* Gift Modal */}
      <Modal
        transparent={true}
        visible={isGiftModalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >
        <Animated.View style={[styles.modalBackground, { opacity: fadeAnim }]}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose a Gift</Text>
            <FlatList
              data={giftOptions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.giftItem,
                    selectedGift === item.id && styles.selectedGiftItem,  // Highlight selected gift
                  ]}
                  onPress={() => handleGiftSelection(item)}
                >
                  <Text style={styles.giftText}>
                    {item.name} - {item.price} tokens
                  </Text>
                  {selectedGift === item.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />  // Checkmark indicator
                  )}
                </TouchableOpacity>
              )}
            />

            {/* Send Gift Button */}
            {selectedGift && !isGiftSent && (
              <TouchableOpacity
                style={styles.sendGiftButton}
                onPress={handleSendGift}
              >
                <Text style={styles.sendGiftButtonText}>Send Gift</Text>
              </TouchableOpacity>
            )}

            {/* Close Button */}
            <TouchableOpacity
              onPress={closeModal}
              style={[styles.closeButton, { backgroundColor: "#ff4757" }]}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 80,
    right: 10,
    alignItems: "center",
  },
  profile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "white",
    borderWidth: 2,
    marginBottom: 20,
  },
  iconButton: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",  // Slightly dark background to make icons pop
    padding: 10,
    borderRadius: 10,
  },
  count: {
    color: "white",
    fontSize: 12,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: 320,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5, // Adds a shadow effect on Android
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  giftItem: {
    padding: 15,
    backgroundColor: "#f7f7f7",
    marginVertical: 8,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2, // Adds shadow effect
  },
  selectedGiftItem: {
    backgroundColor: "#e0f7fa", // Light blue to highlight selection
    borderColor: "#2ecc71",  // Green border for selected item
  },
  giftText: {
    fontSize: 16,
    color: "#333",
  },
  sendGiftButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#2ecc71", // Green button for sending gift
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  sendGiftButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
