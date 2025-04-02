import {
  TextInput,
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  KeyboardTypeOptions,
} from "react-native"
import { useFonts, Ubuntu_300Light } from "@expo-google-fonts/ubuntu"
import MyColors from "./my-colors"
import React, { useState } from "react"
import Ionicons from "@expo/vector-icons/Ionicons"

type MyInputFormProps = {
  label: string
  icon?: keyof typeof Ionicons.glyphMap
  iconSize?: number
  width?: number
  height?: number
  fontSize?: number
  fontColor?: string
  style?: ViewStyle
  secureTextEntry?: boolean
  onChange?: (text: string) => void
  value?: string
  editable?: boolean
  keyboardType?: KeyboardTypeOptions
}

export default function MyInputForm({
  label,
  icon,
  iconSize = 24,
  width = 300,
  height = 40,
  fontSize = 16,
  fontColor = MyColors.dark,
  style,
  secureTextEntry = false,
  onChange,
  value,
  editable = true,
  keyboardType = "default",
}: MyInputFormProps) {
  const [fontsLoaded] = useFonts({ Ubuntu_300Light })
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry)

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { width, height }, style]}>
        <TextInput
          style={[
            styles.input,
            { fontSize, color: fontColor, fontFamily: "system" },
          ]}
          placeholder={label}
          placeholderTextColor={fontColor}
          secureTextEntry={!isPasswordVisible}
          editable={false}
        />
      </View>
    )
  }

  return (
    <View style={[styles.container, { width, height }, style]}>
      {icon && (
        <Ionicons
          name={icon}
          size={iconSize}
          color={fontColor}
          style={styles.icon}
        />
      )}
      <TextInput
        style={[styles.input, { fontSize, color: fontColor }]}
        placeholder={label}
        placeholderTextColor={MyColors.black}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        accessible
        accessibilityLabel={label}
        onChangeText={onChange}
        value={value}
        keyboardType={keyboardType}
        editable={editable}
      />
      {secureTextEntry && (
        <TouchableOpacity
          onPress={() => setIsPasswordVisible((prev) => !prev)}
          accessible
          accessibilityLabel={
            isPasswordVisible ? "Hide password" : "Show password"
          }
        >
          <Ionicons
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={iconSize}
            color={fontColor}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: MyColors.dark,
    borderRadius: 5,
    paddingHorizontal: 12,
    backgroundColor: MyColors.white,
  },
  input: {
    flex: 1,
    fontFamily: "Ubuntu_300Light",
    paddingVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
})
