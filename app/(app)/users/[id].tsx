import { SafeAreaView, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useUser } from "@/hooks/useUser";
import { useLocalSearchParams } from "expo-router";

const UserShow = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, isLoading } = useUser(id);
  const currentLongStringMonth = new Intl.DateTimeFormat("es-ES", {
    month: "long",
  }).format(new Date());

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText>Nombre: </ThemedText>
        <ThemedText style={styles.title}>{user?.name}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.content}>
        <ThemedText>Email: </ThemedText>
        <ThemedText style={styles.subtitle}>{user?.email}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.content}>
        <ThemedText>Roles: </ThemedText>
        <ThemedText style={styles.subtitle}>
          {user?.roles.join(", ")}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.content}>
        <ThemedText>Comisión ({currentLongStringMonth}): </ThemedText>
        <ThemedText style={styles.subtitle}>{user?.commission}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.content}>
        <ThemedText>Ganancia neta de ventas ({currentLongStringMonth}): </ThemedText>
        <ThemedText style={styles.subtitle}>{user?.net_profit}</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    gap: 16,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
  },
});

export default UserShow;
