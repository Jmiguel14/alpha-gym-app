import { ThemedText } from "../../../components/ThemedText";
import { ThemedView } from "../../../components/ThemedView";
import { useUsers } from "../../../hooks/useUsers";

export default function UsersScreen() {
  const { users, isLoading } = useUsers();
  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <ThemedText>Users</ThemedText>
      {isLoading && <ThemedText>Loading...</ThemedText>}
      {users.map((user) => (
        <ThemedView key={user.id}>
          <ThemedText>Name: {user.name}</ThemedText>
          <ThemedText>Email: {user.email}</ThemedText>
          <ThemedText>Roles: {user.roles}</ThemedText>
          <ThemedText>Net Profit: {user.net_profit}</ThemedText>
          <ThemedText>Commission: {user.commission}</ThemedText>
        </ThemedView>
      ))}
    </ThemedView>
  );
}
