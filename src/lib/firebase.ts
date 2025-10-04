import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: "studio-9058955174-11b06",
  appId: "1:710578216259:web:09eddce42df50990e223f6",
  apiKey: "AIzaSyCcb36BxMz7wrHx7JPc0TSvsXRIEmOCqQs",
  authDomain: "studio-9058955174-11b06.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "710578216259",
  storageBucket: "studio-9058955174-11b06.appspot.com"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleProvider };
