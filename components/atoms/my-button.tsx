import { TouchableOpacity, StyleSheet, Text } from "react-native"
import { useFonts, Ubuntu_500Medium } from "@expo-google-fonts/ubuntu"
import MyColors from "./my-colors"
import { MaterialCommunityIcons } from "@expo/vector-icons"

type MyButtonProps = {
  onPress: () => void
  buttonName: string
  buttonColor?: string
  icon?: keyof typeof MaterialCommunityIcons.glyphMap
  iconSize?: number
  width?: number
  height?: number
  fontSize?: number
  fontColor?: string
  style?: Object
  disabled?: boolean
}

export default function MyButton({
  onPress,
  buttonName,
  buttonColor = MyColors.primary,
  icon,
  iconSize = 24,
  width = 110,
  height = 40,
  fontSize = 16,
  fontColor = MyColors.dark,
  style,
  disabled = false,
}: MyButtonProps) {
  const [fontsLoaded] = useFonts({
    Ubuntu_500Medium,
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[
        styles.myButton,
        {
          backgroundColor: buttonColor,
          width,
          height,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={iconSize}
          color={fontColor}
          style={styles.icon}
        />
      )}
      <Text
        style={{ fontFamily: "Ubuntu_500Medium", fontSize, color: fontColor }}
      >
        {buttonName}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  myButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 5,
  },
})
