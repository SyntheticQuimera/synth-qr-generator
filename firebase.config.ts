// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZwY5pd8oBdz24b1SJyCM2haxz6zSSm_Q",
  authDomain: "synth-qr-generator.firebaseapp.com",
  projectId: "synth-qr-generator",
  storageBucket: "synth-qr-generator.appspot.com",
  messagingSenderId: "630027608704",
  appId: "1:630027608704:web:97852cf9200d83b7d53c65",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth();
export { auth, db, storage }