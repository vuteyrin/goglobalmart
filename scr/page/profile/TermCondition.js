import React from "react";
import { View, Text, ScrollView,StyleSheet } from "react-native";
// import Header from "../../components/headerHome/Header";
const TermCondition = ({navigation,route}) => {
  return (
    <View style={styles.container}>
      {/* <Header navigation={navigation} route={route} /> */}
      <ScrollView>
        <Text> Go Globalmart Version 1.1</Text>
        <Text style={styles.textBody}>
          Email: goglobalschool15@gmail.com
        </Text>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 65,
 
  },
  textBody: {
    textAlign: "justify",
    paddingHorizontal: 10,
    // justifyContent: "center",
    // alignContent: "center"
  }

})

export default TermCondition;
