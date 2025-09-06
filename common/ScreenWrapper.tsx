import React from "react";
import { SafeAreaView,  StatusBar, Platform, StyleSheet } from "react-native";

type ScreenWrapperProps = {
  children: React.ReactNode;
  style?: object;
};

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style }) => {
  const statusBarHeight = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

  return (
    <SafeAreaView style={[styles.container, { paddingTop: statusBarHeight }, style]}>
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
