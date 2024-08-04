// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBB1NPrG4opb_kwP5RgJVCloicfFhRZqqM",
  authDomain: "inventory-management-e01cf.firebaseapp.com",
  projectId: "inventory-management-e01cf",
  storageBucket: "inventory-management-e01cf.appspot.com",
  messagingSenderId: "902824174711",
  appId: "1:902824174711:web:fb3c2e5c7d208f80135272",
  measurementId: "G-TL3RCW9594"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)


export { firestore }