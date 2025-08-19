import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Account from "./Account";
import Carts from "./Carts";
import Home from "./Home";
import Orders from "./Orders";
import Support from "./Support";

type TabId = "Home" | "MyCart" | "Orders" | "Support" | "Account";

interface Tab {
  id: TabId;
  label: string;
  icon: string;
  activeIcon: string;
}

interface BottomTabNavigationProps {
  activeTab?: TabId;
  onTabPress?: (tabId: TabId) => void;
}

const tabs: Tab[] = [
  {
    id: "Home",
    label: "Home",
    icon: "home",
    activeIcon: "home",
  },
  {
    id: "MyCart",
    label: "My cart",
    icon: "cart-outline",
    activeIcon: "cart",
  },
  {
    id: "Orders",
    label: "Orders",
    icon: "receipt-outline",
    activeIcon: "receipt",
  },
  {
    id: "Support",
    label: "Support",
    icon: "headset-outline",
    activeIcon: "headset",
  },
  {
    id: "Account",
    label: "Account",
    icon: "person-outline",
    activeIcon: "person",
  },
];

const BottomTabNavigation: React.FC<BottomTabNavigationProps> = ({
  activeTab = "Home",
  onTabPress,
}) => {
  const handleTabPress = (tabId: TabId) => {
    if (onTabPress) {
      onTabPress(tabId);
    }
  };

  return (
    <View style={styles.container}>
      {/* Active tab indicator line */}
      <View style={styles.indicatorContainer}>
        <View
          style={[
            styles.indicator,
            { left: `${tabs.findIndex((tab) => tab.id === activeTab) * 20}%` },
          ]}
        />
      </View>

      {/* Tab items */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabItem}
              onPress={() => handleTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  isActive && styles.activeIconContainer,
                ]}
              >
                <Ionicons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={24}
                  color={isActive ? "#2E7D32" : "#9E9E9E"}
                />
              </View>
              <Text
                style={[styles.tabLabel, isActive && styles.activeTabLabel]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// Main App Component
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("Home");

  const renderScreen = () => {
    switch (activeTab) {
      case "Home":
        return <Home />;
      case "MyCart":
        return <Carts />;
      case "Orders":
        return <Orders />;
      case "Support":
        return <Support />;
      case "Account":
        return <Account />;
      default:
        return <Home />;
    }
  };

  return (
    <SafeAreaView style={styles.appContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Main content area */}
      <View style={styles.content}>{renderScreen()}</View>

      {/* Bottom navigation */}
      <BottomTabNavigation activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  container: {
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingHorizontal: 10,
  },
  indicatorContainer: {
    height: 3,
    position: "relative",
    marginBottom: 8,
  },
  indicator: {
    position: "absolute",
    top: 0,
    width: "20%",
    height: 3,
    backgroundColor: "#2E7D32",
    borderRadius: 2,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  iconContainer: {
    marginBottom: 4,
  },
  activeIconContainer: {},
  tabLabel: {
    fontSize: 12,
    color: "#9E9E9E",
    fontWeight: "400",
  },
  activeTabLabel: {
    color: "#2E7D32",
    fontWeight: "500",
  },
});

export default App;
