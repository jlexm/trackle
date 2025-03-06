import React from "react";
import { Text } from "react-native";
import {
  useFonts,
  Ubuntu_300Light,
  Ubuntu_400Regular,
  Ubuntu_500Medium,
  Ubuntu_700Bold,
} from "@expo-google-fonts/ubuntu";

const textStyles = {
  title: {
    fontSize: 30,
    fontFamily: "Ubuntu_700Bold",
  },
  subtitle: {
    fontSize: 22,
    fontFamily: "Ubuntu_500Medium",
  },
  caption: {
    fontSize: 18,
    fontFamily: "Ubuntu_400Regular",
  },
  body: {
    fontSize: 14,
    fontFamily: "Ubuntu_300Light",
  },
};

type MyTextProps = {
  textType: keyof typeof textStyles;
  textColor?: string;
  style?: Object;
  children: React.ReactNode;
};
9;
export default function MyText({
  textType,
  textColor = "#F5F5F5",
  style,
  children,
}: MyTextProps) {
  const [fontsLoaded] = useFonts({
    Ubuntu_300Light,
    Ubuntu_400Regular,
    Ubuntu_500Medium,
    Ubuntu_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Text style={[textStyles[textType], { color: textColor }, style]}>
      {children}
    </Text>
  );
}
