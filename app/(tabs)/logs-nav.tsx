import { View, StyleSheet } from "react-native";
import React from "react";
import MyColors from "@/components/atoms/my-colors";
import LogsScreen from "@/components/molecules/logs-screen";

export default function LogsNav() {
  return (
    <View style={styles.container}>
      <LogsScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: MyColors.white,
  },
});
