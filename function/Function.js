import AsyncStorage from '@react-native-async-storage/async-storage';

// const [{ carts }, dispatch] = useStateValue();
import {
  Alert,
  PermissionsAndroid,
  Platform,
  ToastAndroid,

} from 'react-native';
export const setLocalstorage =  async (key,value) =>{
    await AsyncStorage.setItem(key,JSON.stringify(value));
}
export const getLocalstorage = async (key) =>{
  const getLocal = await AsyncStorage.getItem(key)

    return (
      getLocal
    )
}
export  const overlapItem = text => {
    if (!text) {
      return '';
    }
    let c = [];
    if (text.length > 15) {
      c = text.substr(0, 15) + '...';
    } else {
      c = text;
    }
    return c;
  };

export const noZero = value =>{
  if(!value){
    return ;
  }
  // const c = value.split('');
  const c = value.substr(0, 1);
  let newValue ;
  if(c==0){
    newValue = value.substr(1,value.length)
  }else{
    newValue = value
  }

  return newValue

}

export  const hasLocationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }
  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (hasPermission) {
    return true;
  }
  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }
  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show(
      'Location permission denied by user.',
      ToastAndroid.LONG,
    );
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show(
      'Location permission revoked by user.',
      ToastAndroid.LONG,
    );
  }
  return false;
};

