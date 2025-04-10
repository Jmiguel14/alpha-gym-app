import SelectDropdown from "react-native-select-dropdown";
import { SelectedSale, STATUS_OPTIONS, STATUS_OPTIONS_HASH, UserOption } from "../../../app/(app)/sales/[id]";
import { ThemedText } from "../../ThemedText";
import { ThemedTextInput } from "../../ThemedTextInput";
import { ThemedView } from "../../ThemedView";
import { useThemeColor } from "../../../hooks/useThemeColor";
import { StyleSheet, TouchableOpacity } from "react-native";

interface SaleFormProps {
  handleChange: (key: keyof SelectedSale, value: string | number) => void;
  handleSave: () => void;
  selectedSale: SelectedSale;
  usersOptions: UserOption[];
  loading: boolean;
}

function SaleForm({
  handleChange,
  handleSave,
  selectedSale,
  usersOptions,
  loading,
}: SaleFormProps) {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  return (
    <ThemedView style={{flex: 1}}>
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
                  borderBottomColor: textColor,
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
                {selectedItem?.id ? selectedItem?.label : "Elija una opción"}
              </ThemedText>
            </ThemedView>
          )}
          dropdownStyle={{ ...styles.dropdownMenuStyle, backgroundColor }}
          defaultValue={STATUS_OPTIONS_HASH[selectedSale?.status || "pending"]}
        />
      </ThemedView>
      <ThemedView style={styles.productItem}>
        <ThemedText type="defaultSemiBold">Vendedor: </ThemedText>
        <SelectDropdown
          data={usersOptions}
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
            handleChange("seller_id", selectedItem?.id);
          }}
          renderButton={(selectedItem, isOpened) => (
            <ThemedView style={styles.dropdownButtonStyle}>
              <ThemedText>
                {selectedItem?.id ? selectedItem?.label : "Elija una opción"}
              </ThemedText>
            </ThemedView>
          )}
          dropdownStyle={{ ...styles.dropdownMenuStyle, backgroundColor }}
          defaultValue={selectedSale?.seller}
        />
      </ThemedView>
      <ThemedView style={styles.actionView}>
        <TouchableOpacity
          style={styles.saveButton}
          disabled={loading}
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

export default SaleForm;
