import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Text,
  TouchableHighlight,
  SafeAreaView,
  Platform,
} from 'react-native';
// import { data } from '../../../data/Data';
// import CartOffer from "./CartOffer";
import {useQuery} from '@apollo/client';
import {GET_ALL_OFFERS} from '../../../graphql/offer';
import { AntDesign,Ionicons } from '@expo/vector-icons';

const Offer = ({route, navigation}) => {
  const {data, error, loading} = useQuery(GET_ALL_OFFERS);
  // console.log(data?.allOffers);
//   const renderItem = ({ item }) => <CartOffer offer={item} />;

  return (
    <View style={{flex: 1, alignItems: "center", justifyContent:"center"}}>
    <Text>Empty...</Text>
    <AntDesign name="folderopen" size={50} color="#CCC" />
  </View>
  );
};
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container : {
    paddingBottom: 65
  }
});
export default Offer;