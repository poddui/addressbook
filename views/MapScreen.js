import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, View ,Dimensions} from 'react-native';
import { API_KEY } from '@env';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen({route, navigation}) {

    const {address} = route.params;
    const [mapKey, setMapKey] = useState(1);
    const { width, height } = Dimensions.get('window');

    const initial = {
        latitude: 60.200692,
        longitude: 24.934302,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
    };

    const [region, setRegion] = useState(initial);
    const [fullAddress, setFullAddress] = useState('');

    useEffect(() => { fetchCoordinates(address); }, []);

    const fetchCoordinates = async (address) => {
        const url = `https://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY}&location=${address}`
        try {
            const response = await fetch(url);
            const data = await response.json();
            const location = data.results[0].locations[0];
            const {lat, lng} = location.latLng;
            setRegion({  ...region, latitude: lat, longitude: lng});
            setFullAddress(`${location.street} ${location.adminArea6} ${location.adminArea5}`);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={styles.container}>
            <MapView
                key={mapKey} 
                style={{ flex: 1, height: height, width: width }}
                region={region}
            >
                <Marker coordinate={region} title={fullAddress} />
            </MapView>
            <Button title="Save location" onPress={() => {
                navigation.navigate("Places", {fullAddress: fullAddress.trim()});
            }} />
            <StatusBar style='auto' />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: 350,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});