/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ServiceScreen from './screens/ServiceScreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


interface Service {
  id: number;
  name: string;
  image_url: string;
  description: string;
}

type RootStackParamList = {
  Home: undefined;
  Service: { service: Service };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type ServiceScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Service'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="Service"
          component={ServiceScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
