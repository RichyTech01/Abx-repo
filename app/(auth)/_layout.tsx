import { Stack } from "expo-router";

export default function AuthLayout() {

  return (
    <Stack screenOptions={{ headerShown: false }} >
      {/* <Stack.Screen name="Login" /> */}
      <Stack.Screen name="CreatenewPassWord" />
      <Stack.Screen name="CreateAccount" />
    </Stack>
  );
}
