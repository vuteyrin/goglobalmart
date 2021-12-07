import React, {createRef, useEffect, useRef, useState} from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  TouchableHighlight,
  ScrollView,
  Alert,
  SafeAreaView,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  InteractionManager,
} from 'react-native';
// import Header from '../../components/headerHome/Header';
import {GET_PRODUCT_BY_ID} from '../../../graphql/product';
import { FontAwesome,Ionicons,AntDesign,Entypo } from '@expo/vector-icons';
import { useQuery,useSubscription } from '@apollo/client';
import { useStateValue } from '../../../context/StateProvider';
import {setLocalstorage} from "../../../function/Function"
import { actionTypes } from '../../../context/Reducer';
import {overlapItem} from "../../../function/Function"
import { colorapp } from '../../../context/Reducer';
import {SUB_NEW_ORDER } from "../../../graphql/order";
const productDetail = ({navigation, route}) => {
  const [textAddMore,setTextAddMore] = React.useState("")
  const [product, setProduct] = React.useState({});
  const [openModel, setOpenModel] = React.useState(false);
  const [qty, setQty] = React.useState(1);
  const {id} = route.params;
  const [{ carts,customer }, dispatch] = useStateValue();
  const {data, loading, error,refetch} = useQuery(GET_PRODUCT_BY_ID, {
    variables: {
      input: {
        id: id
      },
    },
    onCompleted: ({getProductById}) => {
      setProduct(getProductById);
    },
  });
  //// function ///// 
  const handleqty = () => {
    alert("amount bigger than inStock")
  }
  const {data:newOrder} = useSubscription(SUB_NEW_ORDER,{
    onError: (e)=>{
      console.log(e)
    }
  });
  const setData =() =>{
    try{
      var newArray = [];
      const index = carts?.findIndex((ind)=>ind.product === id);
      if (index !== -1) {
        // + carts[index].qty
        carts[index] = { ...carts[index], qty: qty,remark: textAddMore };
        newArray = [...carts];
      } else {
        newArray = [
          ...carts,
          {
            product: id,
            name: product?.description,
            qty: qty,
            salePrice: product?.price,
            category: product?.category.description,
            productImage: product?.image,
            remark: textAddMore,
          },
        ];
      }
      setLocalstorage("cart",newArray);
      dispatch({
        type: actionTypes.ADD_TO_CART,
        carts: newArray
      })
    }catch (err){
      Alert.alert(err)
    }
    setQty(1)
    setTextAddMore("")
    navigation.navigate("View Cart")
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
      // console.log("tesing")
    });
    return unsubscribe;
  }, [navigation,newOrder]);
    // console.log(product?.inStock)


  return (
    <View style={styles.container}>
      <View style={styles.Cantainerimg}>
        <Image style={styles.img} source={{ uri: product?.image }}/>
      </View>
      <ScrollView>
        <View style={styles.detail}>
          <Text style={styles.productName}>{product?.description}</Text>
          <View style={styles.increment}>
            <Text style={{fontSize: 25, marginRight: 5, color: colorapp}}>
               { (product?.price*qty).toFixed(2) }$
            </Text>
            <View style={styles.bottomIncrement}>
            <TouchableWithoutFeedback onPress={() => setQty(qty <= 1 ? 1 : qty - 1)}>
                <View style={{padding:10,borderRadius:5 }}>
                 <FontAwesome name="minus" size={20} color={'#FFFF'}/>
                </View>
              </TouchableWithoutFeedback>
              <Text style={{color: '#FFFF', fontSize: 20}}>
                {qty <= 1 ? 1 : qty}
              </Text>
              <TouchableWithoutFeedback onPress={() => setQty(qty + 1)}>
                <View style={{padding:10,borderRadius:5 }}>
                  <FontAwesome name="plus" size={20} color={'#FFFF'}  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View style={styles.ProductDescription}>
            <Text style={{fontSize: 16, marginVertical: 8}}>
              Product Description
            </Text>
            <Text style={{color: product?.inStock === 0?'red':'#4A4B4D',fontWeight: "bold"}}>
             {product?.inStock === 0? "Out of Stock": `In Stock: ${product?.inStock}`}
            </Text>
          </View>
          <View style={styles.check}>
            <Text
              style={{
                fontSize: 16,
                marginHorizontal: 15,
                marginTop: 15,
              }}>
              Special instructions
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#B8B8B8',
                marginHorizontal: 15,
                marginBottom: 15,
              }}>
              Please let us know if you are allergic to anything or if we need
              to avoid anything
            </Text>
            <View style={styles.addMore}>
              <TouchableWithoutFeedback
                onPress={() => {
                  setOpenModel(true)
                }}
                >
                <Text style={{...styles.TextAdd,color: textAddMore === ""?"#CCCC": "black"}}>{textAddMore === ""? "e.g. no garlic":textAddMore }</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.addTocard}>
        <TouchableWithoutFeedback 
        disabled={product?.inStock===0}
          onPress={() => {
            qty > product?.inStock ? handleqty() :
            setData()
            }}>
          <View style={{...styles.btnadds,backgroundColor: product?.inStock===0?"#EEEE":colorapp }}>
            <Text style={{...styles.btnadd,backgroundColor: product?.inStock===0?"#8888":colorapp }}>Add to cart</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <Modal
        style={{position: 'absolute', marginTop: 300}}
        visible={openModel}
        transparent={true}>
        <TouchableWithoutFeedback onPress={() => setOpenModel(!openModel)}>
        <View style={styles.modal}>
            <View>
              <View style={{flexDirection: 'row',justifyContent: "space-between"}}>
                <Ionicons name="md-backspace-outline" size={24} color="black" onPress={() => setOpenModel(!openModel)} />
                <Text style={styles.productName}>{product?.description}</Text>
                <Text>{product?.remark}</Text>
              </View>
                <TextInput style={styles.input}
                    placeholder="e.g. no garlic...."
                    placeholderTextColor="gray"
                    returnKeyType="next"
                    autoFocus={true}
                    onChangeText={(e)=> setTextAddMore(e)}
                    value={textAddMore}
                  />
                <Text style={{padding: 5}}>{textAddMore}</Text>
            </View>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
  },
  Cantainerimg: {
    backgroundColor: 'black',
    width: Width,
    height: '30%',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 18,
    // marginVertical: 8,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  detail: {
    backgroundColor: '#FFFF',
    height: '75%',
    marginBottom: '35%',
  },

  increment: {
    paddingHorizontal: 20,
    marginTop: 10,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  bottomIncrement: {
    backgroundColor: '#EE2777',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 100,
    // paddingHorizontal: 12,
    borderRadius: 5,
  },
  ProductDescription: {
    marginVertical: 5,
    marginHorizontal: 15,
  },
  addMore: {
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  check: {
    height: '30%',
  },
  label: {
    margin: 8,
    color: '#4A4B4D',
  },
  addTocard: {
    color: '#FFF',
    alignItems: 'center',
    fontSize: 18,
    position: "absolute",
    width: "100%",
    bottom: Height/6, 
    paddingHorizontal: 15,
    // backgroundColor: '#006633',
  },
  btnadds :{
    color: '#FFF',
    backgroundColor: colorapp,
    width: "100%",
    textAlign:"center",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  btnadd :{
    color: '#FFF',
    paddingVertical: 8,
    // backgroundColor: '#006633',
    width: "100%",
    textAlign:"center",
    borderRadius: 5,
  },

  TextAdd: {
    padding: 10,
    backgroundColor: '#EEEE',
    width: '100%',
    borderRadius: 5,
 
  },
  modal: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    width: '100%',
    height: '100%',
    marginTop: '35%',
    backgroundColor: '#FFFF',
    paddingHorizontal: 10,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    position: 'relative',
    paddingTop: 10,
  },
  input: {
    backgroundColor: '#FFFF',
    borderWidth: 1,
    borderColor: '#EEEE',
    borderRadius: 6,
    height: 35,
    padding: 5,
  }
});
export default productDetail;
