import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../../ThemedText";
import { ThemedTextInput } from "../../ThemedTextInput";
import { ThemedView } from "../../ThemedView";
import { Product } from "../../../services/interfaces/product-interface";
import { ScrollView } from "react-native-gesture-handler";
import { useFormContext } from "react-hook-form";

interface ProductFormProps {
  handleSave: () => void;
  selectedProduct: Product | null;
  loading: boolean;
}

function ProductForm({
  loading,
  handleSave,
}: ProductFormProps) {
  const formStateMethods = useFormContext();

  return (
    <ScrollView>
      <ThemedView style={styles.productItem}>
        <ThemedText style={styles.productItemDetail}>Nombre: </ThemedText>
        <ThemedTextInput
          key="name"
          name="name"
          control={formStateMethods.control}
          style={styles.input}
          multiline
          rules={{ required: 'This is a required field' }}
        />
      </ThemedView>
      <ThemedView style={styles.productItem}>
        <ThemedText style={styles.productItemDetail}>
          Precio de compra:{" "}
        </ThemedText>
        <ThemedTextInput
          name="purchase_price"
          control={formStateMethods.control}
          style={styles.input}
          rules={{ required: 'This is a required field' }}
        />
      </ThemedView>
      <ThemedView style={styles.productItem}>
        <ThemedText style={styles.productItemDetail}>
          Precio de venta:{" "}
        </ThemedText>
        <ThemedTextInput
          name="sale_price"
          control={formStateMethods.control}
          style={styles.input}
          rules={{ required: 'This is a required field' }}
        />
      </ThemedView>
      <ThemedView style={styles.productItem}>
        <ThemedText style={styles.productItemDetail}>Descripción: </ThemedText>
        <ThemedTextInput
          name="description"
          control={formStateMethods.control}
          style={styles.input}
          multiline
          rules={{ required: 'This is a required field' }}
        />
      </ThemedView>
      <ThemedView style={styles.productItem}>
        <ThemedText style={styles.productItemDetail}>Stock: </ThemedText>
        <ThemedTextInput
          name="quantity"
          control={formStateMethods.control}
          style={styles.input}
          rules={{ required: 'This is a required field' }}
        />
      </ThemedView>
      <ThemedView style={styles.productItem}>
        <ThemedText style={styles.productItemDetail}>SKU: </ThemedText>
        <ThemedTextInput
          name="sku"
          control={formStateMethods.control}
          style={styles.input}
          rules={{ required: 'This is a required field' }}
        />
      </ThemedView>
      <ThemedView style={styles.actionView}>
        <TouchableOpacity
          style={styles.saveButton}
          disabled={loading}
          onPress={handleSave}
        >
          <ThemedText type="defaultSemiBold">
            {loading ? "Guardando" : "Guardar"}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
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
    flex: 1,
    fontSize: 14,
  },
  input: {
    width: 200,
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

export default ProductForm;
