import React from "react";
import { StyleSheet, StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenWrapperProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
};

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ 
  children, 
  style, 
  edges = ['top', 'left', 'right', "bottom"]
}) => {
  return (
    <SafeAreaView 
      style={[styles.container, style]}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF6F2",
  },
});

export default ScreenWrapper;