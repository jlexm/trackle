import MyColors from "@/components/atoms/my-colors";
import { Tabs } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: MyColors.primary,
        tabBarStyle: {
          backgroundColor: MyColors.dark,
          borderTopColor: MyColors.primary,
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          headerTitle: "",
          headerStyle: {
            backgroundColor: MyColors.white,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          tabBarActiveTintColor: MyColors.black,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="home"
              size={24}
              color={focused ? MyColors.black : MyColors.white}
            />
          ),
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity onPress={() => {}}>
              <Feather
                name="settings"
                size={24}
                color={MyColors.black}
                style={{ marginRight: 15 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="scan-nav"
        options={{
          title: "Scan",
          tabBarActiveTintColor: MyColors.black,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={24}
              color={focused ? MyColors.black : MyColors.white}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="logs-nav"
        options={{
          tabBarLabel: "Logs",
          headerTitle: "",
          headerStyle: {
            backgroundColor: MyColors.white,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          tabBarActiveTintColor: MyColors.black,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="format-list-bulleted"
              size={24}
              color={focused ? MyColors.black : MyColors.white}
            />
          ),
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity onPress={() => {}}>
              <Feather
                name="settings"
                size={24}
                color={MyColors.black}
                style={{ marginRight: 15 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
