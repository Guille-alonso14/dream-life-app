import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, push, set, onValue, remove } from 'firebase/database';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

import CalculatorScreen from './screens/CalculatorScreen';
import ScenariosScreen from './screens/ScenariosScreen';
import CompareScreen from './screens/CompareScreen';

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
const db = getDatabase(app);
const auth = getAuth(app);

const Tab = createBottomTabNavigator();

export default function App() {
  const [uid, setUid] = useState<string | null>(null);
  const [scenarios, setScenarios] = useState<any[]>([]);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        const scenariosRef = ref(db, `users/${user.uid}/scenarios`);
        onValue(scenariosRef, (snap) => {
          if (!snap.exists()) { setScenarios([]); return; }
          const data = snap.val();
          const list = Object.entries(data).map(([id, val]: any) => ({ id, ...val }));
          setScenarios(list.sort((a, b) => b.createdAt - a.createdAt));
        });
      } else {
        signInAnonymously(auth);
      }
    });
    return unsubAuth;
  }, []);

  async function handleSave(name: string, data: any) {
    if (!uid) return;
    const scenariosRef = ref(db, `users/${uid}/scenarios`);
    const newRef = push(scenariosRef);
    await set(newRef, { name, ...data, createdAt: Date.now() });
  }

  function handleDelete(scenarioId: string, name: string) {
    Alert.alert('Eliminar', `¿Eliminar "${name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => uid && remove(ref(db, `users/${uid}/scenarios/${scenarioId}`)) },
    ]);
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#2a6049',
          tabBarInactiveTintColor: '#a09d98',
          tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Calcular"
          options={{ tabBarIcon: () => null }}
        >
          {() => <CalculatorScreen uid={uid} onSave={handleSave} />}
        </Tab.Screen>
        <Tab.Screen
          name="Escenarios"
          options={{ tabBarIcon: () => null }}
        >
          {() => <ScenariosScreen scenarios={scenarios} onDelete={handleDelete} />}
        </Tab.Screen>
        <Tab.Screen
          name="Comparar"
          options={{ tabBarIcon: () => null }}
        >
          {() => <CompareScreen scenarios={scenarios} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    borderTopWidth: 0.5,
    borderTopColor: '#e8e5e0',
    paddingTop: 8,
    height: 60,
  },
});