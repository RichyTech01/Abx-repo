import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

type CustomDropdownProps = {
  items: { label: string; value: string }[];
  placeholder?: string;
  value: string | null;
  setValue: (val: string | null) => void;
};

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  items,
  placeholder = "Select...",
  value,
  setValue,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      placeholder={placeholder}
      style={{
        borderColor: "#ccc",
        borderRadius: 10,
      }}
      dropDownContainerStyle={{
        borderColor: "#ccc",
      }}
    />
  );
};

export default CustomDropdown;
