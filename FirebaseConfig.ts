// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvNt8zO94r3TWG8drlGctuJw9oBwuPQyg",
  authDomain: "trackle-c8137.firebaseapp.com",
  projectId: "trackle-c8137",
  storageBucket: "trackle-c8137.firebasestorage.app",
  messagingSenderId: "302457673192",
  appId: "1:302457673192:web:35603ad00cc8d60ddf405d",
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
})
