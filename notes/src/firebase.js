// // // If you want to start measuring performance in your app, pass a function
// // // to log results (for example: reportWebVitals(console.log))
// // // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// // reportWebVitals();

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCHIbHKvEHS_kCRTSQlmKcw975XJwmeIyM",
//   authDomain: "notes-6dd05.firebaseapp.com",
//   databaseURL: "https://notes-6dd05-default-rtdb.firebaseio.com",
//   projectId: "notes-6dd05",
//   storageBucket: "notes-6dd05.appspot.com",
//   messagingSenderId: "45573054757",
//   appId: "1:45573054757:web:018d610bf2eeb5cbee7acc",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// // Init services
// export const db = getFirestore(app);
// // collection ref

// // export default colref;

// // getnotes

// //adding documents
// // const addDocForm = document.querySelector(".add");

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// Import the functions you need from the SDKs you need
// import { firebase } from "firebase/compat/app";

import "firebase/compat/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHIbHKvEHS_kCRTSQlmKcw975XJwmeIyM",
  authDomain: "notes-6dd05.firebaseapp.com",
  databaseURL: "https://notes-6dd05-default-rtdb.firebaseio.com",
  projectId: "notes-6dd05",
  storageBucket: "notes-6dd05.appspot.com",
  messagingSenderId: "45573054757",
  appId: "1:45573054757:web:018d610bf2eeb5cbee7acc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
