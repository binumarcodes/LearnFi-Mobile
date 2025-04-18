import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";

const QuizModal = ({ visible, question, options, answer, onQuizComplete }: any) => {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setSelected(null);
    }
  }, [visible]);

  if (!question || !Array.isArray(options) || !answer) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.question}>{question}</Text>

          {options.map((option: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                selected === option && {
                  backgroundColor: option === answer ? "#2ecc71" : "#e74c3c",
                },
              ]}
              onPress={() => {
                setSelected(option);
                setTimeout(() => {
                  onQuizComplete(option === answer);
                }, 1000);
              }}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

export default QuizModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  option: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  optionText: {
    color: "white",
    fontSize: 16,
  },
});
