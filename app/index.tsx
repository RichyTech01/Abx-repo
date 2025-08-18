import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";


export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      await new Promise((res) => setTimeout(res, 1000));
      const userIsVerified = true;
      setIsVerified(userIsVerified);
      setIsLoading(false);

      if (userIsVerified) {
        router.replace("/(screen)/(auth)/onboarding");
      } else {
        router.replace("/");
      }
    };

    checkUser();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        className="bg-black "
      >
        <ActivityIndicator size="large" />
        <Text>Checking user...</Text>
      </View>
    );
  }

  return null;
}
