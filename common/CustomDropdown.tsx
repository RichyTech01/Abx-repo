import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Item = {
  label: string;
  value: string;
};

type CustomDropdownProps = {
  label?: string;
  placeholder?: string;
  items: Item[];
  value: string | null;
  onChange: (val: string) => void;
};

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  placeholder = "Select...",
  items,
  value,
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  const selectedItem = items.find((i) => i.value === value);

  return (
    <View>
      {label && (
        <Text className="text-[14px] font-urbanist-medium leading-[20px] text-[#2D2220]">
          {label}
        </Text>
      )}

      {/* Main button */}
      <TouchableOpacity
        style={[
          styles.inputWrapper,
          { borderColor: isFocused ? "#0C513F" : "#F1EAE7" },
        ]}
        className="mt-[8px]"
        onPress={() => {
          setVisible(true);
          setIsFocused(true);
        }}
      >
        <Text
          style={[
            styles.text,
            { color: selectedItem ? "#2D2220" : "#929292" },
          ]}
        >
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Ionicons
          name={visible ? "chevron-up" : "chevron-down"}
          size={16}
          color="#929292"
        />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          className="shadow-sm"
          activeOpacity={1}
          onPress={() => {
            setVisible(false);
            setIsFocused(false);
          }}
        >
          <View style={styles.dropdown} className="mt-20">
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    onChange(item.value);
                    setVisible(false);
                    setIsFocused(false);
                  }}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    height: 45,
    justifyContent: "space-between",
  },
  text: {
    fontSize: 12,
    fontFamily: "Urbanist",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F1EAE7",
    maxHeight: 250,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemText: {
    fontSize: 14,
    color: "#2D2220",
  },
});

export default CustomDropdown;
