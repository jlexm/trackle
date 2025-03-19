import { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import MyText from "../atoms/my-text"
import { View, StyleSheet, ScrollView } from "react-native"
import MyColors from "../atoms/my-colors"
import MyButton from "../atoms/my-button"
import MyInputForm from "../atoms/my-input-form"
import { Picker } from "@react-native-picker/picker"
import { db } from "../../FirebaseConfig"
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore"
import { getAuth } from "firebase/auth"

export default function CreateTurtleScreen() {
  const [length, setLength] = useState("")
  const [weight, setWeight] = useState("")
  const [location, setLocation] = useState("")
  const [status, setStatus] = useState("")

  const auth = getAuth()

  const handleSaveTurtle = async () => {
    const user = auth.currentUser

    if (!user) {
      alert("You must be logged in to add a turtle.")
      return
    }

    try {
      const docRef = await addDoc(collection(db, "turtles"), {
        userId: user.uid,
        length,
        weight,
        location,
        status,
        dateRescued: new Date().toISOString(),
      })

      console.log("Document ID:", docRef.id)
      alert(`Turtle added! ID: ${docRef.id}`)
    } catch (error) {
      console.error("Error adding document: ", error)
      alert("Failed to add turtle.")
    }
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
            Add Turtle
          </MyText>
        </View>

        <View style={styles.buttonsContainer}>
          <View style={{ alignItems: "center" }}>
            <MyButton
              onPress={() => {}}
              buttonName="UPLOAD"
              buttonColor={MyColors.black}
              fontColor={MyColors.white}
              icon="upload"
              fontSize={16}
            />
            <MyText textType="body" textColor="black" style={{ marginTop: 5 }}>
              Upload Image Turtle
            </MyText>
          </View>
          <View style={{ alignItems: "center" }}>
            <MyButton
              onPress={() => {}}
              buttonName="SET DATE"
              buttonColor={MyColors.black}
              fontColor={MyColors.white}
              icon="calendar"
              fontSize={16}
              width={120}
            />
            <MyText textType="body" textColor="black" style={{ marginTop: 5 }}>
              Date Rescued
            </MyText>
          </View>
        </View>

        <View style={styles.inputs}>
          <MyInputForm
            label="Length"
            icon="resize-outline"
            height={50}
            onChange={setLength}
          />
          <MyInputForm
            label="Weight"
            icon="barbell-outline"
            height={50}
            onChange={setWeight}
          />
          <MyInputForm
            label="Location"
            icon="location-outline"
            height={50}
            onChange={setLocation}
          />

          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={status}
              onValueChange={(itemValue) => setStatus(itemValue)}
              style={styles.picker}
              mode="dropdown"
            >
              <Picker.Item
                label="Select Status"
                value=""
                enabled={false}
                color="gray"
              />
              <Picker.Item label="Healthy" value="healthy" />
              <Picker.Item label="Injured" value="injured" />
              <Picker.Item label="Under Treatment" value="under_treatment" />
            </Picker>
          </View>
        </View>

        <MyButton
          onPress={handleSaveTurtle}
          buttonName="SAVE"
          buttonColor={MyColors.green}
          fontColor={MyColors.white}
          icon="content-save"
          fontSize={16}
          width={120}
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
    gap: 50,
  },
  inputs: {
    justifyContent: "center",
    gap: 20,
    marginTop: 50,
    marginBottom: 50,
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
