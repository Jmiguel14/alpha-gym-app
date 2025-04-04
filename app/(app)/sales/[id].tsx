import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "../../../components/ThemedText";
import { ThemedView } from "../../../components/ThemedView";
import { IconSymbol } from "../../../components/ui/IconSymbol";
import { Colors } from "../../../constants/Colors";
import { useColorScheme } from "../../../hooks/useColorScheme.web";
import { useSale } from "../../../hooks/useSale";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { SaleDetail } from "../../../services/interfaces/sales-interface";
import Header from "../../../components/Header";

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
  const { sale, loading } = useSale(id);
  const colorScheme = useColorScheme();

  const handleEditSale = () => {

  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header>
        <ThemedText type="link" onPress={handleEditSale}>Editar</ThemedText>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
});

export default SaleShow;
