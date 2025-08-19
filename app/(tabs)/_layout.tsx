import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const BottomTabNavigation = ({ activeTab = 'Home', onTabPress }) => {
  const tabs = [
    {
      id: 'Home',
      label: 'Home',
      icon: 'home',
      activeIcon: 'home',
    },
    {
      id: 'MyCart',
      label: 'My cart',
      icon: 'cart-outline',
      activeIcon: 'cart',
    },
    {
      id: 'Orders',
      label: 'Orders',
      icon: 'receipt-outline',
      activeIcon: 'receipt',
    },
    {
      id: 'Support',
      label: 'Support',
      icon: 'headset-outline',
      activeIcon: 'headset',
    },
    {
      id: 'Account',
      label: 'Account',
      icon: 'person-outline',
      activeIcon: 'person',
    },
  ];

  const handleTabPress = (tabId) => {
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
            { left: `${tabs.findIndex(tab => tab.id === activeTab) * 20}%` }
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
              <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                <Ionicons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={24}
                  color={isActive ? '#2E7D32' : '#9E9E9E'}
                />
              </View>
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// Screen Components
const HomeScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.screenTitle}>Home Screen</Text>
    <Text style={styles.screenText}>Welcome to the home screen!</Text>
  </View>
);

const MyCartScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.screenTitle}>My Cart</Text>
    <Text style={styles.screenText}>Your cart items will appear here.</Text>
  </View>
);

const OrdersScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.screenTitle}>Orders</Text>
    <Text style={styles.screenText}>Your order history will appear here.</Text>
  </View>
);

const SupportScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.screenTitle}>Support</Text>
    <Text style={styles.screenText}>Contact support for help.</Text>
  </View>
);

const AccountScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.screenTitle}>Account</Text>
    <Text style={styles.screenText}>Manage your account settings.</Text>
  </View>
);

// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState('Home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen />;
      case 'MyCart':
        return <MyCartScreen />;
      case 'Orders':
        return <OrdersScreen />;
      case 'Support':
        return <SupportScreen />;
      case 'Account':
        return <AccountScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.appContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Main content area */}
      <View style={styles.content}>
        {renderScreen()}
      </View>
      
      {/* Bottom navigation */}
      <BottomTabNavigation 
        activeTab={activeTab} 
        onTabPress={setActiveTab} 
      />
    </SafeAreaView>
  );
};

const { TouchableOpacity } = require('react-native');

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  screenText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  // Bottom Navigation Styles
  container: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  indicatorContainer: {
    height: 3,
    position: 'relative',
    marginBottom: 8,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: '20%',
    height: 3,
    backgroundColor: '#2E7D32',
    borderRadius: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    marginBottom: 4,
  },
  activeIconContainer: {
    
  },
  tabLabel: {
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '400',
  },
  activeTabLabel: {
    color: '#2E7D32',
    fontWeight: '500',
  },
});

export default App;