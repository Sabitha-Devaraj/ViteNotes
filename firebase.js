// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore, collection} from "firebase/firestore"; //import a function -To get access to the database that lives in the Cloud FireStore 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAbtoqO54ywHB6cZekf1kkh4zPmhRknaI",
  authDomain: "vitenotesapp.firebaseapp.com",
  projectId: "vitenotesapp",
  storageBucket: "vitenotesapp.appspot.com",
  messagingSenderId: "318199680449",
  appId: "1:318199680449:web:4f5701a31b36c7920cf340"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); //app gives reference to the application that lives in the firebase
export const db = getFirestore(app) //reference to the db that lives in the FireStore
export const notesCollection = collection(db, "notes")//get access to notes collection  in FS by calling a function named Collection() and pass the db instance - which db the collection is in and "notes" - name of the collection that we need to grab. Next we can read the data in notesCollection to display in our app