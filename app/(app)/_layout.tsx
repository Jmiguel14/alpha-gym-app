import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

export default function AppLayout() {
  const { session } = useAuth();

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
