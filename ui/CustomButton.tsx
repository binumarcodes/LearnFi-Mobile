import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface CustomButtonProps {
    title: string;
    variant?: "default" | "outline";
    backgroundColor?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, variant = "default", backgroundColor }) => {
  return (
    <TouchableOpacity style={[styles.container, { backgroundColor }, variant === "outline" && styles.outlinedContainer]}>
      <Text style={[styles.text, variant === "outline" && styles.outlinedText]}>{title}</Text>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
    container: {
        width: 146,
        height: 39,
        backgroundColor: "#fff",
        paddingVertical: 9,
        paddingHorizontal: 41,
        borderRadius: 8
    },
    text: {
        fontSize: 14,
        color: "#000",
        fontWeight: "500",
        textAlign: "center"
    },
    outlinedContainer: {
        backgroundColor: "#000",
        borderWidth: 1,
        borderColor: "#fff"
    },
    outlinedText: {
        color: "#fff"
    }

})

export default CustomButton
