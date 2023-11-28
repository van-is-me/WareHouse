// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBDh4VTLsN1Pyok2o4RpcQZx4pAzL6BpgU",
    authDomain: "warehouse-final-5183a.firebaseapp.com",
    projectId: "warehouse-final-5183a",
    storageBucket: "warehouse-final-5183a.appspot.com",
    messagingSenderId: "245747345119",
    appId: "1:245747345119:web:6597c8e73f137560552b6a",
    measurementId: "G-289ERLJZQW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { getStorage } from 'firebase/storage'
const storage = getStorage(app)

export { storage }