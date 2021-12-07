import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
const HomeCard = ({image}) => {
  // React.useEffect(() => {
  //   console.log(image)
  // },[])
  return (
    <View style={styles.containImg}>
      <Image
        style={styles.image}
        source={{
        uri: image,
        }}
      />
    </View>
  );
};
const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  containImg: {
    width: 130,
    height: '80%',
    padding: 6,
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
});
export default HomeCard;
