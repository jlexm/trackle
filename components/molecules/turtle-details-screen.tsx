import React, { useState } from "react"
import { View, Image, StyleSheet } from "react-native"
import { useLocalSearchParams } from "expo-router"
import { Card, Button, Switch, Text } from "react-native-paper"
import QRCode from "react-native-qrcode-svg"
import MyText from "@/components/atoms/my-text"
import MyColors from "@/components/atoms/my-colors"
import MyButton from "@/components/atoms/my-button"
import { SafeAreaView } from "react-native-safe-area-context"
import { turtleData } from "@/data/turtleData"

export default function TurtleDetailsScreen() {
  const { id } = useLocalSearchParams()
  const turtle = turtleData.find((t) => t.id === id)
  const [showQR, setShowQR] = useState(true)

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
          Rescued Turtle #{turtle.id}
        </MyText>
      </View>

      <View style={styles.switchContainer}>
        <Text>View QR</Text>
        <Switch value={showQR} onValueChange={() => setShowQR(!showQR)} />
      </View>

      {showQR ? (
        <View style={styles.qrContainer}>
          <QRCode
            value={turtle.id}
            size={150}
            color="black"
            backgroundColor="white"
          />
        </View>
      ) : (
        <Image source={{ uri: turtle.image }} style={styles.turtleImage} />
      )}

      <Button
        mode="contained"
        buttonColor="red"
        icon="delete"
        style={styles.deleteButton}
      >
        DELETE
      </Button>

      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <MyText textType="caption" textColor={MyColors.black}>
            <MyText textType="turtleInfo" textColor={MyColors.black}>
              Date Rescued:
            </MyText>{" "}
            {turtle.dateRescued}
          </MyText>
          <MyText textType="caption" textColor={MyColors.black}>
            <MyText textType="turtleInfo" textColor={MyColors.black}>
              Length:
            </MyText>{" "}
            {turtle.turtleLength} cm
          </MyText>
          <MyText textType="caption" textColor={MyColors.black}>
            <MyText textType="turtleInfo" textColor={MyColors.black}>
              Weight:
            </MyText>{" "}
            {turtle.turtleWeight} kg
          </MyText>
          <MyText textType="caption" textColor={MyColors.black}>
            <MyText textType="turtleInfo" textColor={MyColors.black}>
              Location:
            </MyText>{" "}
            {turtle.locationRescued}
          </MyText>
          <MyText textType="caption" textColor={MyColors.black}>
            <MyText textType="turtleInfo" textColor={MyColors.black}>
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
