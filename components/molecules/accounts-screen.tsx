import { useEffect, useState } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import MyText from "../atoms/my-text"
import { ActivityIndicator, Card } from "react-native-paper"
import MyColors from "../atoms/my-colors"
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore"
import { db } from "@/FirebaseConfig"
import { useAuth } from "../auth/auth-context"

export default function AccountsScreen() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [compounds, setCompounds] = useState<
    { id: string; name: string; members: { email: string }[] }[]
  >([])

  useEffect(() => {
    if (!user) return

    const fetchCompoundsWithMembers = async () => {
      setIsLoading(true)
      try {
        // Fetch compounds owned by the user
        const compoundQuery = query(
          collection(db, "compounds"),
          where("userId", "==", user.uid)
        )
        const compoundSnapshot = await getDocs(compoundQuery)

        const compoundData = await Promise.all(
          compoundSnapshot.docs.map(async (compoundDoc) => {
            const compoundId = compoundDoc.id
            const compoundName =
              compoundDoc.data().compoundName || "Unnamed Compound"
            const membersUIDs: string[] = compoundDoc.data().members || []

            // Fetch members' details
            const members = await Promise.all(
              membersUIDs.map(async (uid) => {
                const userRef = doc(db, "users", uid)
                const userSnap = await getDoc(userRef)
                return userSnap.exists()
                  ? { email: userSnap.data().email || "Unknown Email" }
                  : { email: "Unknown Email" }
              })
            )

            return { id: compoundId, name: compoundName, members }
          })
        )

        setCompounds(compoundData)
      } catch (error) {
        console.error("Error fetching compounds and members:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompoundsWithMembers()
  }, [user])

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
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
          <View style={styles.innerContainer}>
            <MyText textType="title" style={styles.title}>
              Accounts
            </MyText>
            <MyText textType="body" style={styles.subtitle}>
              Manage your compounds and members.
            </MyText>

            {compounds.length > 0 ? (
              compounds.map((compound) => (
                <Card key={compound.id} style={styles.card}>
                  <Card.Content>
                    <MyText textType="bodyBold" style={styles.compoundTitle}>
                      {compound.name}
                    </MyText>
                    {compound.members.length > 0 ? (
                      compound.members.map((member, index) => (
                        <MyText key={index} textType="body">
                          {member.email}
                        </MyText>
                      ))
                    ) : (
                      <MyText textType="body" style={styles.noUsersText}>
                        No members in this compound.
                      </MyText>
                    )}
                  </Card.Content>
                </Card>
              ))
            ) : (
              <MyText textType="body" style={styles.noUsersText}>
                You don't own any compounds.
              </MyText>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: MyColors.white,
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  innerContainer: {
    alignItems: "center",
    width: "100%",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: MyColors.dark,
    marginBottom: 20,
  },
  card: {
    width: "90%",
    marginBottom: 10,
    padding: 10,
    backgroundColor: MyColors.dark,
    borderRadius: 8,
    elevation: 5,
  },
  compoundTitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  noUsersText: {
    marginTop: 10,
    fontSize: 14,
    color: MyColors.dark,
  },
})
