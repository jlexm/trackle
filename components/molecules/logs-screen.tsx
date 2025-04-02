import { useEffect, useState } from "react"
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import MyColors from "../atoms/my-colors"
import MyText from "../atoms/my-text"
import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { ActivityIndicator, Avatar, Card, IconButton } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAuth } from "../auth/auth-context"
import { fetchTurtles } from "@/services/turtles-services/fetchTurtles"
import { deleteTurtle } from "@/services/turtles-services/deleteTurtles"
import { useGlobalContext } from "@/services/global-services/global-context"

export default function LogsScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { currentCompoundID: compoundId } = useGlobalContext()
  const { setCurrentCompoundID } = useGlobalContext()
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
    if (!user || !compoundId) return

    const unsubscribeTurtles = fetchTurtles(
      user.uid,
      compoundId,
      setTurtles,
      setIsLoading
    )

    return () => {
      if (unsubscribeTurtles) unsubscribeTurtles()
    }
  }, [user, compoundId])

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown Date"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "Invalid Date"
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const handleDeleteTurtle = async (turtleId: string) => {
    await deleteTurtle(turtleId, setTurtles)
    setTurtles((prev) => prev.filter((turtle) => turtle.id !== turtleId))
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
            style={styles.addCard}
            onPress={() => {
              setCurrentCompoundID(compoundId)
              router.push("/create-turtle-nav")
            }}
          >
            <IconButton icon="plus" size={40} />
            <MyText textType="body" textColor={MyColors.black}>
              Add Turtle
            </MyText>
          </Card>

          {turtles.length === 0 ? (
            <MyText textType="body" textColor={MyColors.black}>
              No rescued turtles found.
            </MyText>
          ) : (
            turtles.map((turtle) => (
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
                      source={{
                        uri:
                          turtle.imageUrl || "https://via.placeholder.com/50",
                      }}
                      size={50}
                    />
                  )}
                  right={(props) => (
                    <IconButton
                      {...props}
                      icon="delete"
                      onPress={() => handleDeleteTurtle(turtle.id)}
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
            ))
          )}
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
  addCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    width: 300,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: MyColors.black,
    backgroundColor: MyColors.primary,
    borderRadius: 10,
    elevation: 5,
  },
  card: {
    width: 300,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: MyColors.white,
    elevation: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
