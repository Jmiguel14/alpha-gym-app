import { StyleSheet, TextInput } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";

interface SearchProps {
  onChangeText: (text: string) => void;
  value: string;
  style?: object;
}

function Search({ onChangeText, value, style }: SearchProps) {
  const textColor = useThemeColor({}, "text");
  return (
    <TextInput
      placeholder="Buscar..."
      placeholderTextColor={textColor}
      onChangeText={onChangeText}
      value={value}
      style={[style, { color: textColor }, styles.input]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    paddingLeft: 8,
    margin: 10,
  },
});

export default Search;
