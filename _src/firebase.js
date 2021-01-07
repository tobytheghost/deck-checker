import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCtOu6X3IV2i3rdrzJ1g8v9EgQBuPsRt2Y",
  authDomain: "deck-checker.firebaseapp.com",
  projectId: "deck-checker",
  storageBucket: "deck-checker.appspot.com",
  messagingSenderId: "828217551544",
  appId: "1:828217551544:web:f4f751e8a1fab8daee224d",
  measurementId: "G-Q5QV10DN72",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
