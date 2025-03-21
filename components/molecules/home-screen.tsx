import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from "react-native"
import { ActivityIndicator, Card, TouchableRipple } from "react-native-paper"
import MyColors from "../atoms/my-colors"
import MyText from "../atoms/my-text"
import { Feather } from "@expo/vector-icons"
import PagerView from "react-native-pager-view"
import { router } from "expo-router"
import { useAuth } from "../auth/auth-context"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../FirebaseConfig"

export default function Homescreen() {
  const { user } = useAuth()
  const username = user?.email ? user.email.split("@")[0] : "Guest"

  const { width } = useMemo(() => Dimensions.get("window"), [])
  const pagerRef = useRef<PagerView>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [turtles, setTurtles] = useState<{ id: string; imageUrl?: string }[]>(
    []
  )

  useEffect(() => {
    fetchTurtles()
  }, [])

  const fetchTurtles = async () => {
    setIsLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, "turtles"))
      const turtleList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setTurtles(turtleList)
    } catch (error) {
      console.error("Error fetching turtles:", error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prevPage) => {
        const nextPage = (prevPage + 1) % turtles.length
        pagerRef.current?.setPage(nextPage)
        return nextPage
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [turtles])

  const turtleTypes = [
    {
      title: "Green Turtle",
      image:
        "https://media.australian.museum/media/dd/images/1600px-Green_Turtle_Chelonia_mydas_6133097542.width-1200.c1df197.jpg",
    },
    {
      title: "Hawksbill Turtle",
      image:
        "https://www.fisheries.noaa.gov/s3//styles/full_width/s3/dam-migration/hawksbill_sea_turtle.jpg?itok=cxzcge8K",
    },
    {
      title: "Olive Ridley Turtle",
      image:
        "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTmYR1WtV9uhDlhowwqK-TOUI0tX9jlhVWN7YO9ZaBemHkdskICPaVlTr1yBqPxrpLdJtwssyNoUjRQdQOe34LJBA",
    },
    {
      title: "Leatherback Turtle",
      image:
        "https://www.boem.gov/sites/default/files/styles/max_width_600px/public/images/leatherback_turtle_photo_credit_noaa_fisheries.jpg?itok=i7yPTVpw",
    },
    {
      title: "Loggerhead Turtle",
      image:
        "https://www.2fla.com/sites/default/files/loggerhead-001-adolfo-felix-BXN16VVFEio-unsplash.jpg",
    },
  ]
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
          <View style={styles.greetingContainer}>
            <MyText textType="title" textColor={MyColors.black}>
              Hi,{" "}
              <MyText textType="title" textColor={MyColors.green}>
                {username}
              </MyText>
            </MyText>
          </View>

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

          <PagerView
            ref={pagerRef}
            style={[styles.pager, { width }]}
            initialPage={0}
            onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
          >
            {turtles.map(({ id, imageUrl }) => (
              <TouchableOpacity
                key={id}
                onPress={() =>
                  router.push({ pathname: "/turtle/[id]", params: { id } })
                }
              >
                <View style={styles.imageContainer}>
                  <Image source={{ uri: imageUrl }} style={styles.image} />
                </View>
              </TouchableOpacity>
            ))}
          </PagerView>

          <View style={styles.pagination}>
            {turtles.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      currentPage === index ? MyColors.black : MyColors.white,
                  },
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => router.push("/logs-nav")}
          >
            <MyText
              textType="body"
              textColor={MyColors.black}
              style={styles.viewAllText}
            >
              View All
            </MyText>
          </TouchableOpacity>
          <View style={styles.turtleTypes}>
            <MyText textType="subtitle" textColor={MyColors.black}>
              Types of turtles in the Philippines
            </MyText>
            <MyText
              textType="body"
              textColor={MyColors.black}
              style={{ marginTop: 10 }}
            >
              The Philippines is home to five sea turtle species and one native
              turtle species.
            </MyText>
          </View>

          <View style={styles.gridContainer}>
            {turtleTypes.map((item, index) => (
              <TouchableRipple
                key={index}
                onPress={() => alert(item.title)}
                borderless
                rippleColor="rgba(0, 0, 0, 0.2)"
                style={styles.cardWrapper}
              >
                <Card style={styles.card}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.cardImage}
                  />
                  <Card.Content>
                    <MyText
                      textType="body"
                      textColor={MyColors.black}
                      style={styles.cardTitle}
                    >
                      {item.title}
                    </MyText>
                  </Card.Content>
                </Card>
              </TouchableRipple>
            ))}
          </View>
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
  pager: {
    height: 200,
    marginBottom: 10,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: "90%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 20,
  },
  pagination: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: MyColors.black,
  },
  viewAllText: {
    fontSize: 14,
  },
  turtleTypes: {
    alignSelf: "stretch",
    alignItems: "flex-start",
  },
  ViewAll: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 25,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cardWrapper: {
    width: "48%",
    aspectRatio: 1,
    marginBottom: 10,
  },
  card: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: "70%",
  },
  cardTitle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  greetingContainer: {
    alignSelf: "stretch",
    marginBottom: 40,
  },
})
