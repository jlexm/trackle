import React, { useState, useEffect } from "react"
import { View, StyleSheet, Text } from "react-native"
import { Camera, CameraView } from "expo-camera"
import { useRouter } from "expo-router"
import MyColors from "../atoms/my-colors"
import MyButton from "../atoms/my-button"
import MyText from "../atoms/my-text"

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanning, setScanning] = useState(true)
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === "granted")
    })()
  }, [])

  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    setScanning(false)

    const turtleId = data.replace("RT-", "")
    router.push({ pathname: "/turtle/[id]", params: { id: turtleId } })
  }

  if (hasPermission === null)
    return <Text>Requesting camera permission...</Text>
  if (!hasPermission) return <Text>No access to camera</Text>

  return (
    <View style={styles.container}>
      {scanning && (
        <CameraView
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
          style={styles.camera}
        >
          <View style={styles.overlay}>
            <MyText textType="title" textColor={MyColors.white}>
              Scan a turtle QR
            </MyText>
            <View style={styles.scannerFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>
        </CameraView>
      )}

      {!scanning && (
        <MyButton
          buttonName="SCAN AGAIN"
          buttonColor={MyColors.dark}
          fontColor={MyColors.white}
          width={150}
          height={50}
          onPress={() => setScanning(true)}
          style={styles.scanButton}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scannerFrame: {
    marginTop: 20,
    width: 250,
    height: 250,
  },
  scanButton: {
    position: "absolute",
    bottom: 50,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  corner: {
    width: 40,
    height: 40,
    position: "absolute",
    borderColor: "white",
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
})
