import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";
import {
  Control,
  FieldValues,
  RegisterOptions,
  useController,
} from "react-hook-form";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

export type ThemedTextInputProps = TextInputProps & {
  name: string;
  control: Control<FieldValues, any, FieldValues>;
  rules?:
    | Omit<
        RegisterOptions<FieldValues, string>,
        "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
      >
    | undefined;
  lightColor?: string;
  darkColor?: string;
};

export function ThemedTextInput({
  lightColor,
  darkColor,
  name,
  control,
  rules,
  ...props
}: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const controller = useController({ name, control, rules });
  const errorMessage = controller.fieldState.error?.message;

  return (
    <ThemedView>
      <TextInput
        {...props}
        placeholderTextColor={color}
        ref={controller.field.ref}
        onBlur={controller.field.onBlur}
        onChangeText={controller.field.onChange}
        value={controller.field.value}
        style={[
          { color, borderColor: errorMessage ? "#FF6F61" : color },
          props.style,
          style.input,
        ]}
      />
      {Boolean(errorMessage) && (
        <ThemedText type="default" style={style.errorText}>
          {errorMessage}
        </ThemedText>
      )}
    </ThemedView>
  );
}

const style = StyleSheet.create({
  input: {
    borderStyle: "solid",
    borderWidth: 1,
    padding: 10,
  },
  errorText: {
    color: "#FF6F61",
    paddingBlock: 5
  }
});
