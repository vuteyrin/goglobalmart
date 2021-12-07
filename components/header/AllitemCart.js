import React from 'react';
import {View, Text, Dimensions, StyleSheet, Image} from 'react-native';
// import {API_URL} from '../../context/reducer';
const AllitemCart = ({image}) => {
// const API_URL = "https://96.9.90.104/graphql_mart/app/"
  return (
    <View style={styles.containImg}>
      <Image style={styles.image} source={{uri: image}} />
    </View>
  );
};
const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  containImg: {
    width: Width/3.2,
    height: '80%',
    padding: 6,
    // backgroundColor: 'blue',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
    // margin: 12,
  },
});
export default AllitemCart;
