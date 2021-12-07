import React, {useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  Image,
  View,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {useStateValue} from '../../context/StateProvider';
import {setLocalstorage} from '../../function/Function';
import {useQuery} from '@apollo/client';
import {GET_PRODUCT_BY_ID} from '../../graphql/product';
// import {API_URL} from '../../../context/reducer';
import { EvilIcons } from '@expo/vector-icons';
import { FontAwesome,MaterialCommunityIcons,AntDesign} from '@expo/vector-icons';
import {actionTypes} from '../../context/Reducer';

const UpateCart = ({openModal, setOpenModal, id}) => {
  const [{carts}, dispatch] = useStateValue();
  const [product, setProduct] = useState({});
  const [openDelete, setOpenDelete] = useState(false);
  const [qty, setQty] = useState(0);
  const [remark,setRemark] = useState("")
  const {data, loading, error} = useQuery(GET_PRODUCT_BY_ID, {
    variables: {
        input: {
            id: id
        },
    },
    onCompleted: ({getProductById}) => {
      setProduct(getProductById);
    },
  });
  /// fuction ////
  const createTwoButtonAlert = () =>
    Alert.alert(
      "Product Instock",
      "Qty bigger than stock",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => setOpenModal(!openModal) }
      ]
  );
  const setData = () => {
    try {
      var newArray = [];
      const index = carts?.findIndex(ind => ind.product === id);
      if (index !== -1) {
        carts[index] = {...carts[index], qty: qty,remark: remark};
        newArray = [...carts];
      } else {
        newArray = [
          ...carts,
          {
            product: id,
            name: product?.productName,
            qty: qty,
            salePrice: product?.price,
            category: product?.category,
            productImage: product?.productImage,
          },
        ];
      }
      setLocalstorage('cart', newArray);
      dispatch({
        type: actionTypes.ADD_TO_CART,
        carts: newArray,
      });
    } catch (err) {
      Alert.alert(err);
    }
    setOpenModal(!openModal)
  };
  ///end////
  const getNewArray = carts.filter(item => item.product === id);
  const getQty = getNewArray[0].qty;
  React.useEffect(() => {
    setQty(getQty);
    setRemark(getNewArray[0].remark)
  }, []);
  ///function delete /////
  const deletItem = async () => {
    const index = carts?.findIndex(ind => ind.product === id);
    carts.splice(index, 1);
    setLocalstorage('cart', carts);
    dispatch({
      type: actionTypes.ADD_TO_CART,
      carts: carts,
    });
  };
  // console.log(openDelete)
  return (
    <View style={styles.centeredView}>
      <Modal transparent={true} visible={openModal} animationType="slide">
      <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss}}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableWithoutFeedback onPress={() => setOpenModal(!openModal)}>
              <AntDesign name="close" size={25} color={'#EE2777'} />
            </TouchableWithoutFeedback>
            <View style={styles.Cantainerimg}>
              <Image style={styles.img} source={{ uri: product?.image,}}/>
              <View style={styles.dis}>
                {/* <Text style={{marginVertical: 10}}>Add more</Text> */}
                <TextInput value={remark} placeholder="eg: no ice"onChangeText={(e)=> setRemark(e)}/>
                <Text style={{marginVertical: 10}}>{remark}</Text>
              </View>
            </View>
            <Text style={styles.modalText}>{product?.description}</Text>
            <Text style={{paddingBottom: 15, color: '#EE2777'}}>inStock : {product?.inStock}</Text>
            <View style={{flexDirection: "row"}}>
              <Text style={{paddingBottom: 15, color: '#EE2777'}}>{qty}</Text>
              <Text style={{color: "black"}}> x </Text> 
              <Text style={{paddingBottom: 15, color: '#EE2777'}}>{(product?.price * qty).toFixed(2)}$</Text>
            </View>
            <View style={styles.productTitle}>
              <TouchableOpacity onPress={()=>{setOpenDelete(!openDelete),setOpenModal(!openModal),deletItem()}}>
                <View>
                  <MaterialCommunityIcons name="delete" size={35} color={'#EE2777'}/>
                </View>
              </TouchableOpacity>
              <View style={styles.bottomIncrement}>
                <TouchableWithoutFeedback 
                  onPress={() => setQty(qty <= 1 ? 1 : qty - 1)}>
                  <View style={{paddingHorizontal:15}}>
                    <FontAwesome name="minus" size={20} color={'#FFFF'} />
                  </View>
                </TouchableWithoutFeedback>
                <Text style={{color: '#FFFF', fontSize: 20}}>{qty}</Text>
                <TouchableWithoutFeedback onPress={() => setQty(qty + 1)}>
                  <View style={{paddingHorizontal:15}}>
                    <FontAwesome name="plus" size={20} color={'#FFFF'} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                qty > product?.inStock ? createTwoButtonAlert():
                setData();
                }}>
              <Text style={styles.textStyle}>ok</Text>
            </Pressable>
          </View>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal transparent={true} visible={openDelete} animationType="slide">
        <View style={styles.containerDelete}>
          <View style={styles.deleteBg}>
            <Text style={{padding: 20}}>
              Do you want to delete this item!..
            </Text>
            <View style={styles.YesNo}>
              <TouchableWithoutFeedback
                onPress={() => {
                    deletItem(),
                    setOpenDelete(!openDelete),
                    setOpenModal(!openModal);
                }}>
                <Text
                  style={{
                    backgroundColor: '#006633',
                    width: '50%',
                    borderRightWidth: 1,
                    borderRightColor: '#FFFF',
                    textAlign: 'center',
                    paddingVertical: 10,
                    borderBottomLeftRadius: 12,
                    color:"#FFFF"
                  }}>
                  yes
                </Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => setOpenDelete(!openDelete)}>
                <Text
                  style={{
                    backgroundColor: '#006633',
                    width: '50%',
                    textAlign: 'center',
                    paddingVertical: 10,
                    borderBottomRightRadius:12,
                    color:"#FFFf"
                  }}>
                  No
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  modalView: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    elevation: 5,
    width: '100%',
  },
  button: {
    marginTop: 20,
    padding: 10,
    elevation: 2,
  },

  buttonClose: {
    backgroundColor: '#006633',
    borderRadius: 5,
    width: 120,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontWeight: 'bold',
    paddingVertical: 12,
    // flexDirection: "row"
  },
  Cantainerimg: {
    width: '100%',
    flexDirection: 'row',
  },
  img: {
    width: 100,
    height: 100,
    marginTop: 5,
  },
  dis: {
    width: '70%',
    height: 35,
    textAlign: 'justify',
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "#EEEE",
    margin:5
  },
  productTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomIncrement: {
    backgroundColor: '#EE2777',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 110,
    // paddingHorizontal: 12,
    borderRadius: 5,
    // backgroundColor: "green"
  },
  ////// delete ////
  containerDelete: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',

    backgroundColor: "#CCCC",

  },
  deleteBg: {
    backgroundColor: '#FFFF',
    borderRadius: 5,
    
  },
  YesNo: {
    width: 250,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#006633',
    borderRadius: 5,
  },
});

export default UpateCart;
