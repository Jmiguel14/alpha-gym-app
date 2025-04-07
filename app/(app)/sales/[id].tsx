import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../../../components/ThemedText";
import { ThemedView } from "../../../components/ThemedView";
import { IconSymbol } from "../../../components/ui/IconSymbol";
import { Colors } from "../../../constants/Colors";
import { useColorScheme } from "../../../hooks/useColorScheme.web";
import { useSale } from "../../../hooks/useSale";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Sale, SaleDetail } from "../../../services/interfaces/sales-interface";
import Header from "../../../components/Header";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef, useState } from "react";
import { useThemeColor } from "../../../hooks/useThemeColor";
import { ThemedTextInput } from "../../../components/ThemedTextInput";
import SelectDropdown from "react-native-select-dropdown";

const STATUS_OPTIONS = [
  {
    id: "pending",
    label: "Pendiente",
  },
  {
    id: "paid",
    label: "Pagado",
  },
  {
    id: "cancelled",
    label: "Cancelado",
  },
];

const STATUS_OPTIONS_HASH = {
  pending: STATUS_OPTIONS[0],
  paid: STATUS_OPTIONS[1],
  cancelled: STATUS_OPTIONS[2]
} as {[key: string]: typeof STATUS_OPTIONS[1]}

const SaleDetailItem = ({ saleDetail }: { saleDetail: SaleDetail }) => {
  const colorScheme = useColorScheme();
  const handleOnPress = () => {};

  return (
    <TouchableOpacity
      style={[
        {
          borderBottomColor: Colors[colorScheme ?? "light"].text,
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
        styles.item,
      ]}
      onPress={handleOnPress}
    >
      <ThemedView>
        <IconSymbol
          size={28}
          name="production-quantity-limits"
          color={Colors[colorScheme ?? "light"].text}
        />
      </ThemedView>
      <ThemedView style={{ gap: 10 }}>
        <ThemedText type="subtitle">{saleDetail.product.name}</ThemedText>
        <ThemedText>
          {saleDetail.quantity} x ${saleDetail.unit_price}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.rightContent}>
        <ThemedText type="defaultSemiBold" style={{ color: "#008F39" }}>
          ${saleDetail.total_price}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
};

const SaleShow = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sale, loading, updateSale, updating } = useSale(id);
  const backgroundColor = useThemeColor({}, "background");

  const [selectedSale, setSelectedSale] = useState<Partial<Sale> | null>(null);

  const colorScheme = useColorScheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (sale) {
      setSelectedSale({
        ...sale,
      });
    }
  }, [sale]);

  console.log({selectedSale})

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleEditSale = () => {};

  const handleChange = (key: keyof Partial<Sale>, value: string | number) => {
    setSelectedSale({
      ...selectedSale,
      [key]: value,
    });
  };

  const handleSave = () => {
    updateSale(
      id,
      {
        ...selectedSale,
      },
      { onSuccess: bottomSheetModalRef.current?.dismiss }
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <Header>
          <ThemedText type="link" onPress={() => handlePresentModalPress()}>
            Editar
          </ThemedText>
        </Header>
        <ThemedView style={styles.head_container}>
          <IconSymbol
            size={64}
            name="person"
            color={Colors[colorScheme ?? "light"].text}
          />
          <ThemedText type="title">${sale?.total_amount}</ThemedText>
          <ThemedText>{sale?.seller.name}</ThemedText>
        </ThemedView>
        <ThemedView style={{ padding: 20, alignItems: "center" }}>
          <ThemedText type="subtitle">Productos</ThemedText>
        </ThemedView>
        <FlatList
          data={sale?.sale_details}
          refreshing={loading}
          renderItem={({ item }) => <SaleDetailItem saleDetail={item} />}
          keyExtractor={(item) => item.id.toString()}
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
            <ThemedView style={styles.productItem}>
              <ThemedText type="defaultSemiBold">Nombre: </ThemedText>
              <ThemedTextInput
                onChangeText={(value) => handleChange("name", value)}
                value={selectedSale?.name ?? ""}
                style={styles.input}
                multiline
              />
            </ThemedView>
            <ThemedView style={styles.productItem}>
              <ThemedText type="defaultSemiBold">Descripción: </ThemedText>
              <ThemedTextInput
                onChangeText={(value) => handleChange("description", value)}
                value={selectedSale?.description ?? ""}
                style={styles.input}
                multiline
              />
            </ThemedView>
            <ThemedView style={styles.productItem}>
              <ThemedText type="defaultSemiBold">Estado: </ThemedText>
              <SelectDropdown
                data={STATUS_OPTIONS}
                renderItem={(selectedItem) => (
                  <ThemedView
                    style={[
                      {
                        borderBottomColor: Colors[colorScheme ?? "light"].text,
                      },
                      styles.renderItem,
                    ]}
                  >
                    <ThemedText>{selectedItem?.label}</ThemedText>
                  </ThemedView>
                )}
                onSelect={(selectedItem, index) => {
                  handleChange("status", selectedItem?.id);
                }}
                renderButton={(selectedItem, isOpened) => (
                  <ThemedView style={styles.dropdownButtonStyle}>
                    <ThemedText>
                      {selectedItem?.id
                        ? selectedItem?.label
                        : "Elija una opción"}
                    </ThemedText>
                  </ThemedView>
                )}
                dropdownStyle={{ ...styles.dropdownMenuStyle, backgroundColor }}
                defaultValue={STATUS_OPTIONS_HASH[selectedSale?.status || 'pending']}
              />
            </ThemedView>
            <ThemedView style={styles.actionView}>
              <TouchableOpacity
                style={styles.saveButton}
                disabled={updating}
                onPress={handleSave}
              >
                <ThemedText type="defaultSemiBold">
                  {false ? "Guardando" : "Guardar"}
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  handle: {
    padding: 16,
    alignItems: "center",
  },
  cancelText: {
    position: "absolute",
    left: 16,
  },
  head_container: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  item: {
    flexDirection: "row",
    gap: 10,
    padding: 10,
    borderBottomWidth: 1,
  },
  rightContent: { flex: 1, alignItems: "flex-end" },
  contentContainer: {
    flex: 1,
    padding: 24,
  },
  productItem: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  input: {
    width: "50%",
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
  dropdownButtonStyle: {
    width: 200,
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownMenuStyle: {
    borderRadius: 8,
  },
  renderItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
});

export default SaleShow;
