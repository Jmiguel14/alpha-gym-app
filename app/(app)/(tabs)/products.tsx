import { ThemedText } from "../../../components/ThemedText";
import { ThemedView } from "../../../components/ThemedView";
import { useColorScheme } from "../../../hooks/useColorScheme.web";
import { useProducts } from "../../../hooks/useProducts";
import { useThemeColor } from "../../../hooks/useThemeColor";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { IconSymbol } from "../../../components/ui/IconSymbol";
import { Colors } from "../../../constants/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";
import { Product } from "../../../services/interfaces/product-interface";
import { ThemedTextInput } from "../../../components/ThemedTextInput";

const ProductItem = ({
  title,
  subtitle,
  id,
  onPress,
}: {
  title?: string;
  subtitle?: string;
  id?: number;
  onPress: () => void;
}) => {
  const backgroundColor = useThemeColor({}, "background");
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      style={[{ backgroundColor }, styles.item]}
      onPress={onPress}
    >
      <ThemedView>
        <IconSymbol
          size={28}
          name="production-quantity-limits"
          color={Colors[colorScheme ?? "light"].text}
        />
      </ThemedView>
      <ThemedView style={styles.itemContent}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.itemRight}>
        <IconSymbol name="arrow.right" size={24} color="white" />
      </ThemedView>
    </TouchableOpacity>
  );
};

export default function ProductsScreen() {
  const { products, loading, updateProduct, updatingProduct } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const backgroundColor = useThemeColor({}, "background");

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback((product: Product) => {
    bottomSheetModalRef.current?.present();
    setSelectedProduct(product);
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleChange = (key: keyof Product, value: string | number) => {
    setSelectedProduct({
      ...selectedProduct,
      [key]: value,
    });
  };

  const handleSave = () => {
    if (selectedProduct) {
      updateProduct(selectedProduct);
      bottomSheetModalRef.current?.close();
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <FlatList
          data={products}
          refreshing={loading}
          renderItem={({ item }) => (
            <ProductItem
              title={item.name}
              subtitle={item.description}
              id={item.id}
              onPress={() => handlePresentModalPress(item)}
            />
          )}
          keyExtractor={(item) => item?.id?.toString() || ""}
        />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          onChange={handleSheetChanges}
          snapPoints={["95%"]}
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
              <ThemedText>Editar producto</ThemedText>
              <ThemedText />
            </ThemedView>
          )}
          onDismiss={() => setSelectedProduct(null)}
        >
          <BottomSheetView style={styles.contentContainer}>
            <ThemedView style={styles.productItem}>
              <ThemedText style={styles.productItemDetail}>Nombre: </ThemedText>
              <ThemedTextInput
                onChangeText={(value) => handleChange("name", value)}
                value={selectedProduct?.name}
                style={styles.input}
                multiline
              />
            </ThemedView>
            <ThemedView style={styles.productItem}>
              <ThemedText style={styles.productItemDetail}>
                Precio de compra:{" "}
              </ThemedText>
              <ThemedTextInput
                onChangeText={(value) => handleChange("purchase_price", value)}
                value={selectedProduct?.purchase_price}
                style={styles.input}
              />
            </ThemedView>
            <ThemedView style={styles.productItem}>
              <ThemedText style={styles.productItemDetail}>
                Precio de venta:{" "}
              </ThemedText>
              <ThemedTextInput
                onChangeText={(value) => handleChange("sale_price", value)}
                value={selectedProduct?.sale_price}
                style={styles.input}
              />
            </ThemedView>
            <ThemedView style={styles.productItem}>
              <ThemedText style={styles.productItemDetail}>
                Descripción:{" "}
              </ThemedText>
              <ThemedTextInput
                onChangeText={(value) => handleChange("description", value)}
                value={selectedProduct?.description}
                style={styles.input}
                multiline
              />
            </ThemedView>
            <ThemedView style={styles.productItem}>
              <ThemedText style={styles.productItemDetail}>Stock: </ThemedText>
              <ThemedTextInput
                onChangeText={(value) => handleChange("quantity", value)}
                value={selectedProduct?.quantity?.toString()}
                style={styles.input}
              />
            </ThemedView>
            <ThemedView style={styles.actionView}>
              <TouchableOpacity
                style={styles.saveButton}
                disabled={updatingProduct}
                onPress={handleSave}
              >
                <ThemedText type="defaultSemiBold">
                  {updatingProduct ? "Guardando" : "Guardar"}
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
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
    alignItems: "flex-end",
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
