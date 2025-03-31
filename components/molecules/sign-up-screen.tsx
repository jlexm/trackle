import { useState } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Image } from "expo-image"
import { Snackbar, ActivityIndicator } from "react-native-paper"
import { router } from "expo-router"
import MyColors from "../atoms/my-colors"
import MyInputForm from "../atoms/my-input-form"
import MyButton from "../atoms/my-button"
import { signUpUser } from "@/services/users-services/createUsers"
import { Picker } from "@react-native-picker/picker"
import MyText from "../atoms/my-text"

export default function SignUpScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"caretaker" | "management">("caretaker")
  const [errorMessage, setErrorMessage] = useState("")
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const showSnackbar = (message: string) => {
    setErrorMessage(message)
    setSnackbarVisible(true)
  }

  const handleSignUp = async () => {
    setLoading(true)
    try {
      await signUpUser({ email, password, role })
      if (role === "management") {
        router.replace("/create-compound-nav")
      } else {
        router.replace("/(tabs)")
      }
    } catch (error: any) {
      showSnackbar(error.message || "Sign up failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {loading ? (
            <ActivityIndicator size="large" color={MyColors.white} />
          ) : (
            <Image
              style={styles.image}
              source={require("../../assets/images/trackle_logo.png")}
              contentFit="cover"
              transition={1000}
            />
          )}
        </View>

        <View style={styles.inputs}>
          <MyInputForm label="Email" value={email} onChange={setEmail} />
          <MyInputForm
            label="Password"
            value={password}
            onChange={setPassword}
            secureTextEntry={true}
          />
          <MyText textType="bodyBold" textColor={MyColors.black}>
            {" "}
            Select Role{" "}
          </MyText>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) =>
                setRole(itemValue as "management" | "caretaker")
              }
              style={styles.picker}
              mode="dropdown"
            >
              <Picker.Item label="Management" value="management" />
              <Picker.Item label="Caretaker" value="caretaker" />
            </Picker>
          </View>
        </View>

        <View style={styles.signUpContainer}>
          <MyButton
            buttonName="CREATE"
            buttonColor={MyColors.dark}
            fontColor={MyColors.white}
            onPress={handleSignUp}
            disabled={loading}
          />
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {errorMessage}
      </Snackbar>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: MyColors.primary,
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  inputs: {
    justifyContent: "center",
    gap: 20,
    margin: 40,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
    justifyContent: "center",
  },
  picker: {
    height: 60,
    width: "100%",
  },
})
