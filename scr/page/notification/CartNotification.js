import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Moment from "moment";
const CartNotification = ({ title, date, message }) => {
  return (
    <View style={styles.container}>
      <View style={styles.cart}>
        <View style={styles.title}>
          <Text style={styles.textTitle}>
            <Ionicons
              name="notifications-circle-outline"
              size={20}
              color="#808080"
            />
            {title}
          </Text>
          <Text style={styles.textTitle}>
            {Moment(date).format("D/MMM/YYYY")}
          </Text>
        </View>
        <View>
          <Text style={{ color: "#B8B8B8", marginBottom: 10 }}>
            {Moment(date).format("hh:mm a")}
          </Text>
        </View>
        <View>
          <Text>{message}</Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    // width: "100%",
    marginHorizontal: "5%",
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 18,
    color: "#5CD242",
    paddingBottom: 10,
  },
  textTitle: {
    color: "#5CD242",
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
});

export default CartNotification;