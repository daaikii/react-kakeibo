import firebase from 'firebase/app'
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBV8HXKwCOK01iWnZiFkpRD7C3ldNYkaTk",
  authDomain: "habchart.firebaseapp.com",
  projectId: "habchart",
  storageBucket: "habchart.appspot.com",
  messagingSenderId: "380942759317",
  appId: "1:380942759317:web:eaa23f842f44a27a80329c"
};
const firebaseApp=firebase.initializeApp(firebaseConfig);

export const auth=firebaseApp.auth();
export const db=firebaseApp.firestore();
export const storage=firebaseApp.storage();
export const provider=new firebase.auth.GoogleAuthProvider();