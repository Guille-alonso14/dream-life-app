import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, push, set, onValue, remove } from 'firebase/database';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAHKK1BKX96F31yzWKseQOTd6GxstaMvUs",
  authDomain: "dream-life-app-59679.firebaseapp.com",
  databaseURL: "https://dream-life-app-59679-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dream-life-app-59679",
  storageBucket: "dream-life-app-59679.firebasestorage.app",
  messagingSenderId: "750003342321",
  appId: "1:750003342321:web:e0a4d76582110656391250"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getDatabase(app);
export const auth = getAuth(app);

// Login anónimo automático
export function initAuth(callback: (uid: string) => void) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user.uid);
    } else {
      signInAnonymously(auth);
    }
  });
}

// Guardar escenario
export function saveScenario(uid: string, name: string, data: any) {
  const scenariosRef = ref(db, `users/${uid}/scenarios`);
  const newRef = push(scenariosRef);
  return set(newRef, { ...data, name, createdAt: Date.now() });
}

// Escuchar escenarios en tiempo real
export function subscribeScenarios(uid: string, callback: (scenarios: any[]) => void) {
  const scenariosRef = ref(db, `users/${uid}/scenarios`);
  return onValue(scenariosRef, (snap) => {
    if (!snap.exists()) { callback([]); return; }
    const data = snap.val();
    const list = Object.entries(data).map(([id, val]: any) => ({ id, ...val }));
    callback(list.sort((a, b) => b.createdAt - a.createdAt));
  });
}

// Eliminar escenario
export function deleteScenario(uid: string, scenarioId: string) {
  return remove(ref(db, `users/${uid}/scenarios/${scenarioId}`));
}