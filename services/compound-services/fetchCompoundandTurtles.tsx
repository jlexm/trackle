import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore"
import { db } from "../../FirebaseConfig"

export const fetchCompoundIdAndTurtles = (
  userId: string,
  setCompoundId: Function,
  setTurtles: Function,
  setIsLoading: Function
) => {
  if (!userId) {
    return
  }
  const compoundsRef = collection(db, "compounds")
  const q = query(compoundsRef, where("members", "array-contains", userId))

  const unsubscribe = onSnapshot(
    q,
    async (querySnapshot) => {
      if (!querySnapshot.empty) {
        const compoundDoc = querySnapshot.docs[0]
        const compoundId = compoundDoc.id
        const compoundData = compoundDoc.data()

        setCompoundId(compoundId)

        const turtleIds = compoundData.turtles || []
        if (turtleIds.length === 0) {
          setTurtles([])
          setIsLoading(false)
          return
        }

        const turtlePromises = turtleIds.map(async (turtleId: string) => {
          const turtleRef = doc(db, "turtles", turtleId)
          const turtleSnap = await getDoc(turtleRef)
          if (turtleSnap.exists()) {
            return { id: turtleId, ...turtleSnap.data() }
          } else {
            return null
          }
        })

        const turtles = (await Promise.all(turtlePromises)).filter(Boolean)

        setTurtles(turtles)
      } else {
        setCompoundId(null)
        setTurtles([])
      }

      setIsLoading(false)
    },
    (error) => {
      setIsLoading(false)
    }
  )

  return unsubscribe
}
