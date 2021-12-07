import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import { Ionicons,Feather } from '@expo/vector-icons';
// import AntDesign from 'react-native-vector-icons/AntDesign';
import { colorapp } from '../../context/Reducer';
import { useStateValue } from '../../context/StateProvider';
const HeaderSub = ({navigation, route ,}) => {
  const [search, setSearch] = React.useState();
  const [{carts}, dispatch] = useStateValue();
  
  return (
    <SafeAreaView>
    <View style={{paddingRight: 12}}>
      <View>
        { carts.length?<View style={styles.num}>
          <Text style={styles.textNum}>
              {carts.length}
          </Text>
        </View>: null }
        <Feather name="shopping-cart" size={24} color={colorapp} onPress={() => navigation.navigate('View Cart')} />
      </View>
    </View>
</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: 10,
    backgroundColor: '#FFFF',
    // borderBottomWidth: route.name === 'Menu' ? null : 1,
    // backgroundColor: "green",

  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
    letterSpacing: 1,
    // paddingLeft: '32%',
  },
  search: {
    flexDirection: 'row',
    width: '80%',

    paddingTop: 20,
  },
  num: {
    fontSize: 14,
    color: "#FFFF",
    position: 'absolute',
    top: -10,
    left: 7,
    width: 18,
    height: 18,
    backgroundColor:"#FF1493",
    textAlign:"center",
    borderRadius:70,
  },
  textNum: {
    fontSize: 14,
    color: "#FFFF",
    position: 'absolute',
    // top: 0,
    left: 5,
    textAlign:"center",
  }
});
export default HeaderSub;
