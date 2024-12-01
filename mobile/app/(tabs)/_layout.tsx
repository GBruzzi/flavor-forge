import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CadastroScreen from './index';
import LoginScreen from './Login';
import DashboardScreen from '../dashboard/index';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

const Layout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true); 
      } else {
        setIsAuthenticated(false); 
      }
    };
    checkAuth();
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Cadastro" component={CadastroScreen} />
      <Tab.Screen name="Login" component={LoginScreen} />
      {isAuthenticated && <Tab.Screen name="Dashboard" component={DashboardScreen} />}
    </Tab.Navigator>
  );
};

export default Layout;
