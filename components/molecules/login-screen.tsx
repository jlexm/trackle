import { useState } from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native"
import { Image } from "expo-image"
import { Snackbar } from "react-native-paper"
import { router } from "expo-router"
import { auth } from "@/FirebaseConfig"
import { signInWithEmailAndPassword } from "@firebase/auth"
import MyButton from "../atoms/my-button"
import MyColors from "../atoms/my-colors"
import { SafeAreaView } from "react-native-safe-area-context"
import MyInputForm from "../atoms/my-input-form"
import MyText from "../atoms/my-text"

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const showSnackbar = (message: string) => {
    setErrorMessage(message)
    setSnackbarVisible(true)
  }

  const signIn = async () => {
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.replace("/(tabs)")
    } catch (error: any) {
      showSnackbar("Sign in failed: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={MyColors.dark} />
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

        <View style={styles.signInContainer}>
          <MyButton
            buttonName="SIGN IN"
            buttonColor={MyColors.dark}
            fontColor={MyColors.white}
            onPress={signIn}
            disabled={isLoading}
          />
          <TouchableOpacity
            onPress={() => {
              router.push("/signup-nav")
            }}
          >
            <MyText textType="body" textColor={MyColors.black}>
              Don't have an account?
            </MyText>
          </TouchableOpacity>
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
  logoContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  signInContainer: {
    alignItems: "center",
    gap: 10,
  },
  inputs: {
    justifyContent: "center",
    gap: 20,
    marginTop: 20,
    marginBottom: 50,
  },
})
