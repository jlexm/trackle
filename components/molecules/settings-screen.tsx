import { View, StyleSheet } from "react-native"
import MyButton from "../atoms/my-button"
import MyColors from "../atoms/my-colors"
import { useAuth } from "../auth/auth-context"

export default function SettingsScreen() {
  const { logout } = useAuth()

  return (
    <View style={styles.container}>
      <MyButton
        buttonName="SIGN OUT"
        buttonColor={MyColors.dark}
        fontColor={MyColors.white}
        onPress={logout}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    justifyContent: "center",
  },
})
