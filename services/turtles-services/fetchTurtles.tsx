import { doc, onSnapshot } from "firebase/firestore"
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

  const compoundRef = doc(db, "compounds", compoundId)

  const unsubscribe = onSnapshot(
    compoundRef,
    (docSnapshot) => {
      if (docSnapshot.exists()) {
        const compoundData = docSnapshot.data()

        const turtlesList = compoundData.turtles || []

        setTurtles(turtlesList)
      } else {
        setTurtles([])
      }

      setIsLoading(false)
    },
    (error) => {}
  )

  return unsubscribe
}
