# Dream Life Calculator 🌿

Microapp para calcular el salario que necesitas para vivir tu vida ideal.

## 🌐 Demo
👉 https://dream-life-app-59679.web.app

## 🛠️ Stack

- **React.js** — app web
- **React Native + Expo** — app móvil
- **Firebase Realtime Database** — base de datos en tiempo real
- **Firebase Auth** — autenticación anónima
- **Firebase Hosting** — despliegue web
- **TypeScript** — tipado estático
- **Recharts** — gráficas

## ✨ Funcionalidades

- Calculadora de gastos mensuales
- Sliders de ahorro e inversión
- Selector de estilo de vida (equilibrado, confortable, premium)
- Extras personalizables (viajes, gimnasio, restaurantes...)
- Gráfica de distribución del salario
- Comparativa de escenarios guardados
- Sincronización en tiempo real web y móvil

## 🚀 Cómo arrancarlo

### Web
    cd packages/web
    npm start

### Móvil
    cd packages/mobile
    npm start

Escanea el QR con Expo Go en tu móvil.

## 📁 Estructura

    dream-life-app/
    ├── packages/
    │   ├── shared/     → Lógica compartida
    │   ├── web/        → App React.js
    │   └── mobile/     → App React Native
    └── firebase/       → Reglas de seguridad

## 🔧 Configuración Firebase

Crea packages/web/.env.local con tu configuración de Firebase.