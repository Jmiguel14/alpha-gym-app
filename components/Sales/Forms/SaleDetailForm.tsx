import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../../ThemedText";
import { ThemedTextInput } from "../../ThemedTextInput";
import { ThemedView } from "../../ThemedView";
import { SaleDetail } from "../../../services/interfaces/sales-interface";
import SelectDropdown from "react-native-select-dropdown";
import { useThemeColor } from "../../../hooks/useThemeColor";
import { useSale } from "../../../hooks/useSale";
import { ScrollView } from "react-native-gesture-handler";
import { Controller, useForm } from "react-hook-form";

interface SaleDetailState extends Partial<Omit<SaleDetail, 'quantity'>> {
  quantity?: string;
  product?: {
    id: number;
    label: string;
  };
}

interface SaleDetailFormProps {
  saleId: string;
  defaultSaleDetail?: SaleDetailState;
  productsOptions: Array<{ id: number; label: string }>;
  onSuccess?: () => void;
}

const DEFAULT_INITIAL_VALUES = {
  product: {
    id: 0,
    label: "",
  },
  quantity: "0",
  unit_price: "",
  discount: "0",
  total_price: "",
}

function SaleDetailForm({
  defaultSaleDetail,
  productsOptions,
  saleId,
  onSuccess = () => {},
}: SaleDetailFormProps) {
  const saleDetailForm = useForm<SaleDetailState>({
    defaultValues: defaultSaleDetail || DEFAULT_INITIAL_VALUES,
  });
  const { updateSale, updating } = useSale();

  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  const handleSave = (data: SaleDetailState) => {
    const { product, ...rest } = data;
    updateSale(
      saleId,
      {
        sale_details: [
          {
            ...rest,
            quantity: parseInt(data.quantity || "0"),
          },
        ],
      },
      {
        onSuccess: () => {
          onSuccess();
        },
      }
    );
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <ThemedView style={styles.productItem}>
        <ThemedText type="defaultSemiBold">Producto: </ThemedText>
        <Controller
          name="product_id"
          control={saleDetailForm.control}
          render={({ field: { value, onBlur, onChange, ref } }) => (
            <SelectDropdown
              search
              ref={ref}
              onBlur={onBlur}
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
              onSelect={(selectedItem, _index) => {
                onChange(selectedItem?.id);
              }}
              renderButton={(selectedItem, _isOpened) => (
                <ThemedView style={styles.dropdownButtonStyle}>
                  <ThemedText>
                    {selectedItem?.id
                      ? selectedItem?.label
                      : "Elija una opción"}
                  </ThemedText>
                </ThemedView>
              )}
              dropdownStyle={{ ...styles.dropdownMenuStyle, backgroundColor }}
              defaultValue={productsOptions.find((el) => el.id == value)}
            />
          )}
        />
      </ThemedView>
      <ThemedView style={styles.productItem}>
        <ThemedText type="defaultSemiBold">Cantidad: </ThemedText>
        <ThemedTextInput
          name="quantity"
          control={saleDetailForm.control}
          style={styles.input}
        />
      </ThemedView>
      <ThemedView style={styles.productItem}>
        <ThemedText type="defaultSemiBold">Precio unitario: </ThemedText>
        <ThemedTextInput
          name="unit_price"
          control={saleDetailForm.control}
          style={styles.input}
        />
      </ThemedView>
      <ThemedView style={styles.productItem}>
        <ThemedText type="defaultSemiBold">Descuento: </ThemedText>
        <ThemedTextInput
          name="discount"
          control={saleDetailForm.control}
          style={styles.input}
        />
      </ThemedView>
      <ThemedView style={styles.productItem}>
        <ThemedText type="defaultSemiBold">Total: </ThemedText>
        <ThemedTextInput
          name="total_price"
          control={saleDetailForm.control}
          style={styles.input}
          multiline
        />
      </ThemedView>
      <ThemedView style={styles.actionView}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saleDetailForm.handleSubmit(handleSave)}
        >
          <ThemedText type="defaultSemiBold">
            {updating ? "Guardando" : "Guardar"}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  productItem: {
    paddingBlock: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {width: 200},
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
    position: "sticky",
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
