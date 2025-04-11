import React, { useState, useEffect, useCallback } from "react"
import { View, StyleSheet, Text } from "react-native"
import { Camera, CameraView } from "expo-camera"
import { useRouter, useFocusEffect } from "expo-router"
import MyColors from "../atoms/my-colors"
import MyButton from "../atoms/my-button"
import MyText from "../atoms/my-text"

export default function ScanScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null)
  const [isScanning, setIsScanning] = useState(true)
  const [isScreenFocused, setIsScreenFocused] = useState(true)
  const router = useRouter()

  // Ask for camera permission on mount
  useEffect(() => {
    requestCameraAccess()
  }, [])

  const requestCameraAccess = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync()
    setHasCameraPermission(status === "granted")
  }

  // Handle navigation focus/unfocus
  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true)
      return () => setIsScreenFocused(false)
    }, [])
  )

  const onBarcodeScanned = ({ data }: { type: string; data: string }) => {
    setIsScanning(false)
    const turtleId = data.replace("RT-", "")
    router.push({ pathname: "/turtle/[id]", params: { id: turtleId } })
  }

  if (hasCameraPermission === null) {
    return <Text>Requesting camera permission...</Text>
  }

  if (!hasCameraPermission) {
    return <Text>No access to camera</Text>
  }

  return (
    <View style={styles.screen}>
      {isScanning && isScreenFocused ? (
        <CameraView
          onBarcodeScanned={onBarcodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr", "pdf417"] }}
          style={styles.cameraView}
        >
          <View style={styles.cameraOverlay}>
            <MyText textType="title" textColor={MyColors.white}>
              Scan a turtle QR
            </MyText>
            <View style={styles.frameBox}>
              <View style={[styles.frameCorner, styles.topLeft]} />
              <View style={[styles.frameCorner, styles.topRight]} />
              <View style={[styles.frameCorner, styles.bottomLeft]} />
              <View style={[styles.frameCorner, styles.bottomRight]} />
            </View>
          </View>
        </CameraView>
      ) : (
        <MyButton
          buttonName="SCAN AGAIN"
          buttonColor={MyColors.dark}
          fontColor={MyColors.white}
          width={150}
          height={50}
          onPress={() => setIsScanning(true)}
          style={styles.rescanButton}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraView: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  frameBox: {
    marginTop: 20,
    width: 250,
    height: 250,
  },
  frameCorner: {
    width: 40,
    height: 40,
    position: "absolute",
    borderColor: "white",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  rescanButton: {
    position: "absolute",
    bottom: 50,
  },
})
