import {
  Button,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { useNavigation } from "expo-router";
import { Colors } from "../constants/Colors";
import { IconSymbol } from "./ui/IconSymbol";
import { useColorScheme } from "../hooks/useColorScheme.web";

function Header({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const handleOnBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView>
      <ThemedView
        style={[{ backgroundColor: Colors[colorScheme ?? "light"].background }, styles.root]}
      >
        <TouchableOpacity onPress={handleOnBack}>
          <IconSymbol
            name="arrow-back"
            size={24}
            color={Colors[colorScheme ?? "light"].text}
          />
        </TouchableOpacity>
        {children}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    height: 60,
  },
});

export default Header;
