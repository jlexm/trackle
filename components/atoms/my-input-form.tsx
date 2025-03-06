import { TextInput, View, StyleSheet, TextStyle, ViewStyle, TouchableOpacity } from 'react-native';
import { useFonts, Ubuntu_300Light } from '@expo-google-fonts/ubuntu';
import MyColors from './my-colors';
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

type MyInputFormProps = {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  width?: number;
  height?: number;
  fontSize?: number;
  fontColor?: string;
  style?: TextStyle | ViewStyle;
  secureTextEntry?: boolean;
};

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
}: MyInputFormProps) {
  const [fontsLoaded] = useFonts({ Ubuntu_300Light });
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={[styles.container, { width, height }, style as ViewStyle]}>
      {icon && <Ionicons name={icon} size={iconSize} color={fontColor} style={styles.icon} />}
      <TextInput
        style={[styles.input, { fontSize, color: fontColor }]}
        placeholder={label}
        placeholderTextColor={MyColors.dark}
        secureTextEntry={!isPasswordVisible}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Ionicons
            name={isPasswordVisible ? 'eye' : 'eye-off'}
            size={iconSize}
            color={fontColor}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: MyColors.dark,
    borderRadius: 5,
    paddingHorizontal: 12,
    backgroundColor: MyColors.white,
  },
  input: {
    flex: 1,
    fontFamily: 'Ubuntu_300Light',
    paddingVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
});
