import { FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../../../components/ThemedText";
import { ThemedView } from "../../../components/ThemedView";
import { useUsers } from "../../../hooks/useUsers";
import { useCallback, useRef } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { IconSymbol } from "../../../components/ui/IconSymbol";
import { Colors } from "../../../constants/Colors";
import { useThemeColor } from "../../../hooks/useThemeColor";
import { router } from "expo-router";
import { useColorScheme } from "../../../hooks/useColorScheme.web";

const UserItem = ({
  title,
  subtitle,
  userId,
}: {
  title: string;
  subtitle: string;
  userId: string;
}) => {
  const backgroundColor = useThemeColor({}, "background");
  const colorScheme = useColorScheme();

  const onPress = () => {
    router.push(`/users/${userId}`);
  };

  return (
    <TouchableOpacity
      style={[
        { backgroundColor: Colors[colorScheme ?? "light"].background },
        styles.item,
      ]}
      onPress={onPress}
    >
      <ThemedView>
        <IconSymbol
          size={28}
          name="person"
          color={Colors[colorScheme ?? "light"].text}
        />
      </ThemedView>
      <ThemedView style={styles.itemContent}>
        <ThemedText type="title">{title}</ThemedText>
        <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.itemRight}>
        <IconSymbol
          name="arrow.right"
          size={24}
          color={Colors[colorScheme ?? "light"].text}
        />
      </ThemedView>
    </TouchableOpacity>
  );
};

export default function UsersScreen() {
  const { users, isLoading } = useUsers();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { top } = useSafeAreaInsets();

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <ThemedView style={[{ top }, styles.container]}>
      <FlatList
        data={users}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <UserItem
            title={item.name}
            subtitle={item.roles.join(", ")}
            userId={item.id.toString()}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
  item: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 60,
    height: 60,
  },
  itemContent: {
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
  },
  itemRight: {
    alignItems: "flex-end",
  },
});
