// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1fK0FQ_A4X894ayeWFOPefeTlwFbEsho",
  authDomain: "aliencode-56e2e.firebaseapp.com",
  projectId: "aliencode-56e2e",
  storageBucket: "aliencode-56e2e.firebasestorage.app",
  messagingSenderId: "15257727739",
  appId: "1:15257727739:web:2e4b3de95fb6fa257f365e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);