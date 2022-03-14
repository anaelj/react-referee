import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_0jH2OeCsIFiiXJ6yk4TxVs4PG5lBax0",
  authDomain: "referee-88cd0.firebaseapp.com",
  projectId: "referee-88cd0",
  storageBucket: "referee-88cd0.appspot.com",
  messagingSenderId: "657734988054",
  appId: "1:657734988054:web:ed348a51beef4227f1a037",
  measurementId: "G-Z7VK1NEES1",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore();
