import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import firebase from 'firebase/compat';
import {useEffect, useState} from "react";


const Add_Apartment = ({navigation,route}) => {
    const initialState = {
        address: '',
        size: '',
        bedrooms: '',
        bathrooms: '',
        payment: '',
        ranking: ''
    }

    const [newApartment,setNewApartment] = useState(initialState);
    /*Returnere true, hvis vi er på edit apartment*/
    const isEditApartment = route.name === "Edit Apartment";

    useEffect(() => {
        if(isEditApartment){
            const apartment = route.params.apartment[1];
            setNewApartment(apartment)
        }
        /*Fjern data, når vi går væk fra screenen*/
        return () => {
            setNewApartment(initialState)
        };
    }, []);

    const changeTextInput = (name,event) => {
        setNewApartment({...newApartment, [name]: event});
    }

    const handleSave = () => {

        const { address, size, bedrooms, bathrooms, payment, ranking } = newApartment;

        if(address.length === 0 || size.length === 0 || bedrooms.length === 0 || bathrooms.length === 0 || payment.length === 0 || ranking.length === 0 ){
            return Alert.alert('Et af felterne er tomme!');
        }

        if(isEditApartment){
            const id = route.params.apartment[0];
            try {
                firebase
                    .database()
                    .ref(`/Apartments/${id}`)
                    // Vi bruger update, så kun de felter vi angiver, bliver ændret
                    .update({ address, size, bedrooms, bathrooms, payment, ranking });
                // Når bilen er ændret, går vi tilbage.
                Alert.alert("Din info er nu opdateret");
                const apartment = [id,newApartment]
                navigation.navigate("Apartment Details",{apartment});
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }

        }else{

            try {
                firebase
                    .database()
                    .ref('/Apartments/')
                    .push({ address, size, bedrooms, bathrooms, payment, ranking });
                Alert.alert(`Saved`);
                setNewApartment(initialState)
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
        }

    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {
                    Object.keys(initialState).map((key,index) =>{
                        return(
                            <View style={styles.row} key={index}>
                                <Text style={styles.label}>{key}</Text>
                                <TextInput
                                    value={newApartment[key]}
                                    onChangeText={(event) => changeTextInput(key,event)}
                                    style={styles.input}
                                />
                            </View>
                        )
                    })
                }
                {/*Hvis vi er inde på edit car, vis save changes i stedet for add car*/}
                <Button title={ isEditApartment ? "Save changes" : "Add Apartment"} onPress={() => handleSave()} />
            </ScrollView>
        </SafeAreaView>
    );
}

export default Add_Apartment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row',
        height: 30,
        margin: 10,
    },
    label: {
        fontWeight: 'bold',
        width: 100
    },
    buttonStyle :{
    backgroundColor: 'black',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 30,
    },
    input: {
        borderWidth: 1,
        padding:5,
        flex: 1
    },
});

