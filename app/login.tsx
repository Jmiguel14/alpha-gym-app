import { Redirect, router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { ThemedView } from "../components/ThemedView";
import { ThemedText } from "../components/ThemedText";
import { ThemedTextInput } from "../components/ThemedTextInput";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { VALIDATION_MESSAGES } from "../constants/ValidationMessages";

interface LoginValues {
  email?: string;
  password?: string;
}

export default function LoginScreen() {
  const { session, login } = useAuth();

  const loginForm = useForm<LoginValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleOnPress = (data: LoginValues) => {
    login(data.email || "", data.password || "", {
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
          Inicio de sesión
        </ThemedText>
        <ThemedView style={{ marginBottom: 15 }}>
          <ThemedText style={{ marginBottom: 5 }}>Email</ThemedText>
          <ThemedTextInput
            name="email"
            control={loginForm.control}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            rules={{ required: VALIDATION_MESSAGES.required }}
          />
        </ThemedView>
        <ThemedView style={{ marginBottom: 15 }}>
          <ThemedText style={{ marginBottom: 5 }}>Contraseña</ThemedText>
          <ThemedTextInput
            name="password"
            control={loginForm.control}
            placeholder="********"
            secureTextEntry
            rules={{ required: VALIDATION_MESSAGES.required }}
          />
        </ThemedView>
        <Pressable
          style={styles.button}
          onPress={loginForm.handleSubmit(handleOnPress)}
        >
          <ThemedText style={{ color: "white", fontWeight: "bold" }}>
            Iniciar sesión
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
