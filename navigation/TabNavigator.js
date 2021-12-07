// import React from "react";
import { Button, View, Text, StyleSheet,AsyncStorage,TouchableWithoutFeedback } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  MainStackNavigator,
  OfferStackNavigator,
  ProfileStackNavigator,
  NotificationStackNavigator,
  LoginStackNavigator,
  OrderStackNavigator
 
} from "./StackNavigator";
import { FontAwesome5,Ionicons,FontAwesome } from "@expo/vector-icons";
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import {useStateValue} from '../context/StateProvider';
import { setLocalstorage } from "../function/Function";
import { Badge } from 'react-native-elements'
import { GET_MY_ORDER,GET_ORDER_PANDING,SUB_ORDER_ONTHEWAY,SUB_NEW_ORDER  } from "../graphql/order";
import {useQuery,useLazyQuery, useSubscription} from '@apollo/client';
import moment from 'moment';
import { actionTypes } from "../context/Reducer";
import { colorapp } from "../context/Reducer";

const Tab = createBottomTabNavigator();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
const BottomTabNavigator = () => {
  const [{token,customer,notificat,badgeNoti},dispatch] = useStateValue();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [newIdOrder,setNewIdOrder] = useState("");
  const [date,setDate] =useState(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
  const [newObject,setNewObject] = useState({})
  const {data: BadgeDB,refetch} = useQuery(GET_ORDER_PANDING,{
    variables: {
      input: {
        id: customer.id
      }
    },
   onCompleted: ()=>{
    
   }
  })
  const {data:newOrder} = useSubscription(SUB_NEW_ORDER,{
    onError: (e)=>{
      console.log(e)
    }
  });
  
  const {data:updateStatus} = useSubscription(SUB_ORDER_ONTHEWAY);
  
  React.useEffect(()=>{
    if(newOrder){
      if(newOrder?.newSaleOrder?.customer?.id?.id === customer.id){
        refetch()
        setNewIdOrder(newOrder?.newSaleOrder?.customer?.id?.id)
      }
    }
  },[newOrder])
 
  React.useEffect(()=>{
    if(updateStatus !== undefined){
      const result = notificat.filter(item => item.new === true);
      dispatch({
        type : actionTypes.BADGENOTI,
        badgeNoti: result.length, 
      })
    // console.log(result)
    // console.log(updateStatus)
    }
 
  },[updateStatus])

  const setNotificationLocalStorage = async (value) => {
    await AsyncStorage.setItem("notification", JSON.stringify(value));
    dispatch({
      type: actionTypes.NOTIFICATION,
      notificat: value,
    });
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
        var newArray = [
        {
        body: notification?.request?.content?.body,
        title: notification?.request?.content?.title,
        date: date,
        new: true,
        },...notificat
    ]
      setNotificationLocalStorage(newArray)
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  },[updateStatus]);
  
  async function registerForPushNotificationsAsync() {
    let tokens;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      tokens = (await Notifications.getExpoPushTokenAsync()).data;
      if(Object.keys(token).length == 0){
        setLocalstorage("token",tokens)
        dispatch({
          type: "TOKEN",
          token: tokens,
        })
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return tokens;
  }

  // console.log(badgeNoti)

  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        style: {
          position: "absolute",
          elevation: 0,
          backgroundColor: "#ffff",
          borderRadius: 5,
          height: Platform.OS === "ios"? 80: 60,
          ...styles.shadow,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={MainStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                top: 0,
              }}
            >
              <FontAwesome5
                name="home"
                size={18}
                color={focused ? colorapp : "#748c94"}
              />
              <Text style={{ color: focused ? colorapp : "#748c94" }}>
                Menu
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Notifcation"
        component={NotificationStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                top: 0,
              }}
              >
              <Ionicons name="notifications"
                size={20} color={focused ? colorapp : "#748c94"} 
                />
              <View style={styles.bagdeNoti}>
                {badgeNoti !== 0 ?
                  <Badge value={badgeNoti} status="error" />
                  :null}
              </View>
              <Text  style={{ color: focused ? colorapp : "#748c94" }}>
                Notifications
              </Text>
            </View>

          ),
        }}
      />

      <Tab.Screen
        name="Offer"
        component={OfferStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                top: 0,
              }}
            >
              <FontAwesome name="shopping-bag" size={18}  color={focused ? colorapp : "#748c94"}/>
              {/* <View style={styles.bagde}>
                {BadgeDB?.getSaleOrdersBadgeByCustomerId !== 0 ?
                  <Badge value={BadgeDB?.getSaleOrdersBadgeByCustomerId} status="error" />
                  :null}
                </View> */}
              <Text style={{ color: focused ? colorapp : "#748c94" }}>
                Offer
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                top: 0,
              }}
              >
              <FontAwesome name="user-circle-o" size={18}color={focused ?  colorapp : "#748c94"}/>
              <Text style={{ color: focused ?  colorapp : "#748c94" }}>
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  TabStyle: {},
  shadow: {
    //working for iOS
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    //working for android
    elevation: 5,
  },
  bagde: {
    position: 'absolute',
    zIndex: 1,
    top: -5,
    right: 10,
  },
  bagdeNoti: {
    position: 'absolute',
    zIndex: 1,
    top: -5,
    right: 20,
  },
});

export default BottomTabNavigator;
