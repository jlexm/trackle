import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "../../FirebaseConfig"

export const fetchCompoundId = (
  userId: string,
  setCompoundId: (id: string | null) => void
) => {
  if (!userId) return

  const compoundsRef = collection(db, "compounds")
  const q = query(compoundsRef, where("members", "array-contains", userId))

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      if (!querySnapshot.empty) {
        setCompoundId(querySnapshot.docs[0].id)
      } else {
        setCompoundId(null)
      }
    },
    (error) => {
      console.error("Error fetching compound ID:", error)
      setCompoundId(null)
    }
  )

  return unsubscribe
}
