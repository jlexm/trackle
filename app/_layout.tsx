import MySearch from "@/components/atoms/my-search";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="search-nav"
        options={{
          title: "",
          headerTransparent: true,
          headerTitle: () => <MySearch />,
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
