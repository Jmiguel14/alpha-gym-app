import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useProducts } from "@/hooks/useProducts";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  Button,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from "react";
import { Product } from "@/services/interfaces/product-interface";
import ProductForm from "@/components/Products/Forms/ProductForm";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { FormProvider, useForm } from "react-hook-form";

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
  const textColor = useThemeColor({}, "text");
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
        <ThemedText type="title">{title}</ThemedText>
        <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.itemRight}>
        <IconSymbol name="arrow.right" size={24} color={textColor} />
      </ThemedView>
    </TouchableOpacity>
  );
};

export default function ProductsScreen() {
  const { products, loading, updateProduct, updatingProduct, createProduct } =
    useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const formState = useForm<Product>({
    defaultValues: {
      name: "",
      purchase_price: "",
      sale_price: "",
      description: "",
      quantity: 0,
      sku: "",
    },
  });

  const backgroundColor = useThemeColor({}, "background");
  const { top } = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback((product: Product) => {
    bottomSheetModalRef.current?.present();
    formState.reset(product, { keepDefaultValues: true });
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleSave = (data: Product) => {
    const onSuccess = () => {
      bottomSheetModalRef.current?.close();
      formState.reset();
    };
    if (data.id === undefined) {
      createProduct(data, { onSuccess });
    } else {
      updateProduct(data, { onSuccess });
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <ThemedView
          style={{
            flex: 1,
            top,
            paddingBottom:
              Platform.OS == "android" || Platform.OS == "ios"
                ? tabBarHeight
                : 0,
          }}
        >
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
          <ThemedView style={styles.addProductButtonContainer}>
            <Button
              title="Agregar producto"
              onPress={() => bottomSheetModalRef.current?.present()}
            />
          </ThemedView>
        </ThemedView>
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
                  console.log({
                    defaultValues: formState.formState.defaultValues,
                  });
                  formState.reset();
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
            <FormProvider {...formState}>
              <ProductForm
                handleSave={formState.handleSubmit(handleSave)}
                loading={updatingProduct}
                selectedProduct={selectedProduct}
              />
            </FormProvider>
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
  addProductButtonContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
