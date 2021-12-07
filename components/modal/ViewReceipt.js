import React from 'react'
import {  Modal, StyleSheet, Text,Image,View, } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useStateValue } from '../../context/StateProvider';
import moment from 'moment';
const ViewReceipt = ({viewReceipt,setViewReceipt,data}) => {
    const [{customer},dispatch] = useStateValue()
    const total = data?.getSaleOrderById.grandTotal;
    // console.log(data)
    return (
        <View>
          <Modal
            transparent={true}
            visible={viewReceipt}
            animationType="slide">
            <View style={styles.containerReciept}>
              <View><AntDesign onPress={()=> setViewReceipt(!viewReceipt)} name="close" size={24} color="black" /></View>
              <View style={styles.Bg}>
               <Text style={styles.receiptText}>Receipt</Text>
               <Text style={styles.receiptText}>King Dom Of Cambodain</Text>
               <Text style={styles.receiptText}>.... _______....</Text>
               <View style={styles.logo}><Image style={styles.img} source={require("../../assets/Image/logo.png")}/></View>
               <View style={styles.table}>
                   <View style={styles.th}>
                       <View>
                            <View style={styles.td}>
                                <Text style={styles.text}>Date:</Text>
                                <Text style={styles.text}>{moment(data?.getSaleOrderById.date).format("DD-MM-YYYY" )}</Text>
                            </View>
                            <View style={styles.td}>
                                <Text style={styles.text}>Id: </Text>
                                <Text style={styles.text}>{data?.getSaleOrderById.id}</Text>
                            </View>
                       </View>
                       <View>
                        <View style={styles.td}>
                            <Text style={styles.text}>Customer :</Text>
                            <Text style={styles.text}>{customer.fname + customer.lname}</Text>
                        </View>
                        <View style={styles.td}>
                            <Text style={styles.text}>Phone:</Text>
                            <Text style={styles.text}>{customer.tel}</Text>
                        </View>
                       </View>
                   </View>
               </View>
               <View style={styles.conBody}>
                    <View style={styles.tableTh}>
                    <Text style={styles.textTH}>Item</Text>
                    <Text style={styles.textTH}>Qty</Text>
                    <Text style={styles.textTH}>Price</Text>
                    <Text style={styles.textTH}>Total</Text>
               </View>

                {data?.getSaleOrderById.products?.map(item => {
                return (
                   <View key={item.product.id} style={styles.tableTd}>
                       <Text style={styles.itemText}>{item.product.description}</Text>
                       <Text style={styles.itemText}>{item.qty} X</Text>
                       <Text style={styles.itemText}>{(item.price).toFixed(2)}$</Text>
                       <Text style={styles.itemText}>{(item.total).toFixed(2)}$</Text>
                   </View>
                 )
                })}
               </View>
               <View style={styles.conFooter}>
                <View style={styles.footer}>
                    <View style={styles.note}>
                        <Text>Note</Text>
                    </View>
                    <View style={styles.conTotal}>
                        {/* <View style={styles.rowFoot}>
                            <Text>grandTotal :</Text>
                            <Text>{total}</Text>
                        </View> */}
                        {/* <View style={styles.rowFoot}>
                            <Text>tax :</Text>
                            <Text>0.00$</Text>
                        </View>
                        <View style={styles.rowFoot}>
                            <Text>discount:</Text>
                            <Text>0.00$</Text>
                        </View> */}
                        {/* <View style={styles.rowFoot}>
                            <Text>Delivered :</Text>
                            <Text>15$</Text>
                        </View> */}
                        {/* <View style={styles.rowFoot}>
                            <Text>SubTotal :</Text>
                            <Text>15$</Text>
                        </View> */}
                        {/* <View style={styles.rowFoot}>
                            <Text>Dept :</Text>
                            <Text>15$</Text>
                        </View> */}
                        <View style={styles.rowFoot}>
                            <Text>Total:</Text>
                            <Text>{(total*1).toFixed(2)}</Text>
                    </View>
                 </View>
                </View>
                <View style={styles.thank}>
                    <Text>Thank for your support.</Text>
                 </View>
               </View>
              </View>
            </View>
          </Modal>
        </View>
    )
}
const styles = StyleSheet.create({
    ///model///
  containerReciept: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#CCCC',
  },
  input:{
    // borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    
  },
  Bg: {
    backgroundColor: '#FFFF',
    borderRadius: 5,
    height: "90%",
    width: "90%"
  },
  logo: {
      flexDirection: "row",
      paddingLeft:10
  },
  img : {
    width: 50,
    height: 50,
  },
  table:{
    paddingHorizontal: 10
  },
  th:{
      flexDirection: "row",
      justifyContent: "space-between"
  },
  td: {
      flexDirection: "row"
  },
  text: {
      color: "#808080",
      fontSize:12,
  },
  receiptText: {
      fontWeight: "bold",
      textAlign: "center",
      padding: 10,
  },
  conBody:{
    padding:10
    },
tableTh: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical:5,
    },
    textTH: {
        fontWeight: "bold"
    },
tableTd: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
},
itemText: {
    color: "#606060"
},
conFooter:{
    paddingHorizontal: 10,

},
note:{
    width: "60%",
},
conTotal: {
    width: "40%"
},
footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
},
rowFoot:{
    flexDirection: "row",
    justifyContent: "flex-end",
    // alignItems: "flex-end"
    // backgroundColor: "red",
},
thank:{
    alignItems: 'center'
}
});

export default ViewReceipt;
