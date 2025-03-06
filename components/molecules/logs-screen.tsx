import { useEffect, useState } from "react";

import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import MyColors from "../atoms/my-colors";
import MyText from "../atoms/my-text";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Avatar,
  Card,
  IconButton,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import MyButton from "../atoms/my-button";

export default function LogsScreen() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timeoutId = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timeoutId);
  }, []);
  const turtles = [
    {
      id: "1",
      name: "TURTLE 1",
      dateRescued: "2024-03-01",
      location: "Beach A",
      status: "Healthy",
      image:
        "https://media.australian.museum/media/dd/images/1600px-Green_Turtle_Chelonia_mydas_6133097542.width-1200.c1df197.jpg",
    },
    {
      id: "2",
      name: "TURTLE 2",
      dateRescued: "2024-03-02",
      location: "Beach B",
      status: "Injured",
      image:
        "https://www.fisheries.noaa.gov/s3//styles/full_width/s3/dam-migration/hawksbill_sea_turtle.jpg?itok=cxzcge8K",
    },
    {
      id: "3",
      name: "TURTLE 3",
      dateRescued: "2024-03-03",
      location: "Beach C",
      status: "Recovering",
      image:
        "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTmYR1WtV9uhDlhowwqK-TOUI0tX9jlhVWN7YO9ZaBemHkdskICPaVlTr1yBqPxrpLdJtwssyNoUjRQdQOe34LJBA",
    },
    {
      id: "4",
      name: "TURTLE 4",
      dateRescued: "2024-03-04",
      location: "Beach D",
      status: "Released",
      image:
        "https://www.boem.gov/sites/default/files/styles/max_width_600px/public/images/leatherback_turtle_photo_credit_noaa_fisheries.jpg?itok=i7yPTVpw",
    },
    {
      id: "5",
      name: "TURTLE 5",
      dateRescued: "2024-03-05",
      location: "Beach E",
      status: "Under Observation",
      image:
        "https://www.2fla.com/sites/default/files/loggerhead-001-adolfo-felix-BXN16VVFEio-unsplash.jpg",
    },
  ];

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
          {turtles.map((turtle) => (
            <Card
              key={turtle.id}
              style={styles.card}
              onPress={() => router.push(`./view/${turtle.id}`)}
            >
              <Card.Title
                title={turtle.name}
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
                    onPress={() => alert(turtle.status)}
                  />
                )}
              />
              <Card.Content>
                <MyText textType="body" textColor={MyColors.black}>
                  Date Rescued: {turtle.dateRescued}
                </MyText>
                <MyText textType="body" textColor={MyColors.black}>
                  Location: {turtle.location}
                </MyText>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
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
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
    position: "relative",
  },
  deleteButton: {
    position: "absolute",
    bottom: 50,
    left: 160,
    padding: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  add: {
    flexDirection: "row",
    alignItems: "center",
  },
});
