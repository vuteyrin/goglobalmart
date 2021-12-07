import React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabNavigator from "./TabNavigator";
// import AsyncStorage from '@react-native-community/async-storage';
import { Ionicons,AntDesign } from "@expo/vector-icons";
import { actionTypes } from "../context/Reducer";
import { useStateValue } from "../context/StateProvider";
import { setLocalstorage } from "../function/Function";
import * as ImagePicker from 'expo-image-picker';


const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  const [{carts,customer,notificat,location,token},dispatch] = useStateValue();
  const getLocalStorage = async () => {
    //cart
    let cart = await AsyncStorage.getItem("cart");
    let newCarts = cart === null ? [] : JSON.parse(cart);
    dispatch({
      type: "ADD_TO_CART",
      carts: newCarts,
    });
    // customner
    let customer = await AsyncStorage.getItem("customer");
    let newCusotmer = customer === null ? {} : JSON.parse(customer);
    dispatch({
      type: "CUSTOMER",
      customer: newCusotmer,
    });
    //location
    let location =  await AsyncStorage.getItem("location");
    let newLocation = location === null ? {}: JSON.parse(location);
    dispatch({
      type: "LOCATION",
      location: newLocation,
    })
     //token
     let token =  await AsyncStorage.getItem("token");
     let newToken = token === null ? {}: JSON.parse(token);
     dispatch({
       type: "TOKEN",
       token: newToken,
     })
    //notification
    let notifications = await AsyncStorage.getItem("notification");
    let newNotifications = notifications === null ? [] : JSON.parse(notifications);
    // console.log(newNotifications)
    dispatch({
      type: actionTypes.NOTIFICATION,
      notificat: newNotifications,
    });
    //itemOrder
       let itemOrder =  await AsyncStorage.getItem("itemOrder");
       let newItemOrder = itemOrder === null ? {}: JSON.parse(itemOrder);
       dispatch({
         type: "ITEMORDER",
         itemOrder: newItemOrder,
       })
  };
  React.useEffect(() => {
    getLocalStorage();
  },[]);
  // console.log(location)
  return (
    <Drawer.Navigator initialRouteName="Home"
     drawerStyle={{ width: "70%" }}
    //  drawerContent={(props) => <Profile {...props}/>}
     >
      <Drawer.Screen
        name="Home"
        component={BottomTabNavigator}
        options={{
          title: "Back",
          drawerIcon: ({ focused, size }) => (
            <Ionicons
              name="chevron-back"
              size={24}
              color={focused ? "#006633" : "#748c94"}
            />
          ),
        }}
      />
       {/* <Drawer.Screen
        name="login"
        component={Login}
        options={{
          title: "Login",
          drawerIcon: ({ focused, size }) => (
            <AntDesign name="login" size={25} color={focused ? "#e32f45" : "#748c94"}/>
          ),
        }}
      /> */}
     
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
