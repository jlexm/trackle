import { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import MyText from "../atoms/my-text"
import { View, StyleSheet, ScrollView, Image, Platform } from "react-native"
import MyColors from "../atoms/my-colors"
import MyButton from "../atoms/my-button"
import MyInputForm from "../atoms/my-input-form"
import { Picker } from "@react-native-picker/picker"
import { db, storage } from "../../FirebaseConfig"
import { getAuth } from "firebase/auth"
import { ref, getDownloadURL, uploadBytes } from "firebase/storage"
import * as ImagePicker from "expo-image-picker"
import DateTimePicker from "@react-native-community/datetimepicker"
import { collection, addDoc } from "firebase/firestore"
import { router } from "expo-router"

export default function CreateTurtleScreen() {
  const [length, setLength] = useState("")
  const [weight, setWeight] = useState("")
  const [location, setLocation] = useState("")
  const [status, setStatus] = useState("")
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [dateRescued, setDateRescued] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)

  const auth = getAuth()

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImageUri(result.assets[0].uri)
    }
  }

  const handleUploadImage = async () => {
    if (!imageUri) {
      alert("Please select an image first!")
      return null
    }

    try {
      const response = await fetch(imageUri)
      const blob = await response.blob()
      const imageRef = ref(storage, `turtles/${new Date().getTime()}.jpg`)
      await uploadBytes(imageRef, blob)
      const downloadUrl = await getDownloadURL(imageRef)

      return downloadUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image.")
      return null
    }
  }

  const handleSaveTurtle = async () => {
    const user = auth.currentUser
    if (!user) {
      alert("You must be logged in to add a turtle.")
      return
    }

    try {
      const imageUrl = await handleUploadImage()

      const docRef = await addDoc(collection(db, "turtles"), {
        userId: user.uid,
        length,
        weight,
        location,
        status,
        imageUrl,
        dateRescued: dateRescued.toISOString(),
      })

      setLength("")
      setWeight("")
      setLocation("")
      setStatus("")
      setImageUri(null)
      setDateRescued(new Date())

      router.replace("../logs-nav")
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
              onPress={handlePickImage}
              buttonName="UPLOAD"
              buttonColor={MyColors.black}
              fontColor={MyColors.white}
              icon="upload"
              fontSize={16}
            />
            <MyText textType="body" textColor="black" style={{ marginTop: 5 }}>
              Upload Turtle Image
            </MyText>

            {imageUri && (
              <Image
                source={{ uri: imageUri }}
                style={{
                  width: 100,
                  height: 100,
                  marginTop: 10,
                  borderRadius: 10,
                }}
              />
            )}
          </View>

          <View style={{ alignItems: "center" }}>
            <MyButton
              onPress={() => setShowDatePicker(true)}
              buttonName="SET DATE"
              buttonColor={MyColors.black}
              fontColor={MyColors.white}
              icon="calendar"
              fontSize={16}
              width={120}
            />
            <MyText textType="body" textColor="black" style={{ marginTop: 5 }}>
              {dateRescued.toDateString()}
            </MyText>

            {showDatePicker && (
              <DateTimePicker
                value={dateRescued}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false)
                  if (selectedDate) {
                    setDateRescued(selectedDate)
                  }
                }}
              />
            )}
          </View>
        </View>

        <View style={styles.inputs}>
          <MyInputForm
            keyboardType="numeric"
            label="Length"
            icon="resize-outline"
            height={50}
            onChange={setLength}
          />
          <MyInputForm
            keyboardType="numeric"
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
              <Picker.Item label="Healthy" value="Healthy" />
              <Picker.Item label="Injured" value="Injured" />
              <Picker.Item label="Under Treatment" value="Under Treatment" />
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
