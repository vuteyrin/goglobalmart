import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  ActivityIndicator,
  Image,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  TouchableNativeFeedback,
  Platform,
  Modal,
  Linking,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import { FontAwesome,FontAwesome5,Ionicons,AntDesign,Entypo,MaterialIcons } from '@expo/vector-icons';
import {useStateValue} from '../../../context/StateProvider';
import { Badge } from 'react-native-elements'
import {useQuery,useLazyQuery, useSubscription} from '@apollo/client';
import LoginModal from '../../../components/modal/loginModel';
import { GET_MY_ORDER,GET_ORDER_PANDING,SUB_ORDER_ONTHEWAY,SUB_NEW_ORDER  } from "../../../graphql/order";
import ViewImage from '../../../components/modal/ViewImage';
// import {GET_MY_ORDER_PENDING} from '../../../graphql/order';
import {colorapp} from "../../../context/Reducer"
function Profile({navigation, route}) {
  const [{customer,carts,notificat}, dispatch] = useStateValue();
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [fname,setFname] = useState('');
  const [lname, setlname] = useState('');
  const [openModalLogin,setOpenModalLogin] = useState(false);
  const [openViewImage,setOpenImage] = useState(false);
  const [newIdOrder,setNewIdOrder] = useState("");
  const {data: BadgeDB,refetch} = useQuery(GET_ORDER_PANDING,{
    variables: {
      input: {
        id: customer.id
      }
    },
    onError: (e)=>{
      console.log(e)
    }
  })
  const {data:newOrder} = useSubscription(SUB_NEW_ORDER,{
    onError: (e)=>{
      console.log(e)
    }
  });
  const [getSaleOrdersByCustomerId, { called, loading, data }] = useLazyQuery(GET_MY_ORDER,{
    onError: (e)=>{
      console.log(e)
    }
  });
  const {data:updateStatus} = useSubscription(SUB_ORDER_ONTHEWAY);
  React.useEffect(()=>{
    getSaleOrdersByCustomerId({
      variables :{
            input: {
            id: customer.id
                }
            }
        })
  },[])
  React.useEffect(()=>{
    if(newOrder){
      if(newOrder?.newSaleOrder?.customer.id === customer.id){
        refetch()
        setNewIdOrder(newOrder?.newSaleOrder?.customer.id)
        console.log("test bage")
      }
    }
  },[newOrder])
  React.useEffect(()=>{
    if(updateStatus){
      refetch()
    }
  },[updateStatus])
  const handleLogout = async () => { 
    await AsyncStorage.clear();
     dispatch({
       type: 'CUSTOMER',
       customer: {},
     });
     dispatch({
       type: "ADD_TO_CART",
       carts: [],
     });
     dispatch({
      type: "NOTIFICATION",
      notificat: [],
    });
     setImage("");
     setlname("");
     setFname("");
   }

  useEffect(() => {
    setImage(customer?.image);
    setlname(customer?.lname);
    setFname(customer?.fname);
  },[]);
  const handleGoPalyStore = () => {
    // navigation.goBack();
    // Linking.openURL(
    //   'https://play.google.com/store/apps/details?id=com.QRCode.scan',
    // );
    console.log("testing")
  };
  // if(!BadgeDB){
  //   return(
  //     <View style={styles.loading}>
  //       <Text>Loading....</Text>
  //       <ActivityIndicator size="large" color="#006633" />
  //     </View>
  //   )
  // }
  // console.log(BadgeDB)
  return (
    <SafeAreaView style={styles.container}>
      <LoginModal openModalLogin={openModalLogin} setOpenModalLogin={setOpenModalLogin} />
      <ViewImage openViewImage={openViewImage} setOpenImage={setOpenImage} image={customer?.image} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enableOnAndroid={true}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.nav}>
              <View>
                <View style={styles.profileImg}>
                  {image === "" ||  image === undefined ? (
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('Edit Profile')}>
                        <FontAwesome name="user-circle-o" size={100} color="#FFFF" />
                    </TouchableWithoutFeedback>
                  ) :
                  <TouchableWithoutFeedback onPress={() => setOpenImage(!openViewImage)}>
                    <Image style={styles.img} source={{ uri:customer?.image}} />
                  </TouchableWithoutFeedback>
                  }

                </View>
                <Text
                  style={{
                    color: '#FFFF',
                    fontSize: 20,
                    textAlign: 'center',
                    justifyContent: "center",
                    // backgroundColor: "red"
                  }}
                  >
                  {customer?.lname ?customer?.lname : 'user name'}
                </Text>
              </View>
            </View>
            <View style={{paddingBottom: 100}}>
              <TouchableNativeFeedback
                onPress={() => navigation.navigate('Edit Profile')}>
                <View style={styles.icon}>
                  <View style={styles.subIcon}>
                    <FontAwesome5 name="user-alt" size={20} color={colorapp} />
                  </View>
                  <View>
                    <Text style={styles.textMenu}>Profile</Text>
                  </View>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback
                onPress={() => navigation.navigate('Map')}>
                <View style={styles.icon}>
                  <View style={styles.subIcon}>
                    {/* <FontAwesome5 name="user-alt" size={24} color="#5CD242" /> */}
                    <Entypo name="location" size={22} color={colorapp} />
                  </View>
                  <View>
                    <Text style={styles.textMenu}>Location</Text>
                  </View>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={() => handleGoPalyStore()}>
                <View style={styles.icon}>
                  <View style={styles.subIcon}>
                    <Ionicons name="star-half-sharp" size={24} color={colorapp} />
                  </View>
                  <View>
                    <Text style={styles.textMenu}>Rate Use On App Store</Text>
                  </View>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback
                onPress={() => navigation.navigate('Order List',{newIdOrder : newIdOrder})}>
                <View>
                  <View style={styles.icon}>
                    <View style={styles.subIcon}>
                        <View style={styles.bagde}>
                          {BadgeDB?.getSaleOrdersBadgeByCustomerId !== 0 ?
                            <Badge value={BadgeDB?.getSaleOrdersBadgeByCustomerId} status="error" />
                          :null}
                        </View>
                      <Ionicons name="filter-outline" size={24} color={colorapp} />
                    </View>
                    <Text style={styles.textMenu}>Orders</Text>
                  </View>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback
                onPress={() => navigation.navigate('Term And Condition')}>
                <View style={styles.icon}>
                  <View style={styles.subIcon}>
                  <Ionicons name="color-filter-sharp" size={24} color={colorapp} />
                  </View>
                  <View>
                    <Text style={styles.textMenu}>Term And Condition </Text>
                  </View>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback
                onPress={() => navigation.navigate('Contact Us')}>
                <View style={styles.icon}>
                  <View style={styles.subIcon}>
                  <MaterialIcons name="connect-without-contact" size={24} color={colorapp} />
                  </View>
                  <View>
                    <Text style={styles.textMenu}>Contact Us</Text>
                  </View>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback
                  onPress={
                  () => {Object.keys(customer).length === 0
                      ? setOpenModalLogin(!openModalLogin)
                      :  setModalVisible(true)}}>
                <View style={styles.icon}>
                  <View style={styles.subIcon}>
                    {Object.keys(customer).length === 0
                      ? <AntDesign name="login" size={25} color={colorapp} />
                      : <AntDesign name="logout" size={25} color={colorapp} />}
                  </View>
                  <View>
                    {Object.keys(customer).length === 0
                      ? <Text style={styles.textMenu}>Login</Text>
                      : <Text style={styles.textMenu}>Logout</Text>}
                  </View>
                </View> 
              </TouchableNativeFeedback> 
              <TouchableNativeFeedback onPress={()=>setModalVisible(true)}>
                <View
                  style={{
                    marginLeft: 30,
                    flexDirection: 'row',
                  }}>
                  <View style={styles.subIcon}>
                    <Text style={{color: colorapp, fontSize: 12}}>
                      versoin{' '}
                    </Text>
                  </View>
                  <View>
                    
                    <Text style={{color: colorapp, fontSize: 12}}>1.0.0</Text>
                  </View>
                </View>
              </TouchableNativeFeedback>
              {/* alert model logout */}
              <View style={styles.centeredView}>
                <Modal
                  transparent={true}
                  visible={modalVisible}
                  animationType="slide">
                  <View style={styles.containerConfirmLogOut}>
                    <View style={styles.Bg}>
                      <Text style={{padding: 20}}>Do you want to LogOut..</Text>
                      <View style={styles.YesNo}>
                        <TouchableWithoutFeedback
                            onPress={() => {
                              handleLogout(),
                              setModalVisible(!modalVisible)
                             }}>
                          <View
                            style={{
                              backgroundColor:colorapp,
                              width: '50%',
                              borderRightWidth: 1,
                              borderRightColor: '#FFFF',
                              borderBottomLeftRadius: 12,
                              color: '#FFFF',
                            }}>
                            <Text style={styles.yes}>Yes</Text>
                          </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            setModalVisible(!modalVisible);
                          }}>
                          <View
                            style={{
                              backgroundColor: colorapp,
                              width: '50%',
                              borderBottomRightRadius: 12,
                              color: '#FFFf',
                            }}>
                            <Text style={styles.yes}>No</Text>
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
              {/*  */}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  loading : {
    flex : 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFF",
  },
  container: {
    flex: 1,
    height: height,
    width: width,
  },
  nav: {
    width: width,
    height: 200,
    backgroundColor: colorapp,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // profile
  profileImg: {
    position: 'relative',
    width: 110,
    height:110,
    // marginTop: 50,
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    // borderWidth: 5,
    // borderColor: "#FFFF",

  },
  img: {
    // resizeMode: "contain",
    width: "100%",
    height: "100%",
    borderRadius: 100,
    
  },
  icon: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  subIcon: {
    width: '20%',
    alignItems: 'center',
    position: 'relative',
  },
  textMenu: {
    fontSize: 14,
  },
  bagde: {
    position: 'absolute',
    zIndex: 1,
    top: -5,
    right: 10,
  },
   ////// model ////
  containerConfirmLogOut: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   position: 'relative',
   backgroundColor: "#CCCC",

 },
 Bg: {
   backgroundColor: '#FFFF',
   borderRadius: 5,
   
 },
 YesNo: {
   width: 250,
   flexDirection: 'row',
   justifyContent: 'space-between',
   backgroundColor: colorapp,
   borderRadius: 5,
 },
 yes: {
  width: '100%',
  textAlign: 'center',
  paddingVertical: 10,
  borderBottomLeftRadius: 12,
  color: '#FFFF',
 }
});
export default Profile;
