import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>LearnFi</Text>
    </View>
  )
}

const styles = StyleSheet.create({
 container: {
    position: "absolute",
    top: 0,
    alignSelf: "center",
    backgroundColor: "#000",
    paddingVertical: 3,
    paddingHorizontal: 35,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#ffcc00"
 },
 logo: {
    color: "#ffcc00",
    fontSize: 20,
    fontWeight: "800"
 }
})
export default Header
