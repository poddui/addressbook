import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from './views/MapScreen';
import PlacesScreen from './views/PlacesScreen';

const Stack = createNativeStackNavigator();

function PlacesScreenFunction({ navigation , route}) {
  return (
    <View style={styles.container}>
      <PlacesScreen
        navigation={navigation}
        route={route}>
      </PlacesScreen>
    </View>
  );
}

function MapScreenFunction({ navigation , route}) {
  return (
    <View style={styles.container}>
      <MapScreen
        navigation={navigation}
        route={route}>
      </MapScreen>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Places" component={PlacesScreenFunction} />
        <Stack.Screen name="Map" component={MapScreenFunction} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});