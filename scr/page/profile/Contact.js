import React from 'react'
import { View,Linking, Text,Image, StyleSheet,Dimensions,TouchableNativeFeedback} from 'react-native';
import { FontAwesome,MaterialCommunityIcons,Ionicons,AntDesign,Entypo,MaterialIcons } from '@expo/vector-icons';
import { colorapp } from '../../../context/Reducer';
const Contact = () => {
    return (
        <View style={styles.container}>
            <View style={styles.containerImage}>
                <Image style={styles.image} source={require('../../../assets/Image/logo.png')}/>
            </View>
            <View>
                <Text style={{fontWeight: "bold"}}>We come to Goglobal Mart</Text>
            </View>
            <TouchableNativeFeedback onPress={() =>  Linking.openURL("https://www.facebook.com/Wegomart")}>
                <View style={styles.icon}>
                  <View style={styles.subIcon}>
                  <Entypo name="facebook-with-circle" size={24} color={colorapp} />
                  </View>
                  <View>
                    <Text style={styles.textMenu}>Face book </Text>
                  </View>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback>
                <View style={styles.icon}>
                  <View style={styles.subIcon}>
                  <Entypo name="old-phone" size={24} color={colorapp} />
                  </View>
                  <View>
                    <Text style={styles.textMenu}>Tel: 085 705 555 </Text>
                  </View>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={() =>  Linking.openURL("https://www.goglobalmart.com/")}>
                <View style={styles.icon}>
                  <View style={styles.subIcon}>
                  <MaterialCommunityIcons name="web" size={24} color={colorapp} />
                  </View>
                  <View>
                    <Text style={styles.textMenu}>Web Site</Text>
                  </View>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={() =>  Linking.openURL("https://www.google.com/maps/dir/13.3564534,103.8332198/13.3758676,103.862214/@13.3649721,103.8300464,14z/data=!3m1!4b1!4m4!4m3!1m1!4e1!1m0")}>
                <View style={styles.icon}>
                  <View style={styles.subIcon}>
                  <Entypo name="location" size={24} color={colorapp} />
                  </View>
                  <View>
                    <Text style={styles.textMenu}>My Locations</Text>
                  </View>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback>
                <View style={styles.icon}>
                  <View>
                    <Text style={styles.textFooter}>
            
                        Location: Go Global School,
                       </Text>
                  </View>
                </View>
              </TouchableNativeFeedback>
        </View>
    )
}


const Height = Dimensions.get("window").height;
const Width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFF",
    // justifyContent: "center",
    alignItems: "center",
  },
  containerImage: {
    width: 150,
    height: 150,
  },
  image: {
      width: "100%",
      height: "100%"
  },
  icon: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 15,
    width: "100%"
  },
  subIcon: {
    width: '20%',
    alignItems: 'center',
    position: 'relative',
  },
  textMenu: {
    fontSize: 14,
  },
  textFooter: {
      textAlign: "justify",
      paddingHorizontal: 20,
      fontSize: 10
  }
   
});
export default Contact
