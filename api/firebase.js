
import firebase from "firebase/app";

// Optionally import the services that you want to use
import "firebase/auth";
//import "firebase/database";
// import "firebase/firestore";
//import "firebase/functions";
// import "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBHtOWhkdC_MQlvRbPtMdqHstTJDHheUQM",
    authDomain: "myfirebaseauth-8bba2.firebaseapp.com",
    databaseURL: "https://myfirebaseauth-8bba2-default-rtdb.firebaseio.com",
    projectId: "myfirebaseauth-8bba2",
    storageBucket: "myfirebaseauth-8bba2.appspot.com",
    messagingSenderId: "162707527342",
    appId: "1:162707527342:web:4cccf3764d611716927f3f"
};


firebase.initializeApp(firebaseConfig);
export default firebase;