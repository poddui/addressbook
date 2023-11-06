import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Alert} from 'react-native';
import { Input} from "@rneui/base";
import {
    ListItem,
    Button,
    } from '@rneui/themed';
import * as SQLite from 'expo-sqlite';


export default function PlacesScreen({route, navigation}) {

  const [location, setLocation] = useState('');
  const [places, setPlaces] = useState([]);

  const db = SQLite.openDatabase('places.db');

  const error = err => console.log(err);

  const init = () => {
    console.log('init')
    db.transaction(
        tx => {
            tx.executeSql('create table if not exists places (id integer primary key not null, address text);');
        },
        error,
        getPlaces
    )
  };

  const savePlace = (address) => {
    console.log('savePlace', address);
    db.transaction(
        tx => {
            tx.executeSql('insert into places (address) values (?);', [address]);
        },
        error,
        getPlaces
    )
  }

    const getPlaces = () => {
    console.log('getPlaces');
    db.transaction(
        tx => {
            tx.executeSql('select * from places;', [], (_, {rows}) => {
                console.log(rows._array);
                setPlaces(rows._array);
            });
        }, error, null
    );
    }

    const deletePlace = (id) => {
    console.log('deletePlace:', id);
    db.transaction(
        tx => {
            tx.executeSql('delete from places where id = ?;', [id]);
            },
            error,
            getPlaces
    )
    }
  
    const confirmDelete = id => {
        Alert.alert(
            "Delete place",
            "Are you sure you want to delete the place?",
            [
                {
                    text: "Cancel",
                },
                {
                    text: "Yes",
                    onPress: () => deletePlace(id),
                }
            ],
            {
                cancelable: true
            }
        );
    }
            
    useEffect(init, []);

    useEffect(() => {
        const {fullAddress} = route.params || false;
        if (fullAddress){
            console.log('Save', fullAddress);
            savePlace(fullAddress);
        }
    }, [route.params?.fullAddress]);



    const renderItem = ({item}) => (
        <ListItem
            bottomDivider
            topDivider
            onPress={() => navigation.navigate('Map', {address: item.address})}
            onLongPress={() => confirmDelete(item.id)} >
            <ListItem.Content style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <ListItem.Title numberOfLines={1} style={{flex: 1}}>{item.address}</ListItem.Title>
                <ListItem.Subtitle right>On map</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem>
    );

  return (
    <View style={styles.container}>
        <View style={styles.inputs}>
            <Input label="Placefinder" onChangeText={text => setLocation(text)} value={location} placeholder="Enter address" />
            <Button title="Show on map" onPress={() => {
                if (location.trim()){
                    navigation.navigate("Map", {address: location, savePlace});
                    setLocation('');
                }
            }} />
        </View>
        <FlatList
            style={styles.list}
            data={places}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem} 
        />
        <StatusBar style="auto" />
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
    inputs: {
        marginTop: 10,
        width: 380
    },
    list: {
        width: 380
    },
});