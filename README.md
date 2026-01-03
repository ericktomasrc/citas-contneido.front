# 🎥 Plataforma de Lives - CitasContenido

Plataforma de streaming en vivo con sistema de monetización completo.

## 🚀 Estado del Proyecto

### ✅ Funcionalidades Implementadas (Frontend)

#### 💰 Sistema de Monetización
- **Propinas Rápidas**: 4 niveles (S/.1, 5, 10, 20)
- **Super Chat**: 3 tiers con mensajes destacados (S/.5, 10, 20)
- **Regalos Premium**: Catálogo con animaciones
- **Sistema de Suscripciones**: 3 planes (Básico S/.20, VIP S/.50, Elite S/.150)
- **PPV (Pay Per View)**: Precio configurable por live

#### 🎬 Transmisión en Vivo
- **Agora RTC**: Video HD 4K con audio estéreo
- **3 tipos de transmisión**: Pública, Solo Suscriptores, PPV
- **Control de acceso**: Validación antes de conectar
- **Chat en tiempo real**: Socket.io con moderación
- **Metas de donaciones**: Barra de progreso en vivo

#### 🎨 UX/UI Premium
- Super Chat en panel de chat (estilo TikTok/YouTube)
- Modales de pago con planes detallados
- Animaciones y efectos visuales
- Responsive design

### 🔧 Pendiente (Backend C#)

Ver guía completa: **[BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md)**

#### Endpoints Necesarios:
1. `POST /api/suscripciones/crear` - Crear suscripción
2. `GET /api/suscripciones/verificar/:userId/:creadoraId` - Verificar suscripción
3. `POST /api/ppv/pagar` - Procesar pago PPV
4. `GET /api/ppv/verificar/:userId/:channelName` - Verificar acceso PPV
5. `POST /api/canal/iniciar` - Iniciar transmisión con metadata
6. `GET /api/canal/:channelName/activo` - Obtener configuración del canal

#### Base de Datos:
- Tabla `Suscripciones`
- Tabla `AccesosPPV`
- Actualizar tabla `Canales`

#### Pasarela de Pagos:
- Culqi (recomendado para Perú)
- MercadoPago
- Stripe

---

## 📦 Instalación

```bash
npm install
npm run dev
```

## 🔌 Integración Backend

Todo el frontend está listo para conectar. Solo necesitas:

1. Implementar los 6 endpoints en C# (ver guía)
2. Actualizar `src/shared/services/subscription.service.ts`
3. Reemplazar simulaciones con llamadas reales

**Archivo a modificar**: `src/shared/services/subscription.service.ts`
- Buscar: `// TODO: BACKEND C#`
- Descomentar código marcado como "IMPLEMENTACIÓN REAL"

---

## 📁 Estructura del Proyecto

```
src/
├── shared/
│   ├── services/
│   │   └── subscription.service.ts    ← Servicios de pago (simulados)
│   └── types/
│       └── subscription.types.ts      ← Tipos TypeScript
├── pages/
│   └── DashboardCreadora/
│       └── EnVivoPage/
│           ├── EnVivoPage.tsx         ← Vista creadora
│           ├── VerEnVivoPage.tsx      ← Vista espectador
│           └── SuperChatModal.tsx     ← Modal de Super Chat
└── shared/backend/
    └── server.js                       ← Servidor Socket.io (temporal)
```

---

## 🎯 Flujos Implementados

### Flujo de Suscripción:
```
Usuario → Intenta ver live → Bloqueo → Modal de Planes → 
Selecciona plan → Pago (simulado) → Acceso otorgado
```

### Flujo de PPV:
```
Creadora → Configura live PPV (precio/descripción) → Publica →
Usuario → Intenta ver → Modal de pago → Paga (simulado) → Acceso otorgado
```

### Flujo de Super Chat:
```
Espectador → Abre modal → Selecciona tier → Escribe mensaje →
Envía → Aparece fijado en chat (30s-120s) → Queda en timeline
```

---

## 💾 Datos Simulados

Actualmente usa **LocalStorage** para simular:
- Suscripciones activas
- Pagos PPV
- User ID temporal

**Producción**: Reemplazar con llamadas a API C# + JWT + Base de datos real.

---

## 📚 Documentación Adicional

- [Guía de Integración Backend](./BACKEND_INTEGRATION_GUIDE.md) - Detallada con ejemplos C#
- [Tipos TypeScript](./src/shared/types/subscription.types.ts) - DTOs y enums

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + TypeScript + Vite
- **Streaming**: Agora RTC SDK
- **Real-time**: Socket.io
- **Estilos**: TailwindCSS
- **Backend (pendiente)**: C# + Entity Framework

---

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
