import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../../ThemedText";
import { ThemedTextInput } from "../../ThemedTextInput";
import { ThemedView } from "../../ThemedView";
import { SaleDetail } from "../../../services/interfaces/sales-interface";
import { useState } from "react";
import SelectDropdown from "react-native-select-dropdown";
import { useThemeColor } from "../../../hooks/useThemeColor";
import { useProducts } from "../../../hooks/useProducts";
import { useSale } from "../../../hooks/useSale";

interface SaleDetailState extends Partial<SaleDetail> {
  product?: {
    id: number;
    label: string;
  };
}

interface SaleDetailFormProps {
  saleId: string;
  defaultSaleDetail?: SaleDetailState;
  productsOptions: Array<{ id: number; label: string }>;
}

function SaleDetailForm({
  defaultSaleDetail,
  productsOptions,
  saleId,
}: SaleDetailFormProps) {
  const [saleDetail, setSaleDetail] = useState<SaleDetailState | undefined>(
    defaultSaleDetail
  );
  const { updateSale } = useSale();

  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  const handleChange = (key: keyof SaleDetailState, value: string | number) => {
    setSaleDetail({
      ...saleDetail,
      [key]: value,
    });
  };

  const handleSave = () => {
    const { product, ...rest } = saleDetail || {};
    updateSale(
      saleId,
      {
        sale_details: [
          {
            ...rest,
          },
        ],
      },
      {
        onSuccess: () => {
          console.log("Sale detail updated successfully");
        },
      }
    );
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedView style={styles.productItem}>
        <ThemedText type="defaultSemiBold">Producto: </ThemedText>
        <SelectDropdown
          data={productsOptions}
          renderItem={(selectedItem) => (
            <ThemedView
              style={[
                {
                  borderBottomColor: textColor,
                },
                styles.renderItem,
              ]}
            >
              <ThemedText>{selectedItem?.label}</ThemedText>
            </ThemedView>
          )}
          onSelect={(selectedItem, index) => {
            handleChange("product_id", selectedItem?.id);
          }}
          renderButton={(selectedItem, isOpened) => (
            <ThemedView style={styles.dropdownButtonStyle}>
              <ThemedText>
                {selectedItem?.id ? selectedItem?.label : "Elija una opción"}
              </ThemedText>
            </ThemedView>
          )}
          dropdownStyle={{ ...styles.dropdownMenuStyle, backgroundColor }}
          defaultValue={saleDetail?.product}
        />
      </ThemedView>
      <ThemedView style={styles.productItem}>
        <ThemedText type="defaultSemiBold">Cantidad: </ThemedText>
        <ThemedTextInput
          onChangeText={(value) => handleChange("quantity", value)}
          value={saleDetail?.quantity?.toString() ?? ""}
          style={styles.input}
        />
      </ThemedView>
      <ThemedView style={styles.productItem}>
        <ThemedText type="defaultSemiBold">Precio unitario: </ThemedText>
        <ThemedTextInput
          onChangeText={(value) => handleChange("unit_price", value)}
          value={saleDetail?.unit_price ?? ""}
          style={styles.input}
        />
      </ThemedView>
      <ThemedView style={styles.productItem}>
        <ThemedText type="defaultSemiBold">Total: </ThemedText>
        <ThemedTextInput
          onChangeText={(value) => handleChange("total_price", value)}
          value={saleDetail?.total_price ?? ""}
          style={styles.input}
          multiline
        />
      </ThemedView>
      <ThemedView style={styles.actionView}>
        <TouchableOpacity
          style={styles.saveButton}
          // disabled={loading}
          onPress={handleSave}
        >
          <ThemedText type="defaultSemiBold">
            {false ? "Guardando" : "Guardar"}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
  renderItem: {
    padding: 10,
    borderBottomWidth: 1,
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

export default SaleDetailForm;
