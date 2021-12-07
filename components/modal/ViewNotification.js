import React from 'react'
import { Alert, Modal, StyleSheet, Text, Pressable, View,TouchableWithoutFeedback } from 'react-native';
const ViewNotification = ({openNotificat,data, setOpenNotificat}) => {
    return (
        <View>
          <Modal
            transparent={true}
            visible={openNotificat}
            animationType="slide">
            <View style={styles.containerConfirmLogOut}>
              <View style={styles.Bg}>
               <Text style={{textAlign: "center",padding: 10}}>{data?.title}</Text>
               <Text style={{textAlign: "center",padding: 10}}>{data?.body}</Text>
               <Text style={{textAlign: "center",padding: 10}}>{data?.date}</Text>
                <View style={styles.YesNo}>
                  <TouchableWithoutFeedback onPress={() => {setOpenNotificat(!openNotificat);}}>
                    <View style={styles.conYes}>
                     <Text style={styles.yes}>yes</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={() => {setOpenNotificat(!openNotificat)}}>
                    <View style={styles.conNo}>
                      <Text style={styles.yes}>No</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </Modal>
        </View>
    )
}
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
    width: 312,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#006633',
    borderRadius: 5,
  },
  conYes : {
    backgroundColor: '#006633',
    width: '50%',
    borderRightWidth: 1,
    borderRightColor: '#FFFF',
    borderBottomLeftRadius: 12,
    color: '#FFFF',
   },
   conNo :{
    backgroundColor: '#006633',
    width: '50%',
    borderBottomRightRadius: 12,
    color: '#FFFf',
   },
   yes: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: 10,
    borderBottomLeftRadius: 12,
    color: '#FFFF',
   },
  });

export default ViewNotification
