import { StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Homescreen from "@/components/molecules/home-screen";
import MyColors from "@/components/atoms/my-colors";

export default function index() {
  return (
    <SafeAreaView style={styles.container}>
      <Homescreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MyColors.white,
  },
});
