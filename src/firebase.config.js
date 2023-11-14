import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBKVNtmnvudNsAR2Ofdi7cgw_QSrQhO7mY",
  authDomain: "nabilfgrza-house-marketplace.firebaseapp.com",
  projectId: "nabilfgrza-house-marketplace",
  storageBucket: "nabilfgrza-house-marketplace.appspot.com",
  messagingSenderId: "724203606953",
  appId: "1:724203606953:web:4380623f56a1b071f6aab8"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()