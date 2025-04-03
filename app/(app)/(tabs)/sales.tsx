import { StyleSheet, Image, Platform, TouchableOpacity, FlatList } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useSales } from '@/hooks/useSales';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Colors } from '../../../constants/Colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';

const SaleItem = ({
  title,
  subtitle,
  id,
  totalAmount
}: {
  title?: string;
  subtitle?: string;
  id?: number;
  totalAmount?: string;
}) => {
  const backgroundColor = useThemeColor({}, "background");
  const colorScheme = useColorScheme();

  const onPress = () => {
    router.push(`/sales/${id}`);
  }

  return (
    <TouchableOpacity
      style={[{ backgroundColor }, styles.item]}
      onPress={onPress}
    >
      <ThemedView>
        <IconSymbol
          size={28}
          name="sale"
          color={Colors[colorScheme ?? "light"].text}
        />
      </ThemedView>
      <ThemedView style={styles.itemContent}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.itemRight}>
        <ThemedText>${totalAmount}</ThemedText>
        <IconSymbol name="arrow.right" size={24} color="white" />
      </ThemedView>
    </TouchableOpacity>
  );
};

export default function SalesScreen() {
  const {sales, loading} = useSales()
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <FlatList
          data={sales}
          refreshing={loading}
          renderItem={({ item }) => (
            <SaleItem
              title={item.name || "N/A"}
              subtitle={item.description || "N/A"}
              totalAmount={item.total_amount}
              id={item.id}
            />
          )}
          keyExtractor={(item) => item?.id?.toString() || ""}
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
  },
  item: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: Colors.dark.background,
  },
  title: {
    fontSize: 32,
  },
  avatar: {
    width: 60,
    height: 60,
  },
  itemContent: {
    flex: 1,
    gap: 10,
  },
  subtitle: {
    fontSize: 16,
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    gap: 10,
  },
  productItem: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  productItemDetail: {
    fontSize: 14,
  },
  input: {
    width: 50,
  },
  handle: {
    padding: 16,
    alignItems: "center",
  },
  cancelText: {
    position: "absolute",
    left: 16,
  },
  actionView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  saveButton: {
    backgroundColor: "#008F39",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
});
