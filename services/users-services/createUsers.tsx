import { auth, db } from "@/FirebaseConfig"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"

interface User {
  email: string
  password: string
  role: "admin" | "management" | "caretaker"
}

export const signUpUser = async (user: User) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      user.email,
      user.password
    )
    const uid = userCredential.user.uid

    await setDoc(doc(db, "users", uid), {
      email: user.email,
      role: user.role,
    })

    console.log("User registered successfully with role:", user.role)
  } catch (error) {
    console.error("Error signing up:", error)
  }
}
