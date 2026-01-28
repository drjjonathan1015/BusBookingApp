// src/firebase/index.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4GpGnA-8K1gLGmhNv41gRI9U16qnWezE",
  authDomain: "busbookingapp-31c91.firebaseapp.com",
  projectId: "busbookingapp-31c91",
  storageBucket: "busbookingapp-31c91.appspot.com", // <-- small fix
  messagingSenderId: "894637203036",
  appId: "1:894637203036:web:f84f14211ad225af235099",
  measurementId: "G-1Y6PSPMNJM"
};

// Initialize Firebase only once
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Exports
export const auth = getAuth(app);
export const db = getFirestore(app); // <-- add this
export { app };
