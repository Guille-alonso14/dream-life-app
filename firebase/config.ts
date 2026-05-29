import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAHKK1BKX96F31yzWKseQOTd6GxstaMvUs",
  authDomain: "dream-life-app-59679.firebaseapp.com",
  databaseURL: "https://dream-life-app-59679-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dream-life-app-59679",
  storageBucket: "dream-life-app-59679.firebasestorage.app",
  messagingSenderId: "750003342321",
  appId: "1:750003342321:web:e0a4d76582110656391250"
};

// Evita inicializar Firebase más de una vez
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getDatabase(app);
export const auth = getAuth(app);