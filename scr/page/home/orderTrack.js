import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons,Feather } from '@expo/vector-icons';
import OrderTrackAnimate from '../../page/orderTrack/OrderTrackAnimate';
import {overlapItem} from "../../../function/Function"
import {useQuery,useLazyQuery, useSubscription} from '@apollo/client';
import {GET_ORDER_BYID} from  "../../../graphql/order"
import {useStateValue} from '../../../context/StateProvider';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const OrderTrack = ({route, navigation}) => {
  const [{carts,itemOrder}, dispatch] = useStateValue();
  const { id } = route.params;
  const {data, loading, error} = useQuery(GET_ORDER_BYID,{
    variables :{
      input: {
       id: id
      }
    }
  }); 

  // React.useEffect(()=>{
  //   getSaleOrdersByCustomerId({
  //     variables :{
  //       input: {
  //        id: id
  //       }
  //     }
  //   }) 
  // },[id])
  const total = data?.getSaleOrderById.grandTotal;
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Wait...</Text>
        {/* <ActivityIndicator size="large" color="#006633" /> */}
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.imageHeader}>
        <Image
          style={styles.img}
          source={require('../../../assets/Image/banner2.png')}
        />
      </View>
      <View style={styles.body}>
        <View style={styles.OrderTrackAnimate}>
          <OrderTrackAnimate id={id} />
        </View>
        <View style={styles.footer}>
          <View style={styles.subFooter}>
            <View style={styles.ChangeCash}>
              <Text style={styles.textDetails}>Order Details</Text>
              <View>
                <Text style={styles.textDetails}>
                  #{overlapItem(data?.getSaleOrderById?.id)}
                </Text>
              </View>
            </View>
  
          </View>
          <View style={styles.scrollView}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {data?.getSaleOrderById.products?.map(item => {
                return (
                  <View style={styles.item} key={Math.random()} >
                    <View style={styles.boxImg}>
                      <Image style={styles.imgOrder} source={{ uri: item.product.image,}}/>
                    </View>
                    <View style={styles.boxName}>
                      <Text>{overlapItem(item.product.description)}</Text>
                    </View>
                    <View style={styles.box}>
                      <Text>{item.qty} X</Text>
                    </View>
                    <View style={styles.boxPrice}>
                      <Text>{(item.price).toFixed(2)}$</Text>
                    </View>
                    <View style={styles.boxTotal}>
                      <Text>{(item.total).toFixed(2)}$</Text>
                    </View>
                  </View>
                );
              })}

              <View style={styles.containerCircle}>
                <View style={styles.circle}>
                  <View>
                    <Ionicons name="ios-cart-sharp" size={20} color="#EE2777" />
                  </View>
                  <View>
                    <Text style={{color: '#EE2777'}}>{(total*1).toFixed(2)}$</Text>
                    <Text style={{color: '#EE2777'}}>
                      {data?.getSaleOrderById?.products?.length} item
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
    width: width,
    height: height,
    // padding: 2,
  },

  imageHeader: {
    height: Platform.OS === 'ios' ? '30%' : '30%',
    width: width,
    marginTop: -52,
    zIndex: -1,
  },
  img: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 0,
  },

  body: {
    width: width,
    height: '70%',
    // paddingHorizontal: '5%',
    // backgroundColor:"red"
  },
  OrderTrackAnimate: {
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    paddingTop: 10,
  },

  chageAddress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ChangeCash: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    height: '60%',
    // paddingBottom: 10,
    padding: 5,
    // backgroundColor: "red"s
  },
  subFooter: {
    width: '100%',
    backgroundColor: "#EEEE"
  },
  textDetails: {
    fontSize: 10,
    color: '#006633',
  },
  textDetail: {
    fontSize: 18,
    paddingVertical: 10,
    color: 'black',
  },

  item: {
    width: '100%',
    // padding: 5,
    fontSize: 18,
    height: 40,
    marginVertical: 3,
    flexDirection: 'row',
    // paddingVertical: Platform.OS === "ios" ? 0 : "8%",
    borderWidth: 1,
    borderColor: '#EEEE',
    backgroundColor: '#FFFF',
    borderRadius: 10,
    marginTop: 3,
  },
  box: {
    width: '10%',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  boxPrice: {
    flex: 1,
    width: '20%',
    justifyContent: 'center',
    paddingLeft: 10,
 
  },
  boxTotal: {
    width: '25%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 10,
    // backgroundColor: "red"
  },
  boxName: {
    width: '30%',
    justifyContent: 'center',
  },
  boxImg: {
    flex: 1,
    width: '15%',
    justifyContent: 'center',
  },
  imgOrder: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  containerCircle: {
    // borderTopWidth: 1,
    borderColor: '#99C68E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    marginTop: 10,
    width: 90,
    height: 90,
    borderWidth: 1,
    borderColor: '#5CD242',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 200,
    flexDirection: 'row',
  },
  boxOrderList: {
    width: '140%',
    marginTop: 10,
  },
  scrollView: {
    height: '100%',
     width: '100%',
    //  backgroundColor: "red"
    borderBottomWidth: 1,
    borderColor: "#006633"
  }
});

export default OrderTrack;
