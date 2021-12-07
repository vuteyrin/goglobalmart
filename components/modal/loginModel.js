import * as React  from "react";
import { useStateValue } from "../../context/StateProvider";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from 'moment';
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import firebase from "../../api/firebase"
import { useMutation } from "@apollo/client";
import { AntDesign,Ionicons,EvilIcons,Feather} from '@expo/vector-icons';
import { CREATE_NEW_CUSTOMER} from "../../graphql/customer";
import {noZero,setLocalstorage} from '../../function/Function';
export default function LoginModal({navigation, openModalLogin, setOpenModalLogin}) {
  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();
  const [text, onChangeText] = React.useState();
  const [setCustomers] = useMutation(CREATE_NEW_CUSTOMER,{
    onError : (e) => {
      console.log(e)
    }
  });
  const [modalVisible, setModalVisible] = React.useState(false);
  const [{ customer,token,location }, dispatch] = useStateValue();
  const [firstName,setFirstName] = React.useState("");
  const [lastName,setLastName] = React.useState("");
  const [num,setNum] = React.useState(0)
  const firebaseConfig = firebase.apps.length
    ? firebase.app().options
    : undefined;
  const [message, showMessage] = React.useState(
    !firebaseConfig || Platform.OS === "web"
      ? {
          text: "To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device.",
        }
      : undefined
  );
 
  const setCustomerLocalStorage =(value) => {
    setLocalstorage("customer",value);
    dispatch({
      type: "CUSTOMER",
      customer: value,
    });
  };

  const handleNumber = async () => {
    let number = noZero(text);
    let phoneNumber = "+855" + number;
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneProvider.verifyPhoneNumber(phoneNumber,recaptchaVerifier.current);
      setVerificationId(verificationId);
      setModalVisible(!modalVisible);
    } catch (err) {
      showMessage({ text: `Error: ${err.message}`, color: "red" });
    }
    
  };
  const handleVerify = async () => {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(verificationId,verificationCode);
      await firebase
        .auth()
        .signInWithCredential(credential)
        .then((credential) => {
          var user = credential;
          Promise.all(
            setCustomers({
              variables: {
                input: {
                  fname: firstName,
                  lname: lastName,
                  tel: user?.user?.phoneNumber,
                  uid: user?.user?.uid,
                  token: token,
                  image: "https://cdn.icon-icons.com/icons2/2643/PNG/512/male_boy_person_people_avatar_icon_159358.png",
                  geolocation: location,
                }
              },
              update(_,result){
                setCustomerLocalStorage(result.data.setCustomers);
                // navigation.navigate("Review Payment")
                setOpenModalLogin(!openModalLogin);
              }
            })
          )
        });
    } catch (err) {
      showMessage({
        text: `Error: ${err.message}`,
        color: "red",
      });
    }
  };
  const attemptInvisibleVerification = true;
  return (
      <Modal visible={openModalLogin}>
          <TouchableWithoutFeedback style={{backgroundColor: "red"}} onPress={Keyboard.dismiss}>
            <View style={{paddingTop: Platform.OS ==="ios"?40: 0}}>
            <View style={{marginTop: 5}}>
              <Ionicons name="arrow-back" size={24} color="black" onPress={()=> setOpenModalLogin(!openModalLogin)} />
            </View>
              {customer?.uid ? null : (
                  <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={firebaseConfig}
                    attemptInvisibleVerification={attemptInvisibleVerification}
                  />
                )}
              <View style={{ justifyContent: "center",alignItems: "center"}}>
                <View style={styles.conainLogo}>
                  <Image style={styles.image} resizeMode="contain" source={require("../../assets/Image/logo.png")}/>
                  <Text style={{ textAlign: "center", color: "#696969" }}>
                    Discover the best foods from over 1,000 type
                  </Text>
                  <Text style={{ textAlign: "center", color: "#696969" }}>
                    and fast delivery to your doorstep
                  </Text>
                </View>
        <View style={{width:"90%",justifyContent: "center"}}>
        {/* contaner input  */}
          <View style={styles.containerInputName}>
           <TextInput style={styles.input}
              autoFocus
              placeholder="First name"
              placeholderTextColor = "gray"
              value={firstName}
              onChangeText={(e) =>setFirstName(e)}/>
            <TextInput style={styles.input}
              placeholder="Last name"
              placeholderTextColor = "gray"
              value={lastName}
              onChangeText={(e) =>setLastName(e)}/> 
          </View>
           {/* contaner input  */}
           <View style={styles.containerInput}>
            <Image style={styles.imageIcon} source={require("../../assets/Image/khmerFlag.png")}/>
            <Text style={{fontSize: 14,width: "15%",paddingTop:7}}>+855</Text>
            <TextInput style={{fontSize: 14,width: "70%",}}
              autoCompleteType="tel"
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              placeholder="12345678"
              placeholderTextColor = "gray"
              value={text}
              onChangeText={(e) =>onChangeText(e)}/>
          </View>
          {/* containter btn send */}
          <View>
            {/* <Text>{num}</Text> */}
            <TouchableOpacity
              style={styles.addItem}
              underlayColor="#FFF"
              activeOpacity={0.9}
              onPress={() => handleNumber()}
            >
              <Text style={{ color: "#FFF" }}>Send</Text>
            </TouchableOpacity>
              {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
            </View>
          </View>
          
          {message ? (
            <TouchableOpacity
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: 0xffffffee, justifyContent: "center" },
              ]}
              onPress={() => showMessage(undefined)}
            >
              <Text
                style={{
                  color: message.color || "blue",
                  fontSize: 17,
                  textAlign: "center",
                  margin: 20,
                }}
              >
                {message.text}
              </Text>
            </TouchableOpacity>
          ) : undefined}
          {/* alert model logout */}
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
              }}
            >
              <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <AntDesign name="close" size={24} color="black" 
                onPress={() => {
                  setModalVisible(!modalVisible);
                }} />
                <Text style={styles.modalText}>Verify code</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#EEEE",
                      paddingHorizontal: 12,
                      borderRadius: 5,
                    }}
                  >
                    <TextInput
                      style={{
                        marginVertical: 2,
                        fontSize: 14,
                        paddingHorizontal: 40,
                        paddingVertical: Platform.OS === "ios"? 8: 0,
                      }}
                      placeholderTextColor = "gray"
                      autoFocus
                      autoCompleteType="tel"
                      keyboardType="phone-pad"
                      textContentType="telephoneNumber"
                      editable={!!verificationId}
                      placeholder="Enter verification code"
                      onChangeText={setVerificationCode}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      handleVerify();
                      setModalVisible(!modalVisible);
                      
                      
                    }}
                    style={{
                      backgroundColor: "#006633",
                      paddingHorizontal: 95,
                      paddingVertical: 7,
                      width: "100%",
                      marginTop: 12,
                      borderRadius: 6,
                      color: "#FFFF",
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFFF",
                      }}
                    >
                      CONFIRM
                    </Text>
                  </TouchableOpacity>
                  {/* <Text>{num}</Text> */}
                  <ActivityIndicator size="large" color="#006633" />
                </View>
              </View>
            </Modal>
          </View>
          {/*  */}  
        </View>
        </View>
        </TouchableWithoutFeedback>
      </Modal>

  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: "absolute",
    left: 0,
    top: 0,
    opacity: 0.6,
    backgroundColor: "black",
  },
  // //////
  centeredView: {
    flex: 1,
    
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFF",
    // opacity: 0.9
    
  },

  modalView: {
    // height: "50%",
    backgroundColor: "#FFFF",
    borderRadius: 5,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: "30%",
    margin: 12,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 5,
    textAlign: "center",
    color: "#808080",
    fontSize: 18,
  },
  addItem: {
    width: "100%",
    backgroundColor: "#006633",
    padding: 7,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    fontSize: 18,
  },
  containerInput: {
    width: "100%",
    height: 33,
    flexDirection: "row",
    alignContent: "center",
    backgroundColor: "#EEEE",
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
    // borderWidth: 1,
  },
  containerInputName: {
    width: "100%",
    height: 33,
    flexDirection: "row",
    alignContent: "center",
    // backgroundColor: "#EEEE",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  imageIcon: {
    width: "8%",
    height: "40%",
    marginVertical: 10,
    marginTop: 10,
    marginRight: 5,
  },
  conainLogo: {
    width: "100%",
    height: "30%",
    marginBottom: "15%",
    alignItems: "center",
    marginTop: "20%",
  },
  image: {
    resizeMode: "contain",
    width: "80%",
    height: "80%",
    marginBottom: "5%",
  },
  input:{
    fontSize: 14,
    width: "48%",
    height:'100%',
    backgroundColor: "#EEEE",
    padding: 5,
    borderRadius: 5,
    color: "black"
  },
  

});
