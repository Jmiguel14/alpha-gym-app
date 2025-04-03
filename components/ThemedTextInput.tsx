import { TextInput, TextInputProps } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedTextInput({ lightColor, darkColor, ...props }: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const style = props.style as any

  return <TextInput {...props} style={{ color, ...style }} />;
}
