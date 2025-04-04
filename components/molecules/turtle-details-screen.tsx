import React, { useEffect, useState } from "react"
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { Card, Switch, Text } from "react-native-paper"
import MyText from "@/components/atoms/my-text"
import MyColors from "@/components/atoms/my-colors"
import MyButton from "@/components/atoms/my-button"
import { SafeAreaView } from "react-native-safe-area-context"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../FirebaseConfig"
import MyInputForm from "../atoms/my-input-form"
import { Picker } from "@react-native-picker/picker"
import { deleteTurtle } from "@/services/turtles-services/deleteTurtles"
import { useAuth } from "@/components/auth/auth-context"

export default function TurtleDetailsScreen() {
  const { id } = useLocalSearchParams()
  const { user, role } = useAuth()

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
      await updateDoc(docRef, {
        length: parseFloat(length) || 0,
        weight: parseFloat(weight) || 0,
        location,
        status,
      })

      setTurtle((prev: any) => ({
        ...prev,
        length: parseFloat(length) || 0,
        weight: parseFloat(weight) || 0,
        location,
        status,
      }))
    } catch (error) {
      console.error("Error updating turtle:", error)
    }
    setIsSaving(false)
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
        <View style={styles.switchContainer}>
          <MyText textType="title" textColor={MyColors.black}>
            Rescued Turtle #{id}
          </MyText>
        </View>

        <View style={styles.switchContainer}>
          <Text>View QR</Text>
          <Switch value={showQR} onValueChange={() => setShowQR(!showQR)} />
        </View>

        {showQR ? (
          <Image
            source={{
              uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RT-${id}`,
            }}
            style={{ width: 150, height: 150, alignSelf: "center" }}
          />
        ) : (
          <Image source={{ uri: turtle.imageUrl }} style={styles.turtleImage} />
        )}

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
          style={{ flexDirection: "row", justifyContent: "center", gap: 20 }}
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
    marginTop: 50,
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: MyColors.white,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  turtleImage: {
    alignSelf: "center",
    width: "90%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  saveButton: {
    alignSelf: "center",
    marginVertical: 10,
  },
  inputs: {
    justifyContent: "center",
    gap: 20,
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center",
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
    width: 280,
  },
})
