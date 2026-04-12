import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB4h8cZeANVMYTRIO7ZegLRmD7RB6xpb0I",
  authDomain: "assignment-10-abcfc.firebaseapp.com",
  projectId: "assignment-10-abcfc",
  storageBucket: "assignment-10-abcfc.appspot.com",
  messagingSenderId: "439988527343",
  appId: "1:439988527343:web:0a8aaa237753b966babb1a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app; 