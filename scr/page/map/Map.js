import React from 'react';
import {TouchableHighlight} from 'react-native';
import {View, Text, StyleSheet,TouchableWithoutFeedback,Image} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import UpdateLocation from '../../../components/modal/updateLocation';
import { EvilIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useStateValue } from '../../../context/StateProvider';
import AllItem from '../home/allItem';
const Map = () => {
  const [{location},dispatch] = useStateValue();
  const [openUpdateMap, setOpenUpateMap] = React.useState(false);
  const [changeLocation,setChangeLocation] = React.useState(location)
  const [correntLocat,setCurrentLocat] = React.useState(true)

  const handleCurrentLocat=  async () => {
    let location = await Location.getCurrentPositionAsync({});
    setChangeLocation(
      {
        lat: location.coords.latitude,
        long: location.coords.longitude
      }
      )
  }
  return (
    <View style={styles.container}>
      <View style={styles.containerMap}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          zoomControlEnabled={true}
          showsTraffic={true}
          showsUserLocation={true}
          followUserLocation={true}
          style={styles.map}
          // onRegionChangeComplete={(e)=>onRegionChange(e)}
          region={{
            latitude: changeLocation?.lat,
            longitude: changeLocation?.long,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          <Marker
            coordinate={{latitude: location.lat, longitude: location.long}}
            title="location"
            description="Your location now">
              <Image style={{width:30,height:30}}  source={require('../../../assets/Image/logo.png')}/>
            </Marker>
        </MapView>
        <TouchableWithoutFeedback onPress={()=> setOpenUpateMap(!openUpdateMap)}>
          <View style={styles.changeLocation}>
            <Text>Change locations</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={()=> handleCurrentLocat()}>
          <View style={styles.icons}>
            <EvilIcons name="sc-telegram" size={40} color="#0080FF" />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <UpdateLocation openUpdateMap={openUpdateMap} setOpenUpateMap={setOpenUpateMap} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    marginBottom: 65,
  },
 
  containerMap: {
    height: '100%',
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  changeLocation: {
    width: "35%",
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
  icons: {
    // borderWidth: 1,
    width: 50,
    height: 50,
    alignItems: "center",
    borderRadius: 50,
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

  
  }
});
export default Map;


