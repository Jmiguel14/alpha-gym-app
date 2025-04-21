import SelectDropdown from "react-native-select-dropdown";
import {
  ClientOptions,
  STATUS_OPTIONS,
  STATUS_OPTIONS_HASH,
  UserOption,
} from "../../../app/(app)/sales/[id]";
import { ThemedText } from "../../ThemedText";
import { ThemedTextInput } from "../../ThemedTextInput";
import { ThemedView } from "../../ThemedView";
import { useThemeColor } from "../../../hooks/useThemeColor";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Controller, useFormContext } from "react-hook-form";

interface SaleFormProps {
  handleSave: () => void;
  usersOptions: UserOption[];
  loading: boolean;
  clientsOptions: ClientOptions[];
}

function SaleForm({
  handleSave,
  usersOptions,
  loading,
  clientsOptions,
}: SaleFormProps) {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const formMethods = useFormContext();

  return (
    <ScrollView style={{ flex: 1 }}>
      <ThemedView style={styles.productItem}>
        <ThemedText type="defaultSemiBold">Nombre: </ThemedText>
        <ThemedTextInput
          name="name"
          control={formMethods.control}
          style={styles.input}
          multiline
          rules={{ required: "This is a required field" }}
        />
      </ThemedView>
      <ThemedView style={styles.productItem}>
        <ThemedText type="defaultSemiBold">Descripción: </ThemedText>
        <ThemedTextInput
          name="description"
          control={formMethods.control}
          style={styles.input}
          multiline
          rules={{ required: "This is a required field" }}
        />
      </ThemedView>
      <ThemedView style={styles.productItem}>
        <ThemedText type="defaultSemiBold">Estado: </ThemedText>
        <Controller
          name="status"
          render={({ field: { onBlur, onChange, ref, value } }) => (
            <SelectDropdown
              onBlur={onBlur}
              ref={ref}
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
                onChange(selectedItem.id);
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
              defaultValue={STATUS_OPTIONS_HASH[value || "pending"]}
            />
          )}
        />
      </ThemedView>
      <ThemedView style={styles.productItem}>
        <ThemedText type="defaultSemiBold">Cliente: </ThemedText>
        <Controller
          name="client_id"
          rules={{ required: "This is a required field" }}
          render={({ field: { onBlur, onChange, value, ref } }) => (
            <ThemedView>
              <SelectDropdown
                onBlur={onBlur}
                ref={ref}
                data={clientsOptions}
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
                defaultValue={clientsOptions.find((el) => el.id == value)}
              />
              {Boolean(formMethods.formState.errors.client_id?.message) && (
                <ThemedText style={styles.errorText}>
                  {formMethods?.formState?.errors?.client_id?.message?.toString()}
                </ThemedText>
              )}
            </ThemedView>
          )}
        />
      </ThemedView>
      <ThemedView style={styles.productItem}>
        <ThemedText type="defaultSemiBold">Vendedor: </ThemedText>
        <Controller
          name="seller_id"
          rules={{ required: "This is a required field" }}
          render={({ field: { onBlur, onChange, value, ref } }) => (
            <ThemedView>
              <SelectDropdown
                onBlur={onBlur}
                ref={ref}
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
                  onChange(selectedItem?.id);
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
                defaultValue={usersOptions.find((el) => el.id == value)}
              />
              {Boolean(formMethods.formState.errors.seller_id?.message) && (
                <ThemedText style={styles.errorText}>
                  {formMethods?.formState?.errors?.seller_id?.message?.toString()}
                </ThemedText>
              )}
            </ThemedView>
          )}
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
  input: {},
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
  errorText: {
    color: "#FF6F61",
    paddingBlock: 5
  }
});

export default SaleForm;
