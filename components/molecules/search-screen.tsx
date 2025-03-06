import { View, StyleSheet } from "react-native";
import MyColors from "../atoms/my-colors";

export default function SearchScreen() {
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MyColors.white,
  },
});
