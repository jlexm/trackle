import { createContext, useContext, useEffect, useState } from "react"
import { User, onAuthStateChanged, signOut } from "firebase/auth"
import { router } from "expo-router"
import { auth, db } from "@/FirebaseConfig"
import { doc, getDoc } from "firebase/firestore"

type AuthContextType = {
  user: User | null
  role: "admin" | "management" | "caretaker" | null
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<"admin" | "management" | "caretaker" | null>(
    null
  )

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
          setRole(userSnap.data().role)
        } else {
          setRole(null)
        }
      } else {
        setRole(null)
        router.replace("/login-nav")
      }
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    await signOut(auth)
    router.replace("/login-nav")
  }

  return (
    <AuthContext.Provider value={{ user, role, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
