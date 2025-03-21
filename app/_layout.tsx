import MySearch from "@/components/atoms/my-search"
import { Stack } from "expo-router"
import { AuthProvider } from "@/components/auth/auth-context"

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="search-nav"
          options={{
            title: "",
            headerTransparent: true,
            headerTitle: () => <MySearch />,
            animation: "fade_from_bottom",
          }}
        />
        <Stack.Screen name="login-nav" options={{ headerShown: false }} />
        <Stack.Screen
          name="signup-nav"
          options={{
            title: "",
            headerTransparent: true,
            animation: "fade_from_bottom",
          }}
        />
        <Stack.Screen
          name="settings-nav"
          options={{
            title: "",
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="turtle/[id]"
          options={{ title: "", headerTransparent: true }}
        />
        <Stack.Screen
          name="create-turtle-nav"
          options={{ title: "", headerTransparent: true }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </AuthProvider>
  )
}
