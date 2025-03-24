import React, { useEffect, useState } from "react"
import { View, Image, StyleSheet, ActivityIndicator } from "react-native"
import { useLocalSearchParams } from "expo-router"
import { Card, Button, Switch, Text } from "react-native-paper"
import QRCode from "react-native-qrcode-svg"
import MyText from "@/components/atoms/my-text"
import MyColors from "@/components/atoms/my-colors"
import MyButton from "@/components/atoms/my-button"
import { SafeAreaView } from "react-native-safe-area-context"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../FirebaseConfig"

export default function TurtleDetailsScreen() {
  const { id } = useLocalSearchParams()
  const [turtle, setTurtle] = useState<{
    userId: string
    length: number
    weight: number
    location: string
    status: string
    imageUrl?: string
    dateRescued: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    const fetchTurtle = async () => {
      if (!id) return
      setIsLoading(true)
      try {
        const docRef = doc(db, "turtles", id.toString())
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setTurtle(docSnap.data() as any)
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
    <SafeAreaView style={styles.container}>
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
        <View style={styles.qrContainer}>
          <QRCode
            value={`RT-${id}`}
            size={150}
            color="black"
            backgroundColor="white"
          />
        </View>
      ) : (
        <Image source={{ uri: turtle.imageUrl }} style={styles.turtleImage} />
      )}

      <MyButton
        style={styles.saveButton}
        buttonName="DELETE"
        width={120}
        fontSize={16}
        fontColor={MyColors.white}
        buttonColor={MyColors.red}
        icon="delete"
        onPress={() => console.log("Delete!")}
      />

      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <MyText textType="caption" textColor={MyColors.black}>
            <MyText textType="bodyBold" textColor={MyColors.black}>
              Date Rescued:
            </MyText>{" "}
            {new Date(turtle.dateRescued).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </MyText>
          <MyText textType="caption" textColor={MyColors.black}>
            <MyText textType="bodyBold" textColor={MyColors.black}>
              Length:
            </MyText>{" "}
            {turtle.length} cm
          </MyText>
          <MyText textType="caption" textColor={MyColors.black}>
            <MyText textType="bodyBold" textColor={MyColors.black}>
              Weight:
            </MyText>{" "}
            {turtle.weight} kg
          </MyText>
          <MyText textType="caption" textColor={MyColors.black}>
            <MyText textType="bodyBold" textColor={MyColors.black}>
              Location:
            </MyText>{" "}
            {turtle.location}
          </MyText>
          <MyText textType="caption" textColor={MyColors.black}>
            <MyText textType="bodyBold" textColor={MyColors.black}>
              Status:
            </MyText>{" "}
            {turtle.status}
          </MyText>
        </Card.Content>
      </Card>

      <MyButton
        style={styles.saveButton}
        buttonName="SAVE CHANGES"
        width={160}
        fontSize={16}
        fontColor={MyColors.white}
        buttonColor={MyColors.green}
        icon="content-save"
        onPress={() => console.log("Changes saved!")}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    backgroundColor: MyColors.white,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  qrContainer: {
    alignSelf: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  turtleImage: {
    alignSelf: "center",
    width: "90%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButton: {
    alignSelf: "center",
    marginBottom: 10,
  },
  card: {
    margin: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  cardContent: {
    gap: 10,
  },
  saveButton: {
    alignSelf: "center",
    marginVertical: 10,
  },
})
