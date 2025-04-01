import { collection, onSnapshot, query, where } from "firebase/firestore"
import { db } from "../../FirebaseConfig"

export const fetchTurtles = (
  userId: string,
  compoundId: string,
  setTurtles: Function,
  setIsLoading: Function
) => {
  if (!userId || !compoundId) {
    return
  }

  const turtlesRef = collection(db, "turtles")
  const q = query(turtlesRef, where("compoundID", "==", compoundId))

  const unsubscribe = onSnapshot(
    q,
    (docSnapshot) => {
      setTurtles(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      setIsLoading(false)
    },
    (error) => {}
  )

  return unsubscribe
}
