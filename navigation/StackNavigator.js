import React,{useState,useEffect} from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Dimensions } from "react-native";
import Home from "../scr/page/home/Home";
import Header from "../components/header/Header";
import AllItem from "../scr/page/home/allItem";
import HeaderSub from "../components/header/HeaderSub"
import Profile from "../scr/page/profile/Profile";
import Notification from "../scr/page/notification/Nofication";
import Offer from "../scr/page/offer/Offer";
import Map from "../scr/page/map/Map";
import * as Location from 'expo-location';
import { useStateValue } from "../context/StateProvider";
import { setLocalstorage } from "../function/Function";
import TermCondition from "../scr/page/profile/TermCondition";
import EditProfile from "../scr/page/profile/EditeProfile";
import OrderList from "../scr/page/profile/OrderList";
import Noti from "../scr/page/notification/NotiTest";
import productDetail from "../scr/page/home/productDetail";
import ViewCart from "../scr/page/viewcart/ViewCart";
import ReviewPayment from "../scr/page/home/reviewPayment";
import OrderTrack from "../scr/page/home/orderTrack";
import Contact from "../scr/page/profile/Contact";
import Search from "../scr/page/search/Search";
import { colorapp } from "../context/Reducer";
import { useQuery,useLazyQuery ,useSubscription} from "@apollo/client";
import { GET_MY_ORDER,SUB_ORDER_ONTHEWAY,SUB_NEW_ORDER } from "../graphql/order";


const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#FFFF",
    // width: screenWidth,
  },
  // headerTintColor: "white",
  headerBackTitle: colorapp,
};
const Stack = createStackNavigator();
const MainStackNavigator = () => {
  const [{location,customer},dispatch]= useStateValue();
  const [locations, setLocation] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      // setLocation(location);
      setLocation({lat:location.coords.latitude, long:location.coords.longitude });
      setLocalstorage("location",{lat:location.coords.latitude, long:location.coords.longitude });
      dispatch({
        type: "LOCATION",
        location: {lat:location.coords.latitude, long:location.coords.longitude },
      })
    };
 
  React.useEffect(()=>{
    if(Object.keys(location).length === 0){
      getLocation();
    }  
  },[])
  return (
    <Stack.Navigator >
      <Stack.Screen
        name="Menu"
        component={Home}
        // options={{headerTitle: 'Menu', headerShown: true}}
        options={({ navigation, route }) => {
          return {
            // headerLeft: "Menu",
            headerRight: (props) => (
              <Header navigation={navigation} route={route} />
            ),
          };
        }}
      /> 
       <Stack.Screen
        name="All Item"
        component={AllItem}
        options={({ navigation, route }) => {
          return {
            // headerShown: false,
            // headerTitle: () => <HeaderSub navigation={navigation} route={route} />,
            headerRight: (props) => (
              <HeaderSub navigation={navigation} route={route} />
            ),
          };
        }}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={({ navigation, route }) => {
          return {
            // headerShown: false,
            headerRight: (props) => (
              <HeaderSub navigation={navigation} route={route} />
            ),
          };
        }}
      />
        <Stack.Screen
        name="Product Detail"
        component={productDetail}
        options={({ navigation, route }) => {
          return {
            // headerShown: false,
            headerRight: (props) => (
              <HeaderSub navigation={navigation} route={route} />
            ),
          };
        }}
      />
      <Stack.Screen
        name="View Cart"
        component={ViewCart}
        options={({ navigation, route }) => {
          return {
            // headerShown: false,
            headerRight: (props) => (
              <HeaderSub navigation={navigation} route={route} />
            ),
          };
        }}
      />
      <Stack.Screen
        name="Review Payment"
        component={ReviewPayment}
        options={({ navigation, route }) => {
          return {
            // headerShown: false,
            headerRight: (props) => (
              <HeaderSub navigation={navigation} route={route} />
            ),
          };
        }}
      />
      <Stack.Screen
        name="Order Track"
        component={OrderTrack}
        options={({ navigation, route }) => {
          return {
            // headerShown: false,
            headerRight: (props) => (
              <HeaderSub navigation={navigation} route={route} />
            ),
          };
        }}
      />

    </Stack.Navigator>
  );
};


const OfferStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="Offer"
        component={Offer}
        options={({ navigation, route }) => {
          return {
            
            headerRight: (props) => (
              <Header navigation={navigation} route={route} />
            ),
          };
        }}
      />
    </Stack.Navigator>
  );
};
const OrderStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="Order"
        component={OrderList}
        options={({ navigation, route }) => {
          return {
            
            headerRight: (props) => (
              <Header navigation={navigation} route={route} />
            ),
          };
        }}
      />
    </Stack.Navigator>
  );
};
const NotificationStackNavigator = () => {
 
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={({ navigation, route }) => {
          return {
            headerRight: (props) => (
              <Header navigation={navigation} route={route} />
            ),
          };
        }}
      />
    </Stack.Navigator>
  );
};

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={({ navigation, route }) => {
          return {
            headerRight: (props) => (
              <Header navigation={navigation} route={route} />
            ),
          };
        }}
      />
       <Stack.Screen
        name="Edit Profile"
        component={EditProfile}
        // options={({ navigation, route }) => {
        //   return {
        //     headerTitle: () => <HeaderSub navigation={navigation} route={route} />,
        //   };
        // }}
      />
  
        <Stack.Screen
        name="Map"
        component={Map}
        // options={({ navigation, route }) => {
        //   return {
        //     headerTitle: () => <HeaderSub navigation={navigation} route={route} />,
        //   };
        // }}
      />

        <Stack.Screen
        name="Term And Condition"
        component={TermCondition}
        // options={({ navigation, route }) => {
        //   return {
        //     headerTitle: () => <HeaderSub navigation={navigation} route={route} />,
        //   };
        // }}
      />
        <Stack.Screen
        name="Contact Us"
        component={Contact}
        // options={({ navigation, route }) => {
        //   return {
        //     headerTitle: () => <HeaderSub navigation={navigation} route={route} />,
        //   };
        // }}
      />
        <Stack.Screen
        name="noti"
        component={Noti}
        // options={({ navigation, route }) => {
        //   return {
        //     headerTitle: () => <HeaderSub navigation={navigation} route={route} />,
        //   };
        // }}
      />
        <Stack.Screen
        name="Order List"
        component={OrderList}
        // options={({ navigation, route }) => {
        //   return {
        //     headerTitle: () => <HeaderSub navigation={navigation} route={route} />,
        //   };
        // }}
      />
     
    </Stack.Navigator>
  );
};



export {
  MainStackNavigator,
  OfferStackNavigator,
  ProfileStackNavigator,
  NotificationStackNavigator,
  OrderStackNavigator
};
