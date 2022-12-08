import * as React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import firebase from 'firebase/compat';
import {useEffect, useState} from "react";

const ApartmentList = ({navigation}) => {

    const [apartments,setApartments] = useState()

    useEffect(() => {
        if(!apartments) {
            firebase
                .database()
                .ref('/Apartment')
                .on('value', snapshot => {
                    setApartments(snapshot.val())
                });
        }
    },[]);

    // Vi viser ingenting hvis der ikke er data
    if (!apartments) {
        return <Text>Loading...</Text>;
    }

    const handleSelectCar = id => {
        /*Her søger vi direkte i vores array af biler og finder bil objektet som matcher idet vi har tilsendt*/
        const apartment = Object.entries(apartment).find( apartment => apartment[0] === id /*id*/)
        navigation.navigate('Apartment Details', { apartment });
    };

    // Flatlist forventer et array. Derfor tager vi alle values fra vores cars objekt, og bruger som array til listen
    const apartmentArray = Object.values(apartments);
    const apartmentKeys = Object.keys(apartments);

    return (
        <FlatList
            data={apartmentArray}
            // Vi bruger carKeys til at finde ID på den aktuelle bil og returnerer dette som key, og giver det med som ID til CarListItem
            keyExtractor={(item, index) => apartmentKeys[index]}
            renderItem={({ item, index }) => {
                return(
                    <TouchableOpacity style={styles.container} onPress={() => handleSelectCar(apartmentKeys[index])}>
                        <Text>
                            {item.address} {item.size}
                        </Text>
                    </TouchableOpacity>
                )
            }}
        />
    );
}

export default ApartmentList;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        borderRadius:10,
        margin: 5,
        padding: 5,
        height: 50,
        justifyContent:'center'
    },
    label: { fontWeight: 'bold' },
});