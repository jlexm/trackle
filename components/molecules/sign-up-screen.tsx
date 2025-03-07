import { router } from "expo-router"
import { Snackbar, ActivityIndicator } from "react-native-paper"
import { auth } from "@/FirebaseConfig"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Image } from "expo-image"
import MyColors from "../atoms/my-colors"
import MyInputForm from "../atoms/my-input-form"
import MyButton from "../atoms/my-button"

export default function SignUpScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const showSnackbar = (message: string) => {
    setErrorMessage(message)
    setSnackbarVisible(true)
  }

  const signUp = async () => {
    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.replace("/(tabs)")
    } catch (error: any) {
      showSnackbar("Sign up failed: " + error.message)
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
          <MyInputForm
            label="Email"
            value={email}
            onChange={(text) => setEmail(text)}
          />
          <MyInputForm
            label="Password"
            value={password}
            onChange={(text) => setPassword(text)}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.signUpContainer}>
          <MyButton
            buttonName="CREATE"
            buttonColor={MyColors.dark}
            fontColor={MyColors.white}
            onPress={signUp}
            disabled={loading} // Disable button when loading
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
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  image: {
    width: 200,
    height: 200,
  },
})
