import { Redirect, router } from "expo-router";
import { GestureResponderEvent, Pressable, StyleSheet } from "react-native";
import { ThemedView } from "../components/ThemedView";
import { ThemedText } from "../components/ThemedText";
import { ThemedTextInput } from "../components/ThemedTextInput";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function LoginScreen() {
  const { session, login } = useAuth();

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (key: string, value: string) => {
    setFormState({
      ...formState,
      [key]: value,
    });
  };

  const handleOnPress = (event: GestureResponderEvent) => {
    login(formState.email, formState.password, {
      onSuccess: () => {
        router.replace("/");
      },
    });
  };

  if (session) {
    return <Redirect href="/" />;
  }

  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <ThemedView style={{ marginBottom: 20 }}>
        <ThemedText
          style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}
        >
          Login
        </ThemedText>
        <ThemedView style={{ marginBottom: 15 }}>
          <ThemedText style={{ marginBottom: 5 }}>Email</ThemedText>
          <ThemedTextInput
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formState.email}
            onChangeText={(value) => handleOnChange("email", value)}
          />
        </ThemedView>
        <ThemedView style={{ marginBottom: 15 }}>
          <ThemedText style={{ marginBottom: 5 }}>Password</ThemedText>
          <ThemedTextInput
            placeholder="********"
            secureTextEntry
            value={formState.password}
            onChangeText={(value) => handleOnChange("password", value)}
          />
        </ThemedView>
        <Pressable style={styles.button} onPress={handleOnPress}>
          <ThemedText style={{ color: "white", fontWeight: "bold" }}>
            Login
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#008F39",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
});
