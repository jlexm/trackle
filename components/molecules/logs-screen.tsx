import { useEffect, useState } from "react"
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import MyColors from "../atoms/my-colors"
import MyText from "../atoms/my-text"
import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { ActivityIndicator, Avatar, Card, IconButton } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { turtleData } from "@/data/turtleData" // 🔥 Import turtleData

export default function LogsScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timeoutId)
  }, [])

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
            {turtleData.length}
          </MyText>

          {turtleData.map((turtle) => (
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
                    source={{ uri: turtle.image }}
                    size={50}
                  />
                )}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="delete"
                    onPress={() => alert(`Delete ${turtle.id}`)}
                  />
                )}
              />
              <Card.Content>
                <MyText textType="body" textColor={MyColors.black}>
                  Date Rescued: {turtle.dateRescued}
                </MyText>
                <MyText textType="body" textColor={MyColors.black}>
                  Location: {turtle.locationRescued}
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
