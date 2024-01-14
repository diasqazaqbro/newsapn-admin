import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
export const firebaseConfig = {
  apiKey: "AIzaSyBsvyxQdMS-ySALBiAlInEpqXYZVx2CaW4",
  authDomain: "news-8eabc.firebaseapp.com",
  projectId: "news-8eabc",
  storageBucket: "news-8eabc.appspot.com",
  messagingSenderId: "274111285729",
  appId: "1:274111285729:web:c13b3a5ed511776af2eaa0",
  measurementId: "G-ZLR0FJ46LG",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
