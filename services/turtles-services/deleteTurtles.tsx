import { Alert } from "react-native"
import { deleteDoc, doc } from "firebase/firestore"
import { db } from "../../FirebaseConfig"

interface Turtle {
  id: string
  imageUrl?: string
  status: string
  dateRescued: string
  location: string
}

export const deleteTurtle = (
  id: string,
  setTurtles: (updateFn: (prevTurtles: Turtle[]) => Turtle[]) => void
) => {
  Alert.alert("Delete Turtle", "Are you sure you want to delete this turtle?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: async () => {
        try {
          await deleteDoc(doc(db, "turtles", id))
          setTurtles((prevTurtles) =>
            prevTurtles.filter((turtle) => turtle.id !== id)
          )
        } catch (error) {
          console.error("Error deleting turtle:", error)
          Alert.alert("Error", "Failed to delete the turtle. Please try again.")
        }
      },
    },
  ])
}
