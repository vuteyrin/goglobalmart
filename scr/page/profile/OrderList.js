import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  SafeAreaView,
  TouchableNativeFeedback,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { GET_MY_ORDER,SUB_ORDER_ONTHEWAY,SUB_NEW_ORDER } from "../../../graphql/order";
import { useQuery,useLazyQuery ,useSubscription} from "@apollo/client";
import { useStateValue } from "../../../context/StateProvider";
import { AntDesign } from '@expo/vector-icons';
import moment from "moment";
import LottieView from 'lottie-react-native';
import { overlapItem } from "../../../function/Function";
import Root from "../../../components/root/root";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
function OrderList({ navigation,route }) {
  // const { newIdOrder } = route.params;
  const [{ customer }] = useStateValue();
  const [getSaleOrdersByCustomerId, { called, loading, data, refetch }] = useLazyQuery(GET_MY_ORDER,{
    onError: (e)=>{
      console.log(e)
    }
  });
  const {data:updateStatus} = useSubscription(SUB_ORDER_ONTHEWAY,{
    onError: (e)=>{
      console.log(e)
    }
  });
  const {data:newOrder} = useSubscription(SUB_NEW_ORDER,{
    onError: (e)=>{
      console.log(e)
    }
  });

  React.useEffect(()=>{
    getSaleOrdersByCustomerId({
      variables :{
            input: {
                id: customer.id,
                // limit: 10
                }
            }
        })
  },[getSaleOrdersByCustomerId])

  React.useEffect(()=>{
    if(newOrder){
      if(newOrder?.newSaleOrder?.customer?.id?.id === customer.id){
        refetch()
        // setNewIdOrder(newOrder?.newSaleOrder?.customer?.id?.id)
      }
    }
  },[newOrder])
  // console.log(newOrder.newSaleOrder.customer.id)
  const handleToTrackOrder = (id) => {
    navigation.navigate("Order Track", { id: id });
  };
  React.useEffect(()=>{
    if(updateStatus){
      const index = data?.getSaleOrdersByCustomerId?.data?.findIndex((ind)=>ind.id === updateStatus?.updateStatus?.id);
      if( index !== -1){
        refetch()
      }
    }
  },[updateStatus])

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if(newOrder?.newSaleOrder?.customer?.id?.id === customer.id){
        refetch()
      }
    });
    return unsubscribe;
  }, [navigation]);


  if (data?.getSaleOrdersByCustomerId.data.length === 0 || !data) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Empty...</Text>
        <AntDesign name="folderopen" size={50} color="#CCC" />
      </View>
    );
  }
  // console.log(newOrder?.newSaleOrder?.customer?.id?.id)

  return (
    <SafeAreaView style={{height: height,paddingBottom:65}}> 
    <ScrollView>
    <View style={styles.container}>
      {
        data?.getSaleOrdersByCustomerId?.data.map((item,ind)=>{
          return(
            <TouchableNativeFeedback key={ind} onPress={() => handleToTrackOrder(item?.id)}>
            <View style={styles.containerOrder}>
              <View style={styles.cart}>
                <View style={styles.title}>
                  <Text style={styles.textTitle}>#{overlapItem(item?.id)}</Text>
                  {!item?.status?.isPaid ? (
                    <LottieView
                      source={require("./loading-pending.json")}
                      autoPlay
                      loop
                      style={{
                        marginLeft: Platform.OS === "ios" ? "27%" : "60%",
                      }}
                    />
                  ) : null}
                </View>
                <View>
                  <Text style={styles.text}>
                    {moment(item?.date).format("DD/MMM/YYYY HH:mm:ss")}
                  </Text>
                  <Text
                    style={{
                      color: item?.status?.isPaid ? "#B8B8B8" : "red",
                    }}
                  >
                    {item?.status?.isPaid ? "Delivered" : "Pending"}
                  </Text>
                  <Text>Total : {(item?.subTotal*1).toFixed(2)}$</Text>
                </View>
              </View>
            </View>
          </TouchableNativeFeedback>
          )
        })
      }
    </View>
    </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingBottom: Platform.OS ==="ios"?150:65,
  },
  containerOrder: {
    width: "100%",
    paddingHorizontal: "2%",
  },
  title: {
    flexDirection: "row",
    fontSize: 18,
    color: "#5CD242",
    paddingBottom: 10,
  },
  textTitle: {
    color: "#5CD242",
    fontSize: 12,
  },
  cart: {
    backgroundColor: "#FFFF",
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginVertical: 5,
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
  boxOrderList: {
    marginLeft: 5,
    marginRight: 5,
    // marginTop: 10,
  },
  text: {
    color: "#B8B8B8",
  },
});
export default OrderList;


