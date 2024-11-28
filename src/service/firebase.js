import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
const firebaseApiKey = import.meta.env.VITE_SECURE_API_KEY;
const firebaseAuthDomain = import.meta.env.VITE_SECURE_AUTH_DOMAIN;
const firebaseProjectId = import.meta.env.VITE_SECURE_PROJECT_ID;
const firebaseStorageBucket = import.meta.env.VITE_SECURE_STORAGE_BUCKET;
const firebaseMessagingSenderID = import.meta.env.VITE_SECURE_MESSAGING_ID;
const firebaseAppId = import.meta.env.VITE_SECURE_APP_ID;

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderID,
  appId: firebaseAppId
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export async function getSidoData(directory, isSeveral) {
  if (isSeveral) {
    return await getDocs(collection(db, directory));
  } else {
    return await getDoc(doc(db, directory));
  }
}

export async function getRecentDrwNo() {
  return await getDoc(doc(db, 'lottoInfo/drwNoInfo'));
}

export async function getLottoDrawNo(drwNo) {
  return await getDoc(doc(db, `lottoInfo/${drwNo}`));
}
export { db };
