import React, { useState } from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { useStateValue } from '../../context/StateProvider';
import { MaterialIcons } from '@expo/vector-icons';
import {setLocalstorage} from '../../function/Function';
import {UPDATE_CUSTOMER_BY_ID} from '../../graphql/customer';
import {useQuery, useMutation} from '@apollo/client';
import { Dimensions, Modal, StyleSheet, Text, TouchableWithoutFeedback,AsyncStorage, View } from 'react-native';
import { actionTypes } from '../../context/Reducer';
import * as Location from 'expo-location';
const UpdateLocation = ({openUpdateMap, setOpenUpateMap}) => {
    const [{location,customer,carts},dispatch] = useStateValue();
    const [changeLocation,setChangeLocation] = useState(location);
    const [updateCustomers] = useMutation(UPDATE_CUSTOMER_BY_ID,{
        onError: (err)=>{
          console.log(err?.graphQLErrors[0]?.message)
        }
    })
    const handleCurrentLocat=  async () => {
      let location = await Location.getCurrentPositionAsync({});
      setChangeLocation(
        {
          lat: location.coords.latitude,
          long: location.coords.longitude
        }
        )
      await updateCustomers({
          variables: {
            input:{
              id: customer?.id,
              geolocation: {
                lat: location.coords.latitude,
                long: location.coords.longitude
              },
              }
            },
            update(_,result){
              console.log(result)
            }
        });
        await setLocationLocalStorage({
          lat: location.coords.latitude,
          long: location.coords.longitude
        })
    }
    const setLocationLocalStorage = async (value) => {
      await AsyncStorage.setItem("location", JSON.stringify(value));
      dispatch({
        type: actionTypes.LOCATION,
        location: value,
      });
    };


    return (
        <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={openUpdateMap}>
          <View style={styles.containerConfirmLogOut}>
            <View style={styles.Bg}>
              <View style={{padding: 5}}>
                <Text>confirm current location</Text>
              </View>
              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                zoomControlEnabled={true}
                showsUserLocation={true}
                style={styles.map}
                // onRegionChangeComplete={(e)=>onRegionChange(e)}
                region={{
                    latitude: changeLocation.lat,
                    longitude: changeLocation.long,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}>
              </MapView>
              <View style={styles.remark}>
                <View style={styles.shadow}>
                    <MaterialIcons name="edit-location" size={40} color="black" /> 
                </View>
                 <MaterialIcons name="edit-location" size={40} color="#006633" /> 
              </View>
              <View style={{flexDirection: 'row'}}>
                <TouchableWithoutFeedback onPress={()=> {handleCurrentLocat(),setOpenUpateMap(!openUpdateMap)}}>
                    <View style={styles.changeLocation}>
                        <Text>Confirm</Text>
                    </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
}
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
    },
    modalView: {
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    map: {
        // ...StyleSheet.absoluteFillObject,
        width: width,
        height: height/4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerConfirmLogOut: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#CCCC',
      },
    Bg: {
        backgroundColor: '#FFFF',
        borderRadius: 5,
      },
    changeLocation: {
        width: "90%",
        alignItems: "center",
        borderRadius: 5,
        padding: 5,
        margin: 12,
        backgroundColor: "#FFFF",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
      
      },
   remark: {
        position: "absolute",
        left: "43%",
        top: "34%",
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.43,
        shadowRadius: 9.51,

        elevation: 15,
   },
   shadow: {
    position: "absolute",
    left: "33%",
    top: "25%",
    opacity: 0.3,
    transform: [
        { rotateY: "40deg" },
        { rotateZ: "70deg" }
      ]
   },
  });

export default UpdateLocation
