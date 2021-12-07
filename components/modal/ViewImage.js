import React from 'react'
import { Dimensions, Modal, StyleSheet, Text, 
    Pressable,Image, View,TouchableWithoutFeedback } from 'react-native';
const ViewImage = ({openViewImage, setOpenImage, image}) => {
    
    return (
        <View>
          <Modal
            transparent={true}
            visible={openViewImage}
            animationType="slide">
            <View style={styles.containerConfirmLogOut}>
              <View style={styles.Bg}>
              <Image style={styles.img} source={{ uri: image}} />
                <View style={styles.YesNo}>
                  <TouchableWithoutFeedback onPress={() => {setOpenImage(!openViewImage);}}>
                    <Text style={styles.yes}>
                      yes
                    </Text>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={() => {setOpenImage(!openViewImage)}}>
                    <Text style={styles.No}>
                      No
                    </Text>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </Modal>
        </View>
    )
}
const Height = Dimensions.get("window").height;
const Width = Dimensions.get("window").width;
const styles = StyleSheet.create({
    ///model///
  containerConfirmLogOut: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#CCCC',
  },
  input:{
    // borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    
  },
  Bg: {
    backgroundColor: '#FFFF',
    borderRadius: 5,
  },
  YesNo: {
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#006633',
    borderRadius: 5,
  },
  yes:{
    backgroundColor: '#006633',
    width: '50%',
    borderRightWidth: 1,
    borderRightColor: '#FFFF',
    textAlign: 'center',
    paddingVertical: 10,
    borderBottomLeftRadius: 12,
    color: '#FFFF',
  },
  No: {
    backgroundColor: '#006633',
    width: '50%',
    textAlign: 'center',
    paddingVertical: 10,
    borderBottomRightRadius: 12,
    color: '#FFFf',
  },
  img : {
      width: Width,
      height:Height/2,
  }
  });

export default ViewImage;
