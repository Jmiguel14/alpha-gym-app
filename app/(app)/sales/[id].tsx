import { Button, FlatList, StyleSheet, TouchableOpacity } from "react-native";
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
import { useUsers } from "../../../hooks/useUsers";
import SaleForm from "../../../components/Sales/Forms/SaleForm";
import { useClients } from "../../../hooks/useClients";
import SaleDetailForm from "../../../components/Sales/Forms/SaleDetailForm";
import { useProducts } from "../../../hooks/useProducts";
import { FormProvider, useForm } from "react-hook-form";

export interface SelectedSale extends Partial<Omit<Sale, "seller" | "client">> {
  seller?: {
    id: number;
    label: string;
  };
  client?: {
    id: number;
    label: string;
  };
}

interface SelectOption {
  id: number;
  label: string;
}

export type UserOption = SelectOption;

export type ClientOptions = SelectOption;

export const STATUS_OPTIONS = [
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

export const STATUS_OPTIONS_HASH = {
  pending: STATUS_OPTIONS[0],
  paid: STATUS_OPTIONS[1],
  cancelled: STATUS_OPTIONS[2],
} as { [key: string]: (typeof STATUS_OPTIONS)[1] };

const SaleDetailItem = ({
  saleDetail,
  handlePresentSaleDetailModalPress,
}: {
  saleDetail: SaleDetail;
  handlePresentSaleDetailModalPress: () => void;
}) => {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      style={[
        {
          borderBottomColor: Colors[colorScheme ?? "light"].text,
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
        styles.item,
      ]}
      onPress={handlePresentSaleDetailModalPress}
    >
      <ThemedView>
        <IconSymbol
          size={28}
          name="production-quantity-limits"
          color={Colors[colorScheme ?? "light"].text}
        />
      </ThemedView>
      <ThemedView style={{ gap: 10 }}>
        <ThemedText type="subtitle">{saleDetail?.product?.name}</ThemedText>
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
  client: {
    id: 0,
    label: "",
  },
};

const SaleShow = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sale, loading, updateSale, updating } = useSale(id);
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const { clients } = useClients();
  const { users, isLoading: isLoadingUsers } = useUsers();
  const saleForm = useForm<SelectedSale>({
    defaultValues: {
      name: "",
      description: "",
      status: "pending",
      client: {
        id: 0,
        label: "",
      },
      seller: {
        id: 0,
        label: "",
      },
    },
  });

  const [selectedSaleDetailId, setSelectedSaleDetailId] = useState<
    number | null
  >(null);

  const colorScheme = useColorScheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const saleFileBottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    const { seller } = sale || {};
    const newSelectedSale = {
      ...sale,
      seller: {
        id: seller?.id || 0,
        label: seller?.name || "",
      },
      client: {
        id: sale?.client?.id || 0,
        label: sale?.client?.name || "",
      },
    };
    if (sale) {
      saleForm.reset(newSelectedSale, { keepDefaultValues: true });
    }
  }, [sale]);

  // callbacks
  const handlePresentSaleDetailModalPress = useCallback((id: number) => {
    setSelectedSaleDetailId(id);
    saleFileBottomSheetModalRef.current?.present();
  }, []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleSave = (data: SelectedSale) => {
    const { seller, client, ...rest } = data;
    updateSale(
      id,
      {
        ...rest,
      },
      {
        onSuccess: () => {
          bottomSheetModalRef.current?.dismiss();
          saleForm.reset();
        },
      }
    );
  };

  const usersOptions = users.map((user) => ({
    id: user.id,
    label: user.name,
  }));

  const clientsOptions = clients.map((client) => ({
    id: client.id,
    label: client.name,
  }));

  let selectedSaleDetail = sale?.sale_details.find(
    (saleDetail) => saleDetail.id === selectedSaleDetailId
  );

  const { products } = useProducts();

  const productsOptions = products.map((product) => ({
    id: product.id || 0,
    label: product.name || "",
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <ThemedView style={{ flex: 1 }}>
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
            renderItem={({ item }) => (
              <SaleDetailItem
                saleDetail={item}
                handlePresentSaleDetailModalPress={() =>
                  handlePresentSaleDetailModalPress(item.id)
                }
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
          <ThemedView style={styles.addProductButtonContainer}>
            <Button
              title="Agregar producto"
              onPress={() => saleFileBottomSheetModalRef.current?.present()}
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
            <FormProvider {...saleForm}>
              <SaleForm
                handleSave={saleForm.handleSubmit(handleSave)}
                usersOptions={usersOptions}
                clientsOptions={clientsOptions}
                loading={updating}
              />
            </FormProvider>
          </BottomSheetView>
        </BottomSheetModal>
        <BottomSheetModal
          ref={saleFileBottomSheetModalRef}
          snapPoints={["95%"]}
          backgroundStyle={{
            backgroundColor: backgroundColor,
          }}
          handleIndicatorStyle={{
            backgroundColor: textColor,
          }}
          handleComponent={() => (
            <ThemedView style={styles.handle}>
              <TouchableOpacity
                style={styles.cancelText}
                onPress={() => {
                  saleFileBottomSheetModalRef.current?.dismiss();
                  setSelectedSaleDetailId(null)
                }}
              >
                <ThemedText>Cancelar</ThemedText>
              </TouchableOpacity>
              <ThemedText type="subtitle">Detalle de venta</ThemedText>
              <ThemedText />
            </ThemedView>
          )}
        >
          <BottomSheetView style={styles.contentContainer}>
            <SaleDetailForm
              saleId={id}
              defaultSaleDetail={{
                ...selectedSaleDetail,
                product: {
                  id: selectedSaleDetail?.product?.id || 0,
                  label: selectedSaleDetail?.product?.name || "",
                },
              }}
              productsOptions={productsOptions}
              onSuccess={() => {
                saleFileBottomSheetModalRef.current?.dismiss();
                setSelectedSaleDetailId(null)
              }}
            />
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
  addProductButtonContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SaleShow;
