import React, { useEffect, useState } from "react"
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { Text, Switch, IconButton } from "react-native-paper"
import MyText from "@/components/atoms/my-text"
import MyColors from "@/components/atoms/my-colors"
import MyButton from "@/components/atoms/my-button"
import { SafeAreaView } from "react-native-safe-area-context"
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore"
import * as ImagePicker from "expo-image-picker"
import { db, storage } from "../../FirebaseConfig"
import MyInputForm from "../atoms/my-input-form"
import { Picker } from "@react-native-picker/picker"
import { deleteTurtle } from "@/services/turtles-services/deleteTurtles"
import { useAuth } from "@/components/auth/auth-context"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export default function TurtleDetailsScreen() {
  const { id } = useLocalSearchParams()
  const { role } = useAuth()

  const [turtle, setTurtle] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)

  const [length, setLength] = useState("")
  const [weight, setWeight] = useState("")
  const [location, setLocation] = useState("")
  const [status, setStatus] = useState("")

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchTurtle = async () => {
      if (!id) return
      setIsLoading(true)
      try {
        const docRef = doc(db, "turtles", id.toString())
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const turtleData = docSnap.data()
          setTurtle(turtleData)

          setLength(turtleData.length?.toString() || "")
          setWeight(turtleData.weight?.toString() || "")
          setLocation(turtleData.location || "")
          setStatus(turtleData.status || "")
        } else {
          console.log("No such turtle!")
          setTurtle(null)
        }
      } catch (error) {
        console.error("Error fetching turtle:", error)
      }
      setIsLoading(false)
    }

    fetchTurtle()
  }, [id])

  const handleSaveChanges = async () => {
    if (!turtle) return

    setIsSaving(true)
    try {
      const docRef = doc(db, "turtles", id.toString())
      const updatedData = {
        length: parseFloat(length) || 0,
        weight: parseFloat(weight) || 0,
        location,
        status,
      }

      const changes: any = {}
      Object.entries(updatedData).forEach(([key, newValue]) => {
        if (turtle[key] !== newValue) {
          changes[key] = {
            from: turtle[key],
            to: newValue,
          }
        }
      })

      if (Object.keys(changes).length > 0) {
        await updateDoc(docRef, updatedData)

        const historyRef = collection(db, "turtles", id.toString(), "history")
        await addDoc(historyRef, {
          changes,
          timestamp: serverTimestamp(),
        })

        setTurtle((prev: any) => ({
          ...prev,
          ...updatedData,
        }))
      }
    } catch (error) {
      console.error("Error updating turtle:", error)
    }
    setIsSaving(false)
  }

  const handleImageUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      })

      if (!result.canceled && result.assets.length > 0) {
        const imageUri = result.assets[0].uri

        const response = await fetch(imageUri)
        const blob = await response.blob()

        const imageRef = ref(storage, `turtle-images/${id}.jpg`)
        await uploadBytes(imageRef, blob)

        const downloadURL = await getDownloadURL(imageRef)

        const docRef = doc(db, "turtles", id.toString())
        await updateDoc(docRef, { imageUrl: downloadURL })

        setTurtle((prev: any) => ({
          ...prev,
          imageUrl: downloadURL,
        }))
      }
    } catch (error) {
      console.error("Image upload failed:", error)
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={MyColors.black} />
      </SafeAreaView>
    )
  }

  if (!turtle) {
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <Text variant="titleLarge" style={{ color: "red" }}>
            Turtle Not Found
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <MyText
          textType="title"
          textColor={MyColors.black}
          style={{
            textAlign: "center",
            fontSize: 24,
            marginVertical: 10,
            paddingTop: 20,
          }}
        >
          Rescued Turtle #{id}
        </MyText>

        <View style={styles.qrToggle}>
          <Text style={styles.qrToggleLabel}>Show QR Code</Text>
          <View style={styles.qrToggleRight}>
            <IconButton
              icon="history"
              size={26}
              onPress={() => {
                router.push(`/history-nav?id=${id}`)
              }}
            />
            <Switch value={showQR} onValueChange={() => setShowQR(!showQR)} />
          </View>
        </View>

        <View style={styles.imageContainer}>
          {showQR ? (
            <Image
              source={{
                uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RT-${id}`,
              }}
              style={styles.qrImage}
            />
          ) : (
            <Pressable onLongPress={handleImageUpload}>
              <Image
                source={{ uri: turtle.imageUrl }}
                style={styles.turtleImage}
              />
            </Pressable>
          )}
        </View>

        <View style={styles.inputs}>
          <MyText textType="bodyBold" textColor={MyColors.black}>
            Length
          </MyText>
          <MyInputForm
            keyboardType="numeric"
            label="Length"
            icon="resize-outline"
            height={50}
            value={length}
            onChange={setLength}
            editable={role !== "caretaker"}
          />
          <MyText textType="bodyBold" textColor={MyColors.black}>
            Weight
          </MyText>
          <MyInputForm
            keyboardType="numeric"
            label="Weight"
            icon="barbell-outline"
            height={50}
            value={weight}
            onChange={setWeight}
            editable={role !== "caretaker"}
          />
          <MyText textType="bodyBold" textColor={MyColors.black}>
            Location
          </MyText>
          <MyInputForm
            label="Location"
            icon="location-outline"
            height={50}
            value={location}
            onChange={setLocation}
            editable={role !== "caretaker"}
          />
          <MyText textType="bodyBold" textColor={MyColors.black}>
            Status
          </MyText>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={status}
              onValueChange={(itemValue) => setStatus(itemValue)}
              style={styles.picker}
              mode="dropdown"
              enabled={role !== "caretaker"}
            >
              <Picker.Item label="Healthy" value="Healthy" />
              <Picker.Item label="Injured" value="Injured" />
              <Picker.Item label="Under Treatment" value="Under Treatment" />
            </Picker>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 20,
            marginBottom: 30,
            paddingBottom: 50,
          }}
        >
          <MyButton
            style={styles.saveButton}
            buttonName={isSaving ? "SAVING..." : "SAVE CHANGES"}
            width={180}
            fontSize={16}
            fontColor={MyColors.white}
            buttonColor={MyColors.dark}
            icon="update"
            onPress={handleSaveChanges}
            disabled={isSaving || role === "caretaker"}
          />

          <MyButton
            style={styles.saveButton}
            buttonName="DELETE"
            width={120}
            fontSize={16}
            fontColor={MyColors.white}
            buttonColor={MyColors.red}
            icon="delete"
            onPress={() =>
              deleteTurtle(id.toString(), () => {
                router.back()
                return []
              })
            }
            disabled={role === "caretaker"}
          />
        </View>
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
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: MyColors.white,
  },
  qrToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
  },
  qrToggleLabel: {
    fontSize: 16,
    color: MyColors.black,
    fontWeight: "500",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  qrToggleRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  turtleImage: {
    width: 280,
    height: 200,
    borderRadius: 12,
  },
  qrImage: {
    width: 150,
    height: 150,
  },
  inputs: {
    justifyContent: "center",
    gap: 20,
    marginVertical: 30,
    alignItems: "center",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    justifyContent: "center",
    width: 280,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  saveButton: {
    marginTop: 10,
  },
})
