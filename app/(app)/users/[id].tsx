import { SafeAreaView, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useUser } from "@/hooks/useUser";
import { useLocalSearchParams } from "expo-router";
import SelectDropdown from "react-native-select-dropdown";
import { useThemeColor } from "../../../hooks/useThemeColor";
import { useState } from "react";
import DatePicker from "react-native-date-picker";

const MONTHS = [
  { id: "1", label: "Enero" },
  { id: "2", label: "Febrero" },
  { id: "3", label: "Marzo" },
  { id: "4", label: "Abril" },
  { id: "5", label: "Mayo" },
  { id: "6", label: "Junio" },
  { id: "7", label: "Julio" },
  { id: "8", label: "Agosto" },
  { id: "9", label: "Septiembre" },
  { id: "10", label: "Octubre" },
  { id: "11", label: "Noviembre" },
  { id: "12", label: "Diciembre" },
];

const UserShow = () => {
  const [date, setDate] = useState<Date>(new Date());
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, isLoading } = useUser(id, date.toISOString());
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const currentLongStringMonth = new Intl.DateTimeFormat("es-ES", {
    month: "long",
  }).format(date);

  console.log({date})

  const onChangeMonth = (month: string) => {
    const newDate = new Date();
    newDate.setMonth(parseInt(month) - 1);
    setDate(newDate);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText>Nombre: </ThemedText>
        <ThemedText style={styles.title}>{user?.name}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.content}>
        <ThemedText>Email: </ThemedText>
        <ThemedText style={styles.subtitle}>{user?.email}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.content}>
        <ThemedText>Roles: </ThemedText>
        <ThemedText style={styles.subtitle}>
          {user?.roles.join(", ")}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.content}>
        <ThemedText>Comisión ({currentLongStringMonth}): </ThemedText>
        <ThemedText style={styles.subtitle}>{user?.commission}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.content}>
        <ThemedText>
          Ganancia neta de ventas ({currentLongStringMonth}):{" "}
        </ThemedText>
        <ThemedText style={styles.subtitle}>{user?.net_profit}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.content}>
        <ThemedText type="defaultSemiBold">Fecha: </ThemedText>
        <DatePicker date={date} onDateChange={setDate} mode="date" modal/>
      </ThemedView>
      <ThemedView style={[{display: 'none'}, styles.content]}>
        <ThemedText>
          Escoger mes
        </ThemedText>
        <SelectDropdown
          data={MONTHS}
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
            onChangeMonth(selectedItem?.id);
          }}
          renderButton={(selectedItem, _isOpened) => (
            <ThemedView style={styles.dropdownButtonStyle}>
              <ThemedText>
                {selectedItem?.id ? selectedItem?.label : "Elija una opción"}
              </ThemedText>
            </ThemedView>
          )}
          dropdownStyle={{ ...styles.dropdownMenuStyle, backgroundColor }}
          defaultValue={MONTHS.find((el) => el.id == (date.getMonth() + 1).toString())}
        />
      </ThemedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    gap: 16,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
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
});

export default UserShow;
