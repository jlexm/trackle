import { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { View, StyleSheet, ScrollView } from "react-native"
import MyText from "../atoms/my-text"
import MyColors from "../atoms/my-colors"
import MyButton from "../atoms/my-button"
import MyInputForm from "../atoms/my-input-form"
import { db } from "../../FirebaseConfig"
import { getAuth } from "firebase/auth"
import { collection, addDoc } from "firebase/firestore"
import { router } from "expo-router"

export default function CreateCompoundScreen() {
  const [compoundName, setCompoundName] = useState("")
  const [address, setAddress] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const auth = getAuth()

  const handleSaveCompound = async () => {
    if (isSaving) return

    const user = auth.currentUser
    if (!user) {
      alert("You must be logged in to create a compound.")
      return
    }

    if (!compoundName.trim()) {
      alert("Please enter a compound name.")
      return
    }

    if (!address.trim()) {
      alert("Please enter an address.")
      return
    }

    setIsSaving(true)

    try {
      await addDoc(collection(db, "compounds"), {
        userId: user.uid,
        compoundName,
        address,
      })

      setCompoundName("")
      setAddress("")
      router.replace("/(tabs)")
    } catch (error) {
      console.error("Error adding document: ", error)
      alert("Failed to create compound. Please try again.")
    }

    setIsSaving(false)
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingTop: 60 }}>
          <MyText textType="title" textColor="black">
            Create Compound
          </MyText>
        </View>

        <View style={styles.inputs}>
          <MyInputForm
            label="Compound Name"
            icon="home-outline"
            height={50}
            onChange={setCompoundName}
          />
          <MyInputForm
            label="Address"
            icon="location-outline"
            height={50}
            onChange={setAddress}
          />
        </View>

        <MyButton
          onPress={handleSaveCompound}
          buttonName={isSaving ? "CREATING..." : "CREATE"}
          buttonColor={isSaving ? MyColors.dark : MyColors.green}
          fontColor={MyColors.white}
          icon={isSaving ? "progress-clock" : "content-save"}
          fontSize={16}
          width={120}
          disabled={isSaving}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: MyColors.white,
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  inputs: {
    justifyContent: "center",
    gap: 20,
    marginTop: 50,
    marginBottom: 50,
  },
})
