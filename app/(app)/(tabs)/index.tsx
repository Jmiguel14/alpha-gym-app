import { Image, StyleSheet } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={{
            uri: "https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-dd20-51f7-bc79-4f15f3881efa/raw?se=2025-03-30T03%3A54%3A49Z&sp=r&sv=2024-08-04&sr=b&scid=d8399266-5b0c-50a1-8b95-dd0a0f7b2074&skoid=365eb242-95ba-4335-a618-2c9f8f766a86&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-03-30T01%3A20%3A48Z&ske=2025-03-31T01%3A20%3A48Z&sks=b&skv=2024-08-04&sig=5IY6Wgri8WrPO3IKXU/tlFf0UTsfHh85gOSjXsWBA7c%3D",
          }}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Bienvenido!</ThemedText>
        <HelloWave />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
