import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LandingScreen from '../screens/LandingScreen';
import PermissionScreen from '../screens/PermissionScreen';
const Stack = createNativeStackNavigator();

const NavigationController = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Permission" component={PermissionScreen} />
    </Stack.Navigator>
  );
};

export default NavigationController;
