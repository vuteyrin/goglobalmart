import React, {useState, useEffect} from 'react';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';

import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
  Image,
  Platform,
  TouchableWithoutFeedback,
  Button,
} from 'react-native';
import { FontAwesome,Feather,Entypo } from '@expo/vector-icons';
import {useQuery, useMutation} from '@apollo/client';
import {setLocalstorage} from '../../../function/Function'
import {useStateValue} from '../../../context/StateProvider';
import {UPDATE_CUSTOMER_BY_ID} from '../../../graphql/customer';
import { colorapp } from '../../../context/Reducer';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const EditProfile = ({navigation}) => {
 
  const [updateCustomers] = useMutation(UPDATE_CUSTOMER_BY_ID,{
    onError: (err)=>{
      console.log(err?.graphQLErrors[0]?.message)
    }
  })
  const [{customer}, dispatch] = useStateValue();
  const [modalName, setModalName] = React.useState(false);
  const [modalEmail, setModalEmail] = React.useState(false);
  const [modalPhone, setModalPhone] = React.useState(false);
  const [modalImage, setModalImage] = React.useState(false);
  const [image, setImage] = useState(null);
  const [lname, setlName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [imageChanged, setImageChanged] = useState(false);
  const [fname,setFname] = useState('')
  useEffect(() => {
    setlName(customer?.lname);
    setFname(customer.fname)
    setEmail(customer?.email);
    setPhone(customer?.tel);
    setImage(customer?.image);
  }, [dispatch]);
  const onHandle = () => {
    updateCustomers({
      variables: {
        input:{
          id: customer?.id,
          fname: fname,
          lname: lname,
          tel: phone,
          image: image,
          }
        },
        update(_,result){
          // console.log(result)
        }
        });
        const customerObj = {
            id: customer?.id,
            fname: fname,
            lname: lname,
            tel: phone,
            image: image,
            token: customer.token,
            uid: customer.uid,
          }
        setCustomerLocalStorage(customerObj)
    };
  const setCustomerLocalStorage =(value) => {
    setLocalstorage("customer",value);
    dispatch({
      type: "CUSTOMER",
      customer: value,
    });
  };
const handleImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
      setModalImage(!modalImage)
    }
  };

  // console.log(customer)
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
        
          <View style={styles.containProfile}>
            {image === null || image === undefined ? (
              <FontAwesome
                style={styles.imgProfile}
                name="user-circle-o"
                size={100}
                color={'#FFFF'}
              />
            ) : <Image style={styles.img}  source={{ uri:image}}  />}
             
          </View>
          <TouchableWithoutFeedback onPress={() => handleImage()}>
            <View style={styles.cameraIcon}>
              <Entypo name="camera" size={20} color="red" />
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.navbar}>
            <Text style={styles.ProfileName}>{customer? lname:"User Name"}</Text>
          </View>
        </View>
        <View style={styles.body}>
          {/* name */}
          <View style={styles.nameContain}>
            <View>
              <Text style={{color: lname ? '#A9A9A9' : 'black'}}>Firstname</Text>
              <Text style={{color: fname ? 'black' : '#CCCC'}}>
                {fname? fname : 'name....'}
              </Text>
            </View>
            <View>
              <Entypo
                onPress={() => setModalName(!modalName)}
                name="edit"
                size={25}
                color="red"
              />
            </View>
          </View>
          {/* email */}
          <View style={styles.nameContain}>
            <View>
              <Text style={{color: lname ? '#A9A9A9' : 'black'}}>Lastname</Text>
              <Text style={{color: lname ? 'black' : '#CCCC'}}>
                {lname? lname : 'email....'}
              </Text>
            </View>
            <View>
              <Entypo
                onPress={() => setModalEmail(!modalEmail)}
                name="edit"
                size={25}
                color="red"
              />
            </View>
          </View>
          {/* phone */}
          <View style={styles.nameContain}>
            <View>
              <Text style={{color: lname ? '#A9A9A9' : 'black'}}>Phone</Text>
              <Text style={{color: phone ? 'black' : '#CCCC'}}>
                {phone? phone : 'phone....'}
              </Text>
            </View>
            <View>
              <Entypo
                onPress={() => setModalPhone(!modalPhone)}
                name="edit"
                size={25}
                color="red"
              />
            </View>
          </View>
        </View>
        {/* alert model name */}
        <View style={styles.centeredView}>
          <Modal
            transparent={true}
            visible={modalName}
            animationType="slide">
            <View style={styles.containerConfirmLogOut}>
              <View style={styles.Bg}>
                <TextInput value={fname} onChangeText={(e)=>setFname(e)} placeholder="name..." style={styles.input} />
                <View style={styles.YesNo}>
                  <TouchableWithoutFeedback onPress={() => {onHandle(),setModalName(!modalName)}}>
                    <View style={styles.conYes}>
                      <Text style={styles.yes}> yes</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={() => {setModalName(!modalName)}}>
                    <View style={styles.conNo}>
                     <Text style={styles.yes}>No</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        {/* end name */}
         {/* alert model Emial */}
         <View style={styles.centeredView}>
          <Modal
            transparent={true}
            visible={modalEmail}
            animationType="slide">
            <View style={styles.containerConfirmLogOut}>
              <View style={styles.Bg}>
                <TextInput value={lname} onChangeText={(e)=>setlName(e)} placeholder="email..." style={styles.input} />
                <View style={styles.YesNo}>
                  <TouchableWithoutFeedback onPress={() => {onHandle(),setModalEmail(!modalEmail)}}>
                    <View style={styles.conYes}>
                      <Text style={styles.yes}>yes</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={() => {setModalEmail(!modalEmail)}}>
                    <View style={styles.conNo}>
                     <Text style={styles.yes}>No</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        {/* end Email */}
         {/* alert model phone */}
         <View style={styles.centeredView}>
          <Modal
            transparent={true}
            visible={modalPhone}
            animationType="slide">
            <View style={styles.containerConfirmLogOut}>
              <View style={styles.Bg}>
                <TextInput value={phone} onChangeText={(e)=>setPhone(e)} placeholder="phone..." style={styles.input} />
                <View style={styles.YesNo}>
                  <TouchableWithoutFeedback onPress={() => {onHandle(),setModalPhone(!modalPhone);}}>
                    <View style={styles.conYes}>
                      <Text style={styles.yes}>yes</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={() => {setModalPhone(!modalPhone)}}>
                    <View style={styles.conNo}>
                     <Text style={styles.yes}>No</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        {/* end phone */}
      {/* image */}
        <View style={styles.centeredView}>
          <Modal
            transparent={true}
            visible={modalImage}
            animationType="slide">
            <View style={styles.containerConfirmLogOut}>
              <View style={styles.Bg}>
               <Text style={{textAlign: "center",padding: 20}}>Do you want to save image..!</Text>
                <View style={styles.YesNo}>
                  <TouchableWithoutFeedback onPress={() => {onHandle(),setModalImage(!modalImage)}}>
                    <View style={styles.conYes}>
                      <Text style={styles.yes}> yes</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={() => { setModalImage(!modalImage)}}>
                    <View style={styles.conNo}>
                     <Text style={styles.yes}>No</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        {/* end image  */}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: '#FFFF',
  },
  header: {
    width: width,
    height: '28%',
    backgroundColor: colorapp,
    alignItems: 'center',
    paddingTop: 10,
  },
  navbar: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: '3%',
  },
  ProfileName: {
    fontSize: 23,
    color: '#FFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: '2%',
    width: '50%',
  },
  containProfile: {
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    // borderWidth: 5,
    // borderColor: "#FFFF",
  },
  img:{
   
    width: "100%",
    height: "100%",
    borderRadius: 80
  },
  imgProfile: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'relative',
    backgroundColor: '#ffff',
    padding: 3,
    borderWidth: 1,
    top: -30,
    left: 35,
    borderColor: '#EEEE',
    borderRadius: 20,
  },
  body: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFF',
    paddingHorizontal: '2%',
  },
  nameContain: {
    backgroundColor: '#FFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#CCCC',
    marginTop: 10,
    alignItems: 'center',
  },
  ///model///
  containerConfirmLogOut: {
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
  },
  YesNo: {
    width: 250,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colorapp,
    borderRadius: 5,
  },

   conYes : {
    backgroundColor: colorapp,
    width: '50%',
    borderRightWidth: 1,
    borderRightColor: '#FFFF',
    borderBottomLeftRadius: 12,
    color: '#FFFF',
   },
   conNo :{
    backgroundColor: colorapp,
    width: '50%',
    borderBottomRightRadius: 12,
    color: '#FFFf',
   },
   yes: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: 10,
    borderBottomLeftRadius: 12,
    color: '#FFFF',
   },
});
export default EditProfile;
