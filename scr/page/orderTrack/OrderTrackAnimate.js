import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Ionicons,MaterialIcons,Fontisto,FontAwesome } from '@expo/vector-icons';
import { useQuery, useSubscription } from "@apollo/client";
import { SUB_ORDER_ONTHEWAY,GET_ORDER_BYID } from "../../../graphql/order";
import LottieView from 'lottie-react-native';
import ViewReceipt from "../../../components/modal/ViewReceipt";
const OrderTrackAnimate = ({ navigation,id}) => {
  const [deliveryTime,setDeliveryTime] = React.useState(25);
  const [viewReceipt,setViewReceipt] = React.useState(true)
  const [load, setLoad] = React.useState({
    preparing: false,
    onTheway: false,
    success: false,
    isPaid: false,
  })
  const {data, loading, error,refetch} = useQuery(GET_ORDER_BYID, {
    variables: {
      input: {
        id: id
      },
    },
  });

  const {data:updateStatus} = useSubscription(SUB_ORDER_ONTHEWAY,{
    variables:{
      input:{
        id: id
      }
    }
  });
 
  useEffect(()=>{
    if(updateStatus !== undefined){
      if(id === updateStatus?.updateStatus?.id ){
        setLoad({
          preparing:updateStatus?.updateStatus?.isPrepared,
          onTheway:updateStatus?.updateStatus?.isCooked,
          success:updateStatus?.updateStatus?.isDelivered,
          isPaid: updateStatus?.updateStatus?.isPaid,
        })
        setDeliveryTime(updateStatus?.updateStatus?.deliveryTime)
      }
    }
  },[updateStatus])
  // useEffect(()=>{
  //   refetch()
  // },[updateStatus])
  useEffect(()=>{
    setLoad({
      preparing:data?.getSaleOrderById.status?.isPrepared,
      onTheway:data?.getSaleOrderById.status?.isCooked,
      success:data?.getSaleOrderById.status.isDelivered,
      isPaid: data?.getSaleOrderById.status.isPaid,
    })
    setDeliveryTime(data?.getSaleOrderById.status.deliveryTime)
  },[data])
console.log(data)

  return (
    <View style={styles.container}>
      {load.isPaid && <ViewReceipt viewReceipt={viewReceipt} setViewReceipt={setViewReceipt} data={data}/>}
      <View style={styles.header}>
        {!load.preparing ? (
          <View style={styles.shopping}>
            <Ionicons name="ios-cart-sharp" size={20} color="#006633" />
            <LottieView source={require('./loading.json')} autoPlay loop />
          </View>
        ) : (
          <View style={styles.shoppingBorder}>
            <Ionicons name="ios-cart-sharp" size={20} color="#006633" />
          </View>
        )}

        <View style={styles.connect}></View>

        {!load.onTheway && !load.preparing ? (
          <View style={styles.bikeNotLoading}>
             <MaterialIcons name="delivery-dining" size={25} color="#006633" />
          </View>
        ) : null}
          {/* bike */}
        {!load.onTheway && load.preparing ? (
          <View style={styles.bike}>
             <MaterialIcons name="delivery-dining" size={25} color="#006633" />
             <LottieView source={require('./loading.json')} autoPlay loop />
          </View>
        ) : null}

        {load.onTheway ? (
          <View style={styles.bikeBorder}>
             <MaterialIcons name="delivery-dining" size={25} color="#006633" />
          </View>
        ) : null}

        <View style={styles.connect}></View>
        {/* success */}
        {!load.onTheway  && !load.success ? (
          <View style={styles.check}>
             <Fontisto name="pie-chart-1" size={18} color="#006633" />
             {/* <LottieView source={require('./loading.json')} autoPlay loop /> */}
          </View>
        ) :null}
        {load.onTheway  && !load.success && load.preparing? (
          <View style={styles.checkOut}>
             <Fontisto name="pie-chart-1" size={18} color="#006633" />
             <LottieView source={require('./loading.json')} autoPlay loop />
          </View>
        ) :null}
        {load.success?
          <View style={styles.checkBorder}>
          <FontAwesome name="check" size={25} color="#006633" />
         </View>
        : null}
          
    
      </View>
      <View style={styles.main}>
        <Text style={styles.preparingLeft}>Preparing</Text>
        <Text style={styles.preparing}>On The Way</Text>
        <Text style={styles.preparingLeft}>Success</Text>
      </View>

      <View style={styles.alarm}>
        <MaterialIcons name="timer" size={25} color="#006633" />
        <Text style={{ fontSize: 18, paddingHorizontal: 4, color: "#006633" }}>
          {deliveryTime} min
        </Text>
        {load.isPaid &&
        <TouchableWithoutFeedback onPress={()=> setViewReceipt(!viewReceipt)}>
          <View style={styles.btnViewReciept}>
            <Text style={{color: "#FFFF"}}>receipt</Text>
          </View>
        </TouchableWithoutFeedback>
        }
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    // backgroundColor: "red",
    padding: 5
  },
  main: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    // backgroundColor: "blue"
  },
  connect: {
    width: 60,
    height: 3,
    backgroundColor: "#006633",
  },
  preparing: {
    width: 100,
    textAlign: "center",
    color: "#006633",
  },
  preparingLeft: {
    width: 72,
    color: "#006633",
    textAlign: "center",
  },
  alarm: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  shopping: {
    width: 77,
    height: 77,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",

  },

  shoppingBorder: {
    width: 70,
    height: 70,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 6,
    borderColor: "#006633",
  },

  bike: {
    width: 77,
    height: 77,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  bikeNotLoading: {
    width: 70,
    height: 70,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 6,
    borderColor: "#b6ebab",
  },

  bikeBorder: {
    width: 70,
    height: 70,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 6,
    borderColor: "#006633",
  },
  check: {
    width: 77,
    height: 77,
    borderRadius: 45,
    alignItems: "center",
    paddingLeft: 4,
    justifyContent: "center",
    borderWidth: 6,
    borderColor: "#b6ebab",
  },
  checkBorder: {
    width: 70,
    height: 70,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 6,
    borderColor: "#006633",
  },
  checkOut: {
    width: 77,
    height: 77,
    // borderRadius: 45,
    alignItems: "center",
    paddingLeft: 4,
    justifyContent: "center",
    // borderWidth: 6,
    borderColor: "#b6ebab",
  },
  reciept:{
    paddingHorizontal:10,
    // paddingVertical: 5,
    backgroundColor: "#006633",
  },
  btnViewReciept: {
    backgroundColor: "#006633",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    paddingHorizontal: 15,
  }
});
export default OrderTrackAnimate;
// #5CD242