import { createContext, useState, useContext } from "react"

type GlobalContextType = {
  currentCompoundID: string | null
  setCurrentCompoundID: React.Dispatch<React.SetStateAction<string | null>>
}

const GlobalContext = createContext<GlobalContextType>({
  currentCompoundID: null,
  setCurrentCompoundID: () => {},
})

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [currentCompoundID, setCurrentCompoundID] = useState<string | null>(
    null
  )

  return (
    <GlobalContext.Provider value={{ currentCompoundID, setCurrentCompoundID }}>
      {children}
    </GlobalContext.Provider>
  )
}

export function useGlobalContext() {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider")
  }

  return context
}
