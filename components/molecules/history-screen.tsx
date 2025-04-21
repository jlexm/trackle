import { useEffect, useState } from "react"
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import MyText from "../atoms/my-text"
import MyColors from "../atoms/my-colors"
import { useLocalSearchParams } from "expo-router"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "@/FirebaseConfig"
import { format } from "date-fns"

export default function HistoryScreen() {
  const { id } = useLocalSearchParams()
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyRef = collection(db, "turtles", id?.toString(), "history")
        const q = query(historyRef, orderBy("timestamp", "desc"))
        const snapshot = await getDocs(q)

        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setHistory(fetched)
      } catch (error) {
        console.error("Error fetching history:", error)
      }
    }

    if (id) fetchHistory()
  }, [id])

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <MyText textType="title" textColor="black">
            History
          </MyText>
          <MyText textType="subtitle" textColor="black">
            Turtle #{id}
          </MyText>
        </View>

        <View style={styles.cardContainer}>
          {history.length > 0 ? (
            history.map((entry) => (
              <View key={entry.id} style={styles.card}>
                <MyText
                  textType="caption"
                  textColor="gray"
                  style={styles.timestamp}
                >
                  {entry.timestamp
                    ? format(entry.timestamp.toDate(), "MMMM d, yyyy · h:mm a")
                    : "No timestamp"}
                </MyText>

                {Object.entries(entry.changes).map(
                  ([field, { from, to }]: any) => (
                    <View key={field} style={styles.changeRow}>
                      <MyText
                        textType="body"
                        textColor="black"
                        style={styles.fieldLabel}
                      >
                        {field.charAt(0).toUpperCase() + field.slice(1)}:
                      </MyText>
                      <Text style={styles.changeText}>
                        <Text style={styles.fromTo}>{from}</Text>
                        {"  →  "}
                        <Text style={styles.fromTo}>{to}</Text>
                      </Text>
                    </View>
                  )
                )}
              </View>
            ))
          ) : (
            <View style={styles.card}>
              <MyText textType="body" textColor="gray">
                No history yet.
              </MyText>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: MyColors.white,
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  headerContainer: {
    paddingTop: 30,
    marginBottom: 20,
    alignItems: "center",
  },
  cardContainer: {
    gap: 16,
  },
  card: {
    width: "100%",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
    shadowColor: "#000",
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  timestamp: {
    marginBottom: 12,
    fontSize: 16,
  },
  changeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 6,
  },
  fieldLabel: {
    marginRight: 4,
    fontWeight: "600",
  },
  changeText: {
    fontSize: 14,
    color: "#374151",
  },
  fromTo: {
    fontWeight: "600",
    color: "#111827",
  },
})
