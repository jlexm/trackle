import { View, StyleSheet, Text, TouchableOpacity } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useAuth } from "../auth/auth-context"
import MyColors from "../atoms/my-colors"
import MyText from "../atoms/my-text"
import { router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

export default function SettingsScreen() {
  const { logout } = useAuth()

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View>
          <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons
              name="office-building"
              size={24}
              color={MyColors.black}
            />
            <MyText textType="body" style={styles.settingText}>
              Compound Name
            </MyText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons
              name="account-supervisor"
              size={24}
              color={MyColors.black}
            />
            <MyText textType="body" style={styles.settingText}>
              Accounts
            </MyText>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            router.replace("/login-nav")
            logout()
          }}
          style={styles.settingItem}
        >
          <MaterialCommunityIcons
            name="logout"
            size={24}
            color={MyColors.black}
          />
          <MyText textType="body" style={styles.settingText}>
            Sign Out
          </MyText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: MyColors.white,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: 75,
    paddingHorizontal: 40,
    justifyContent: "space-between",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  settingText: {
    fontSize: 18,
    color: MyColors.black,
    marginLeft: 10,
  },
})
