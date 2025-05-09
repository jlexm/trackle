import { useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native"
import MyColors from "../atoms/my-colors"
import MyText from "../atoms/my-text"
import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { ActivityIndicator, Card, Button, IconButton } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  or,
} from "firebase/firestore"
import { useAuth } from "../auth/auth-context"
import { db } from "@/FirebaseConfig"
import { useGlobalContext } from "@/services/global-services/global-context"
import * as Clipboard from "expo-clipboard"

export default function HomeScreen() {
  const router = useRouter()
  const { user, role } = useAuth()
  const { setCurrentCompoundID } = useGlobalContext()

  const [isLoading, setIsLoading] = useState(true)
  const [compounds, setCompounds] = useState<{ id: string; name: string }[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [compoundCode, setCompoundCode] = useState("")

  useEffect(() => {
    if (!user) return

    const fetchCompounds = async () => {
      setIsLoading(true)
      try {
        const q = query(
          collection(db, "compounds"),
          or(
            where("userId", "==", user.uid),
            where("members", "array-contains", user.uid)
          )
        )
        const querySnapshot = await getDocs(q)
        const compoundsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().compoundName || "Unnamed Compound",
        }))
        setCompounds(compoundsList)
      } catch (error) {
        console.error("Error fetching compounds:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompounds()
  }, [user])

  const joinCompound = async () => {
    if (!compoundCode.trim()) {
      return
    }

    if (!user) {
      return
    }

    try {
      const compoundRef = doc(db, "compounds", compoundCode)
      const compoundSnap = await getDoc(compoundRef)

      if (!compoundSnap.exists()) {
        return
      }

      await updateDoc(compoundRef, {
        members: arrayUnion(user.uid),
      })
      setIsModalVisible(false)
      setCompoundCode("")
      router.replace("/(tabs)")
    } catch (error) {
      console.error("Error joining compound:", error)
    }
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={MyColors.black} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <MyText textType="subtitle" textColor={MyColors.black}>
              Welcome,{" "}
              <MyText textType="caption" textColor={MyColors.black}>
                {user?.email || "User"}
              </MyText>
            </MyText>
          </View>
          <View style={styles.header}>
            <MyText
              textType="title"
              textColor={MyColors.black}
              style={styles.title}
            >
              My Compounds
            </MyText>
            {role !== "management" && (
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => setIsModalVisible(true)}
              >
                <MyText
                  textType="caption"
                  textColor={MyColors.black}
                  style={styles.searchText}
                >
                  Join Compound
                </MyText>
                <Feather name="plus" size={24} color={MyColors.black} />
              </TouchableOpacity>
            )}
          </View>
          <MyText
            textType="title"
            textColor={MyColors.black}
            style={styles.count}
          >
            {compounds.length}
          </MyText>
          {role === "management" && (
            <Card
              style={styles.addCard}
              onPress={() => {
                router.push("/create-compound-nav")
              }}
            >
              <View style={styles.addCardContent}>
                <IconButton icon="plus" size={40} />
                <MyText textType="body" textColor={MyColors.black}>
                  Add Compound
                </MyText>
              </View>
            </Card>
          )}
          {compounds.length > 0 ? (
            compounds.map((compound) => (
              <Card
                key={compound.id}
                style={styles.card}
                onPress={() => {
                  setCurrentCompoundID(compound.id)
                  router.push("/(tabs)")
                }}
                onLongPress={() => {
                  if (role === "management") {
                    Clipboard.setStringAsync(compound.id)
                    Alert.alert(
                      "Compound Code Copied!",
                      `Code for ${compound.name} has been copied to your clipboard.`,
                      [{ text: "OK" }]
                    )
                  }
                }}
              >
                <Card.Title title={compound.name} />
              </Card>
            ))
          ) : (
            <MyText textType="body" textColor={MyColors.black}>
              No compounds joined yet. Ask for a compound code to join.
            </MyText>
          )}
        </ScrollView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <MyText
              textType="title"
              textColor={MyColors.black}
              style={styles.modalTitle}
            >
              Enter Compound Code
            </MyText>
            <TextInput
              style={styles.input}
              placeholder="Enter Code"
              value={compoundCode}
              onChangeText={setCompoundCode}
            />
            <View style={styles.buttonRow}>
              <Button
                mode="contained"
                onPress={joinCompound}
                style={styles.button}
              >
                Join
              </Button>
              <Button
                mode="outlined"
                onPress={() => setIsModalVisible(false)}
                style={styles.button}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
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
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 75,
  },
  header: {
    flexDirection: "row",
    gap: 50,
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchText: {
    fontSize: 14,
    marginRight: 5,
  },
  count: {
    fontSize: 128,
    marginBottom: 10,
  },
  card: {
    alignItems: "stretch",
    width: 300,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: MyColors.white,
    elevation: 10,
  },
  addCard: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
    width: "75%",
    marginVertical: 10,
    backgroundColor: MyColors.primary,
    borderWidth: 1,
    borderColor: MyColors.black,
    borderRadius: 10,
    elevation: 5,
    paddingVertical: 10,
  },
  addCardContent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: MyColors.white,
    borderRadius: 10,
    elevation: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: MyColors.black,
    borderRadius: 5,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
})
