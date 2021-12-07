import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  FlatList,
  Animated,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
  Platform
} from 'react-native';
import CartNotification from './CartNotification';
import { useStateValue } from '../../../context/StateProvider';
import {setLocalstorage} from "../../../function/Function"
import { AntDesign,Ionicons } from '@expo/vector-icons';
import {actionTypes} from "../../../context/Reducer";
import ViewNotification from '../../../components/modal/ViewNotification';
import Swipeable from 'react-native-gesture-handler/Swipeable';
const Notification = ({navigation}) => {
  const [{notificat,badgeNoti},dispatch] = useStateValue();
  const [data ,setData] =  React.useState();
  const [openNotificat, setOpenNotificat] = React.useState(false);
  const handleViewNotification = (item,index) =>{
    setOpenNotificat(!openNotificat)
    setData(item);
    var newArray = [];
    notificat[index] = {...notificat[index], new: false };
    newArray = [...notificat];
    dispatch({
      type: actionTypes.NOTIFICATION,
      notificat: newArray
    })
    setLocalstorage("notification",newArray)
  }
  const handleDelete = (index) =>{
    notificat.splice(index, 1);
    setLocalstorage('notification', notificat);
    dispatch({
      type: actionTypes.NOTIFICATION,
      notificat: notificat,
    });
  }
 const renderLeftActions = (index) => {
    return (
      <TouchableWithoutFeedback onPress={()=> handleDelete(index)}>
        <View style={styles.delete}>
            <Text style={styles.TextDelete}>
              Delete
            </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch({
        type : actionTypes.BADGENOTI,
        badgeNoti: 0
      })
    });
    return unsubscribe;
  }, [navigation]);


  if(notificat?.length === 0){
    return(
        <View style={{flex: 1, alignItems: "center", justifyContent:"center"}}>
          <Text>Empty...</Text>
          <AntDesign name="folderopen" size={50} color="#CCC" />
       </View>
    )
  }
  
  return (
    <ScrollView>
      <View style={styles.container}>
        {
          notificat?.map((item,index) => {
            return(
              <Swipeable key={index} renderRightActions={()=>renderLeftActions(index)}>
                <TouchableWithoutFeedback  onPress={()=>handleViewNotification(item,index)}>
                  <View>
                    <View style={styles.cart}>
                      <View style={styles.title}>
                        <Text style={styles.textTitle}>
                          <Ionicons name="notifications-circle-outline" size={20} color="#808080"/>
                          {item?.title}
                        </Text>
                      </View>
                      <View>
                        <Text style={{ color: "#B8B8B8", marginBottom: 10 }}>
                          {item?.date}
                        </Text>
                      </View>
                      <View style={{flexDirection:"row",justifyContent: "space-between"}}>
                        <Text>{item?.body}</Text>
                        {item.new?<View style={styles.new}><Text style={{color: "white",fontSize: 10}}>new</Text></View>:null}
                      </View>
                    </View>
                  </View>
              </TouchableWithoutFeedback>     
            </Swipeable>
            )
          })
        } 
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
      </View>
    </ScrollView>
  );
};
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    paddingBottom: Platform.OS === "ios"? 80:65,
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 18,
    color: "#006633",
    paddingBottom: 10,
  },
  textTitle: {
    color: "#006633",
    fontSize: 18,
  },
  cart: {
    backgroundColor: "#FFFF",
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginVertical: 5,
    // marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    borderRadius: 5,
  },
  delete: {
    backgroundColor: "red",
    margin:5,
    paddingHorizontal:12,
    justifyContent: "center",
    alignItems: "center"
  },
  TextDelete: {
   color: "#FFFF"
  },
  new: {
    backgroundColor: "red",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
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
export default Notification;
