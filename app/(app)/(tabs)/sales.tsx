import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useSales } from "@/hooks/useSales";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { Colors } from "../../../constants/Colors";
import { router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";
import SaleForm from "../../../components/Sales/Forms/SaleForm";
import { SelectedSale, STATUS_OPTIONS_HASH } from "../sales/[id]";
import { useUsers } from "../../../hooks/useUsers";
import { useSale } from "../../../hooks/useSale";

const SaleItem = ({
  title,
  subtitle,
  id,
  totalAmount,
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
  };

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
        <ThemedText type="title">{title}</ThemedText>
        <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.itemRight}>
        <ThemedText>${totalAmount}</ThemedText>
        <IconSymbol name="arrow.right" size={24} color="white" />
      </ThemedView>
    </TouchableOpacity>
  );
};

const INITIAL_SALE: SelectedSale = {
  id: 0,
  name: "",
  description: "",
  status: STATUS_OPTIONS_HASH.pending.id,
  total_amount: "0",
  seller: {
    id: 0,
    label: "",
  },
};

export default function SalesScreen() {
  const { sales, loading } = useSales();
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedSale, setSelectedSale] = useState<SelectedSale>(INITIAL_SALE);
  const { users, isLoading: isLoadingUsers } = useUsers();
  const { creating, createSale } = useSale();

  const usersOptions = users.map((user) => ({
    id: user.id,
    label: user.name,
  }));

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleChange = (key: keyof SelectedSale, value: string | number) => {
    setSelectedSale({
      ...selectedSale,
      [key]: value,
    });
  };

  const handleSave = () => {
    const { seller, ...rest } = selectedSale || {};
    createSale(
      { ...rest, client_id: 1 },
      { onSuccess: (sale) => router.push(`/sales/${sale.id}`) }
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <ThemedView style={styles.headAction}>
          <TouchableOpacity onPress={handlePresentModalPress}>
            <IconSymbol name="add" size={32} color={textColor} />
          </TouchableOpacity>
        </ThemedView>
        <ThemedView style={styles.headTitle}>
          <ThemedText type="title">Ventas</ThemedText>
        </ThemedView>
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
        <BottomSheetModal
          ref={bottomSheetModalRef}
          onChange={handleSheetChanges}
          snapPoints={["97%"]}
          backgroundStyle={{
            backgroundColor: backgroundColor,
          }}
          handleIndicatorStyle={{
            backgroundColor: Colors.dark.text,
          }}
          handleComponent={() => (
            <ThemedView style={styles.handle}>
              <TouchableOpacity
                style={styles.cancelText}
                onPress={() => {
                  bottomSheetModalRef.current?.dismiss();
                }}
              >
                <ThemedText>Cancelar</ThemedText>
              </TouchableOpacity>
              <ThemedText type="subtitle">Editar venta</ThemedText>
              <ThemedText />
            </ThemedView>
          )}
        >
          <BottomSheetView style={styles.contentContainer}>
            <SaleForm
              handleChange={handleChange}
              selectedSale={selectedSale}
              handleSave={handleSave}
              usersOptions={usersOptions}
              loading={creating}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headAction: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 12,
  },
  headTitle: {
    paddingInline: 24,
    paddingBlock: 12,
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
