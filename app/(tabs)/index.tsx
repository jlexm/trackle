import { StyleSheet } from "react-native"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import CompoundScreen from "@/components/molecules/compound-screen"
import HomeScreen from "@/components/molecules/home-screen"
import MyColors from "@/components/atoms/my-colors"
import { useAuth } from "@/components/auth/auth-context"

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <HomeScreen />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MyColors.white,
  },
})
