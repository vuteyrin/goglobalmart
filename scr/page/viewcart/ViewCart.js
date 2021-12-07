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
import {useStateValue} from '../../../context/StateProvider';
import {getLocalstorage,overlapItem} from '../../../function/Function'
import {API_URL} from '../../../context/Reducer';
import { Ionicons} from '@expo/vector-icons';
import LoginModal from '../../../components/modal/loginModel';
import { colorapp } from '../../../context/Reducer';
import UpateCart from '../../../components/modal/updataCart';
const ViewCart = ({navigation, route}) => {
  const [{carts, customer}, dispathc] = useStateValue();
  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState();
  const [openModalLogin,setOpenModalLogin] = useState(false)

  const totalPrice = carts.reduce((a, b) => {
    return a + b.salePrice * b.qty;
  }, 0);
// console.log(carts)
  return (
    <View style={styles.container}>
      <LoginModal navigation={navigation} setOpenModalLogin={setOpenModalLogin} openModalLogin={openModalLogin} />
      {openModal && (
        <View style={{position: 'absolute'}}>
          {/* <Cart openModal={openModal} setOpenModal={setOpenModal} id={id} /> */}
          <UpateCart openModal={openModal} setOpenModal={setOpenModal} id={id}/>
        </View>
      )}
      <View style={styles.imageHeader}>
        <Image style={styles.img} source={require('../../../assets/Image/banner2.png')}/>
      </View>
      <View style={styles.body}>
        <View style={styles.footer}>
          <View style={styles.subFooter}>
            <View style={styles.ChangeCash}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{marginLeft: 5, color: colorapp}}>
                  Payment Method
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color: colorapp}}> Cash only </Text>
              </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {carts.map(item => {
                return (
                  <TouchableWithoutFeedback
                    key={item.product}
                    onPress={() => {
                      setOpenModal(true), setId(item.product);
                    }}>
                    <View style={styles.OrderItem}>
                      <Image
                        style={styles.imgItem}
                        source={{uri:item.productImage}}
                      />
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
                      <Text style={{width: '25%',textAlign:"center"}}>{(item.salePrice * item.qty).toFixed(2)}$</Text>
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
            {carts?.length != 0 ? (
              <View  style={styles.addItems}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    Object.keys(customer).length === 0
                      ? setOpenModalLogin(!openModalLogin)
                      : navigation.navigate('Review Payment');
                  }}>
                  <Text style={styles.addItem}>Review Payment</Text>
                </TouchableWithoutFeedback>
              </View>
            ) : null}
            <View  style={styles.addItems}> 
              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate('All Item');
                }}>
                <Text style={styles.addItem}>Add Item</Text>
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
  imageHeader: {
    position: 'relative',
    height: Platform.OS === 'ios' ? '20%' : '20%',
    width: width,
    zIndex: -1,
  },

  img: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  body: {
    width: width,
    height: '80%',
  },
  ChangeCash: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: '1%',
    // backgroundColor: 'green',
    width: '100%',
  },
  subFooter: {
    // backgroundColor: 'red',
    height: 315,
    width: width,
    marginBottom: 400,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: colorapp
  },
  /// cart item///
  OrderItem: {
    flexDirection: 'row',
    // justifyContent: "space-between",
    width: width,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#EEEE',
    paddingVertical: 5,
    // backgroundColor: "red"
  },

  imgItem: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  addItem: {
    width: '100%',
    backgroundColor: colorapp,
    padding: 3,
    borderRadius: 5,
    justifyContent: 'center',
    textAlign: 'center',
    marginVertical: 5,
    // fontSize: 16,
    color: '#FFFF',
  },
  addItems: {
    width: '100%',
    backgroundColor: colorapp,
    // padding: 8,
    borderRadius: 5,
    justifyContent: 'center',
    textAlign: 'center',
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
 
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
    // backgroundColor: "blue"
  },
});

export default ViewCart;
