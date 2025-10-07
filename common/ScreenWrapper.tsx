import React from "react";
import { StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenWrapperProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF6F2",
  },
});

export default ScreenWrapper;
