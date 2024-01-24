import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
export const firebaseConfig = {
  apiKey: "AIzaSyAzY0DZ2OKQC_ccJcncPim-ybSZO61G7-4",
  authDomain: "apnnews-dd790.firebaseapp.com",
  databaseURL: "https://apnnews-dd790-default-rtdb.firebaseio.com",
  projectId: "apnnews-dd790",
  storageBucket: "apnnews-dd790.appspot.com",
  messagingSenderId: "813232080916",
  appId: "1:813232080916:web:8571dad421810410657f01"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
