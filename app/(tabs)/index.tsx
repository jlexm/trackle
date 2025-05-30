import { StyleSheet } from "react-native"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import CompoundScreen from "@/components/molecules/compound-screen"
import MyColors from "@/components/atoms/my-colors"

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <CompoundScreen />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MyColors.white,
  },
})
