import { StyleSheet, TouchableOpacity, FlatList } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useSales } from "@/hooks/useSales";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { Colors } from "../../../constants/Colors";
import { router } from "expo-router";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";
import SaleForm from "../../../components/Sales/Forms/SaleForm";
import { SelectedSale, STATUS_OPTIONS_HASH } from "../sales/[id]";
import { useUsers } from "../../../hooks/useUsers";
import { useSale } from "../../../hooks/useSale";
import { useClients } from "../../../hooks/useClients";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FormProvider, useForm } from "react-hook-form";
import { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import Search from "../../../components/Search";

interface RightActionProps {
  prog: SharedValue<number>;
  drag: SharedValue<number>;
  rowId: number;
}

function RightAction({ prog, drag, rowId }: RightActionProps) {
  const { deleteSale } = useSale();
  const styleAnimation = useAnimatedStyle(() => {
    console.log("showRightProgress:", prog.value);
    console.log("appliedTranslation:", drag.value);

    return {
      transform: [{ translateX: drag.value + 50 }],
    };
  });

  const handleDeleteRow = () => {
    deleteSale(rowId);
  }

  return (
    <ThemedView
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "red",
        },
        styleAnimation,
      ]}
    >
      <TouchableOpacity
        style={{ width: 70, justifyContent: "center", alignItems: "center" }}
        onPress={handleDeleteRow}
      >
        <ThemedText style={{ textAlign: "center" }}>
          <IconSymbol
            name="delete"
            size={32}
            color="white"
            style={{
              height: "100%",
              width: 70,
            }}
          />
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const SaleItem = ({
  title,
  subtitle,
  id,
  totalAmount,
}: {
  title?: string;
  subtitle?: string;
  id: number;
  totalAmount?: string;
}) => {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const colorScheme = useColorScheme();

  const onPress = () => {
    router.push(`/sales/${id}`);
  };

  return (
    <Swipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={60}
      renderRightActions={(prog, drag) =>
        RightAction({ prog, drag, rowId: id })
      }
      touchAction="pan-y"
    >
      <TouchableOpacity
        style={[{ backgroundColor }, styles.item]}
        onPress={onPress}
      >
        <ThemedView>
          <IconSymbol
            size={28}
            name="sale"
            color={Colors[colorScheme ?? "light"].text}
          />
        </ThemedView>
        <ThemedView style={styles.itemContent}>
          <ThemedText type="title">{title}</ThemedText>
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.itemRight}>
          <ThemedText>${totalAmount}</ThemedText>
          <IconSymbol name="arrow.right" size={24} color={textColor} />
        </ThemedView>
      </TouchableOpacity>
    </Swipeable>
  );
};

const INITIAL_SALE: SelectedSale = {
  id: 0,
  name: "",
  description: "",
  status: STATUS_OPTIONS_HASH.pending.id,
  total_amount: "0",
  date: new Date(),
  seller: {
    id: 0,
    label: "",
  },
  client: {
    id: 0,
    label: "",
  },
};

export default function SalesScreen() {
  const { sales, loading, searchText, setSearchText } = useSales();
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { users, isLoading: isLoadingUsers } = useUsers();
  const { creating, createSale } = useSale();
  const { clients } = useClients();
  const { top } = useSafeAreaInsets();
  const saleForm = useForm<SelectedSale>({
    defaultValues: INITIAL_SALE,
  });

  const usersOptions = users.map((user) => ({
    id: user.id,
    label: user.name,
  }));

  const clientsOptions = clients.map((client) => ({
    id: client.id,
    label: client.name,
  }));

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleSave = (data: SelectedSale) => {
    const { seller, client, ...rest } = data;
    createSale(
      { ...rest, date: rest.date?.toISOString() },
      { onSuccess: (sale) => router.push(`/sales/${sale.id}`) }
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <ThemedView style={{ flex: 1, top }}>
          <ThemedView style={styles.headAction}>
          <Search onChangeText={setSearchText} value={searchText} />
            <TouchableOpacity onPress={handlePresentModalPress}>
              <IconSymbol name="add" size={32} color={textColor} />
            </TouchableOpacity>
          </ThemedView>
          <ThemedView style={styles.headTitle}>
            <ThemedText type="title">Ventas</ThemedText>
          </ThemedView>
          <FlatList
            data={sales}
            scrollEnabled
            refreshing={loading}
            renderItem={({ item }) => (
              <SaleItem
                title={item.name || "N/A"}
                subtitle={item.description || "N/A"}
                totalAmount={item.total_amount}
                id={item.id}
              />
            )}
            keyExtractor={(item) => item?.id?.toString() || ""}
          />
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
              <ThemedText type="subtitle">Crear venta</ThemedText>
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
                loading={creating}
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
  headAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingInline: 12,
  },
  headTitle: {
    paddingInline: 24,
    paddingBlock: 12,
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
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    gap: 10,
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
