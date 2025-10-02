import { Tabs } from "expo-router";
import { Platform, View } from "react-native";
import OrderTabIcon from "@/assets/svgs/OrderTabIcon";
import SupportTabIcon from "@/assets/svgs/SupportTabIcon";
import HometabIcon from "@/assets/svgs/HometabIcon";
import CartTabIcon from "@/assets/svgs/CartTabIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AccounTabBarIcon from "@/assets/svgs/AccounTabBarIcon";
import ActiveHomeTabBar from "@/assets/svgs/ActiveHomeTabBar";
import ActiveOrderTab from "@/assets/svgs/ActiveOrderTab";
import ActiveSupporticon from "@/assets/svgs/ActiveSupporticon";
import { useRouter } from "expo-router";

type TabIconWithBorderProps = {
  children: React.ReactNode;
  focused: boolean;
};

const TabIconWithBorder = ({ children, focused }: TabIconWithBorderProps) => {
  const router = useRouter();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const token = await AsyncStorage.getItem("accessToken");
  //     if (!token) {
  //       router.replace("/(auth)/onboarding"); 
  //     }
  //   };
  //   checkAuth();
  // }, []);

  return (
    <View style={{ alignItems: "center" }}>
      {focused && (
        <View
          style={{
            position: "absolute",
            top: -12,
            left: "50%",
            marginLeft: -29,
            width: 50,
            height: 3,
            backgroundColor: "#0C513F",
            borderRadius: 1.5,
          }}
        />
      )}
      {children}
    </View>
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0C513F",
        tabBarInactiveTintColor: "#929292",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          position: "absolute",
          borderTopWidth: 0,
          paddingTop: Platform.OS === "ios" ? 18 : 14,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          height: 75 + insets.bottom,
          borderTopRightRadius: 16,
          borderTopLeftRadius: 16,
          overflow: "hidden",
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: "UrbanistMedium",
          fontWeight: "500",
          marginTop: 4,
        },
        
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIconWithBorder focused={focused}>
              {!focused ? <HometabIcon /> : <ActiveHomeTabBar />}
            </TabIconWithBorder>
          ),
        }}
      />
      <Tabs.Screen
        name="Carts"
        options={{
          title: "My cart",
          tabBarIcon: ({ focused }) => (
            <TabIconWithBorder focused={focused}>
              <CartTabIcon
                fill={focused ? "#0C513F" : "none"}
                stroke={focused ? "none" : "#929292"}
              />
            </TabIconWithBorder>
          ),
        }}
      />
      <Tabs.Screen
        name="Orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ focused }) => (
            <TabIconWithBorder focused={focused}>
              {focused ? <ActiveOrderTab /> : <OrderTabIcon />}
            </TabIconWithBorder>
          ),
        }}
      />
      <Tabs.Screen
        name="Support"
        options={{
          title: "Support",
          tabBarIcon: ({ focused }) => (
            <TabIconWithBorder focused={focused}>
              {focused ? <ActiveSupporticon /> : <SupportTabIcon />}
            </TabIconWithBorder>
          ),
        }}
      />
      <Tabs.Screen
        name="Account"
        options={{
          title: "Account",
          tabBarIcon: ({ focused }) => (
            <TabIconWithBorder focused={focused}>
              <AccounTabBarIcon
                fill={focused ? "#0C513F" : "none"}
                stroke={focused ? "none" : "#929292"}
              />
            </TabIconWithBorder>
          ),
        }}
      />
    </Tabs>
  );
}
