import * as React from "react";
import { useStateValue } from "../../../context/StateProvider";
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
  Keyboard,
  ScrollView,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import firebase from "../../../api/firebase";
import { useQuery } from "@apollo/client";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { useMutation } from "@apollo/client";
import { AntDesign ,Entypo} from '@expo/vector-icons';
import { CREATE_NEW_CUSTOMER, CREATE_TEST } from "../../../graphql/customer";
import {noZero} from '../../../function/Function';
export default function Login({ navigation }) {
  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();
  const [text, onChangeText] = React.useState();
 
  const [createCustomer, { error }] = useMutation(CREATE_NEW_CUSTOMER, {
    onCompleted({ createCustomer }) {
      setCustomerLocalStorage(createCustomer);
    },
  });
  const [createTests, { data: dataTest }] = useMutation(CREATE_TEST);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [{ token }, dispatch] = useStateValue();
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
 
  const setCustomerLocalStorage = async (value) => {
    await AsyncStorage.setItem("CUSTOMER", JSON.stringify(value));
    dispatch({
      type: "CUSTOMER",
      set_customer: value,
    });
  };
  const window = {
    recaptchaVerifier: undefined
  };
  
 

  const handleNumber = async () => {
    let number = noZero(text);
    let phoneNumber = "+855" + number;
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      setModalVisible(!modalVisible);
    } catch (err) {
      showMessage({ text: `Error: ${err.message}`, color: "red" });
    }
    
  };
  const handleVerify = async () => {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );

      await firebase
        .auth()
        .signInWithCredential(credential)
        .then((credential) => {
          var user = credential;
          Promise.all(
            createCustomer({
              variables: {
                uid: user?.user?.uid,
                tel: user?.user?.phoneNumber,
                token: token
              },
            })
          ).then(() => {
            navigation.navigate("findfoodyoulove");
          });
    
        });
      showMessage({
        // text: "Phone authentication successful 👍 ",
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          padding: 20,
          backgroundColor: modalVisible ? "black" : "#FFFF",
          opacity: modalVisible ? 0.4 : 1,
          height: Dimensions.get("window").height,
          flex: 1,
         
        }}
      >
        {set_customer?.uid ? null : (
            <FirebaseRecaptchaVerifierModal
              ref={recaptchaVerifier}
              firebaseConfig={firebaseConfig}
              attemptInvisibleVerification={attemptInvisibleVerification}
            />
          )}
         
        <View style={{ justifyContent: "center" }}>
          <View style={{marginTop: 20}}>
            <Entypo name="menu" size={24} color="black" onPress={()=> navigation.openDrawer()} />
          </View>
          <View
            style={{
              width: "100%",
              height: "40%",
              marginBottom: "15%",
              alignItems: "center",
              marginTop: "20%",
            }}
          >
            <Image
              style={{
                resizeMode: "contain",
                width: "80%",
                height: "80%",
                marginBottom: "5%",
              }}
              resizeMode="contain"
              source={require("../../../assets/Image/logo.png")}
            />
            <Text style={{ textAlign: "center", color: "#696969" }}>
              Discover the best foods from over 1,000 type
            </Text>
            <Text style={{ textAlign: "center", color: "#696969" }}>
              and fast delivery to your doorstep
            </Text>
          </View>
          <View
            style={{
              height: 33,
              flexDirection: "row",
              alignContent: "center",
              backgroundColor: "#EEEE",
              borderRadius: 5,
              paddingLeft: 10,
            }}
          >
            <Image
              style={{
                width: "8%",
                height: "40%",
                marginVertical: 10,
                marginTop: 10,
                marginRight: 5,
              }}
              source={require("../../../assets/Image/khmerFlag.png")}
            />
            <TextInput
              style={{
                fontSize: 14,
                width: "15%",
              }}
              autoFocus
              autoCompleteType="tel"
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              placeholder="phone number"
              value={"+855"}
              // onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
            />
            <TextInput
              style={{
                fontSize: 14,
                width: "70%",
              }}
              autoFocus
              autoCompleteType="tel"
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              placeholder="12345678"
              value={text}
              onChangeText={(e) =>onChangeText(e)}/>
          </View>
          <View>
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
                {/* <Text style={styles.modalText}>{count}</Text> */}
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
                      }}
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
                      backgroundColor: "#5CD242",
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
                </View>
              </View>
            </Modal>
          </View>
          {/*  */}
          
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    
  },
  modalView: {
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
    marginBottom: 15,
    textAlign: "center",
    color: "#808080",
    fontSize: 18,
  },
  addItem: {
    width: "100%",
    backgroundColor: "#5CD242",
    padding: 7,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    fontSize: 18,
  },
});
