
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {overlapItem} from '../../../function/Function';
import { Ionicons,Feather } from '@expo/vector-icons';
import UpdateCart from '../../../components/modal/updataCart';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { useStateValue } from "../../../context/StateProvider";
import { useMutation } from "@apollo/client";
import { colorapp } from '../../../context/Reducer';
import { CREATE_NEW_ORDER,GET_MY_ORDER } from "../../../graphql/order";
import moment from 'moment';
import { setLocalstorage } from '../../../function/Function';
import UpdateLocation from '../../../components/modal/updateLocation';
const ReviewPayment = ({navigation, route}) => {
  const [{carts,customer,location,itemOrder}, dispatch] = useStateValue();
  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState();
  const [openUpdateMap, setOpenUpateMap] = React.useState(true);
  const [date,setDate] =useState(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
  const [status,setStatus] = useState({
      isPrepared: false,
      isCooked: false,
      isDelivered: false,
      deliveryTime: "25",
      isPaid:  false,

  })
  const [setSaleOrders] = useMutation(CREATE_NEW_ORDER,
    {
      // refetchQueries:[GET_MY_ORDER],
      onError: (err)=>{
        console.log(err)
      }
    });
  const totalPrice = carts.reduce((a, b) => {
    return a + b.salePrice * b.qty;
  }, 0);
  const removeItemValue = async () => {
    await AsyncStorage.removeItem("cart");
    dispatch({
      type: "ADD_TO_CART",
      carts: [],
    });
  };
 const convertproductToDb = (e) =>{
    const newArr = [];
    e.map((item)=>{
    newArr.push({  
    "qty": item.qty,
    "total": item.qty * item.salePrice,
    "price": item.salePrice,
    "product": item.product,
    "remark": item.remark})
  })
  return newArr
 }
  const createNewOrder = async () => {
     await setSaleOrders({
        variables: {
          input:{
              customer: {
                id: customer.id,
                geolocation: location,
                tel: customer.tel
              },
              date: date,
              products: convertproductToDb(carts),
              subTotal: totalPrice,
              grandTotal: totalPrice,
            }
          },
          update(_,result){
            setLocalstorage("itemOrder",result.data.setSaleOrders)
            dispatch({
              type: "ITEMORDER",
              itemOrder: result.data.setSaleOrders,
            });
            navigation.navigate("Order Track" ,{id:result.data.setSaleOrders.id})
            // console.log(result)
          }
      });
     removeItemValue();
  };
  // console.log(itemOrder)
  return (
    <View style={styles.container}>
      {openModal && (
        <View style={{position: 'absolute'}}>
          <UpdateCart openModal={openModal} setOpenModal={setOpenModal} id={id} />
        </View>
      )}
      <UpdateLocation openUpdateMap={openUpdateMap} setOpenUpateMap={setOpenUpateMap} />
      <View style={styles.containerMap}>
      <View style={styles.containerMapsup}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          // zoomControlEnabled={true}
          zoomControlEnabled={true}
          showsTraffic={true}
          showsUserLocation={true}
          followUserLocation={true}
          style={styles.map}
          region={{
            latitude: location.lat,
            longitude: location.long,
            latitudeDelta: 0.09,
            longitudeDelta: 0.09,
          }}>
          <Marker
            coordinate={{latitude: location.lat, longitude: location.long}}
            title="location"
            description="Your location now">
            </Marker>
        </MapView>
      </View>
      </View>
      <View style={styles.body}>
        <View style={styles.footer}>
          <View style={styles.ChangeCash}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{ color: colorapp}}>
                Payment Method
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{color: colorapp}}> Cash only </Text>
            </View>
          </View>
          <View style={styles.subFooter}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {carts.map(item => {
                return (
                  <TouchableWithoutFeedback
                    key={item.product}
                    onPress={() => {setOpenModal(true), setId(item.product);}}>
                    <View style={styles.OrderItem}>
                      <Image style={styles.imgItem} source={{uri: item.productImage}}/>
                      <Text style={{width: '35%', paddingHorizontal: 5}}>
                        {overlapItem(item.name)}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '30%',
                          justifyContent: 'flex-end',
                        }}>
                        <Text style={{width: '30%'}}>{item.qty} x</Text>
                        <Text style={{width: '60%'}}>{(item.salePrice).toFixed(2)}$</Text>
                      </View>
                      <Text style={{width: '25%',textAlign: "center"}}>
                        {(item.salePrice * item.qty).toFixed(2)}$
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                );
              })}
              <View style={styles.containerTotal}>
                <View style={styles.total}>
                  <Ionicons name="ios-cart-sharp" size={28} color={'#EE2777'} />
                  <View>
                    <Text style={{color: '#EE2777'}}>
                      {totalPrice.toFixed(2)}$
                    </Text>
                    <Text style={{color: '#EE2777'}}>{carts.length} Items</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
          <View style={styles.btn}>
            <View>
              <TouchableWithoutFeedback 
                onPress={()=> 
                // {removeItemValue().then(()=>navigation.navigate("OrderTrack"))}
                {carts.length=== 0?navigation.navigate("All Item"):createNewOrder()}}>
                <View style={styles.addItem}>
                  <Text style={styles.addItems}>{carts.length===0?"add item" :"place order"}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
    width: width,
    height: height,
  },
  img: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  body: {
    width: width,
    height: '70%',
  },
  ChangeCash: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: "#EEEE",
    paddingHorizontal: 5,
  },
  footer: {
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: '1%',
    width: '100%',
  },
  subFooter: {
    height: 290,
    width: width,
    marginBottom: 400,
    paddingHorizontal: 10,
    // backgroundColor: "red"
    borderBottomWidth: 1,
    borderBottomColor: colorapp,
  },
  /// cart item///
  OrderItem: {
    flexDirection: 'row',
    width: width,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#EEEE',
    paddingVertical: 5,
  },

  imgItem: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  addItem: {
    width: '100%',
    backgroundColor: colorapp,
    borderRadius: 5,
    justifyContent: 'center',
    textAlign: 'center',
    marginVertical: 5,
    color: '#FFFF',
  },
  addItems: {
    width: '100%',
    padding: 8,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFFF',
  },

  containerTotal: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  total: {
    width: 90,
    height: 90,
    borderWidth: 1,
    borderColor: colorapp,
    borderRadius: 50,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 5,
  },
  btn: {
    position: 'absolute',
    width: '100%',
    bottom: '22%',
  },
  ////map view////
  containerMap: {
    position: 'relative',
    height: '30%',
    width: width,
    zIndex: -1,
  
  },
  containerMapsup:{
      width:"100%",
      height:"100%"
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default ReviewPayment;
