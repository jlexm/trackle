import { useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native"
import MyColors from "../atoms/my-colors"
import MyText from "../atoms/my-text"
import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { ActivityIndicator, Avatar, Card, IconButton } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore"
import { db } from "../../FirebaseConfig"
import { useAuth } from "../auth/auth-context"

export default function LogsScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [turtles, setTurtles] = useState<
    {
      id: string
      imageUrl?: string
      status: string
      dateRescued: string
      location: string
    }[]
  >([])

  useEffect(() => {
    fetchTurtles()
  }, [])

  const fetchTurtles = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const turtlesRef = collection(db, "turtles")
      const q = query(turtlesRef, where("userId", "==", user.uid))
      const querySnapshot = await getDocs(q)

      const turtleList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as typeof turtles

      setTurtles(turtleList)
    } catch (error) {
      console.error("Error fetching turtles:", error)
    }
    setIsLoading(false)
  }

  const deleteTurtle = async (id: string) => {
    setTimeout(() => {
      Alert.alert(
        "Delete Turtle",
        "Are you sure you want to delete this turtle?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteDoc(doc(db, "turtles", id))
                setTurtles((prevTurtles) =>
                  prevTurtles.filter((turtle) => turtle.id !== id)
                )
              } catch (error) {
                console.error("Error deleting turtle:", error)
              }
            },
          },
        ]
      )
    }, 100)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
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
          <View style={styles.header}>
            <MyText
              textType="subtitle"
              textColor={MyColors.black}
              style={styles.title}
            >
              Rescued Turtles
            </MyText>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => router.push("/search-nav")}
            >
              <MyText
                textType="body"
                textColor={MyColors.black}
                style={styles.searchText}
              >
                Search
              </MyText>
              <Feather name="search" size={24} color={MyColors.black} />
            </TouchableOpacity>
          </View>
          <MyText
            textType="title"
            textColor={MyColors.black}
            style={styles.count}
          >
            {turtles.length}
          </MyText>
          <Card
            style={[
              styles.card,
              { alignItems: "center", justifyContent: "center", padding: 20 },
            ]}
            onPress={() => router.push("/create-turtle-nav")}
          >
            <IconButton icon="plus" size={40} />
            <MyText textType="body" textColor={MyColors.black}>
              Add Turtle
            </MyText>
          </Card>
          {turtles.map((turtle) => (
            <Card
              key={turtle.id}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/turtle/[id]",
                  params: { id: turtle.id },
                })
              }
            >
              <Card.Title
                title={`Rescued Turtle #${turtle.id}`}
                subtitle={`Status: ${turtle.status}`}
                left={(props) => (
                  <Avatar.Image
                    {...props}
                    source={{ uri: turtle.imageUrl }}
                    size={50}
                  />
                )}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="delete"
                    onPress={() => deleteTurtle(turtle.id)}
                  />
                )}
              />
              <Card.Content>
                <MyText textType="body" textColor={MyColors.black}>
                  <MyText textType="bodyBold" textColor={MyColors.black}>
                    Date Rescued:{" "}
                  </MyText>
                  {formatDate(turtle.dateRescued)}
                </MyText>
                <MyText textType="body" textColor={MyColors.black}>
                  <MyText textType="bodyBold" textColor={MyColors.black}>
                    Location:
                  </MyText>{" "}
                  {turtle.location}
                </MyText>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}
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
  header: {
    flexDirection: "row",
    gap: 50,
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
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
})
