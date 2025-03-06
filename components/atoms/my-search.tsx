import { TextInput, View } from "react-native";

export default function MySearch() {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 65,
      }}
    >
      <TextInput
        placeholder="Search..."
        style={{
          flex: 1,
          height: 35,
          borderRadius: 10,
          backgroundColor: "#E5E5E5",
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
      />
    </View>
  );
}
