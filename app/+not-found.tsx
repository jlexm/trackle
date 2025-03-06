import { View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import MyText from "@/components/atoms/my-text";
import MyColors from "@/components/atoms/my-colors";

export default function NotFoundScreen() {
  return (
    <>
      <View style={styles.container}>
        <MyText textType="title" textColor={MyColors.white}>
          OOPS! NOT FOUND
        </MyText>
        <Link href="/(tabs)" style={styles.button}>
          Go back to Home screen!
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
