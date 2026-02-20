# Guía de Aplicación de Chat con React TypeScript + Electron

**Aprendizaje react ts, electron, bd, aplicacion fullstack electron**

Esta guía te enseña a construir una aplicación de chat de escritorio completa con React (TypeScript), Electron, base de datos SQLite, autenticación y mensajería en tiempo real.

---

## 1. Configuración del Proyecto

### Inicializar el Proyecto

```bash
bun init -y
bun add electron react react-dom
bun add -d @types/react @types/react-dom typescript vite
bun add -d vite-plugin-electron vite-plugin-electron-renderer electron-builder
bun add sequelize sqlite3
bun add -d @types/node
```

### Estructura del Proyecto

```
chat-app/
├── src/
│   ├── main/
│   │   ├── main.ts          # Proceso principal de Electron
│   │   ├── database.ts      # Inicialización de la base de datos
│   │   ├── models/
│   │   │   ├── User.ts      # Modelo de Usuario
│   │   │   ├── Message.ts   # Modelo de Mensaje
│   │   │   └── Contact.ts   # Modelo de Contacto
│   │   └── preload.ts       # Puente entre main/renderer
│   ├── renderer/
│   │   ├── App.tsx          # Componente principal de React
│   │   ├── index.tsx        # Punto de entrada de React
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx  # Proveedor de autenticación
│   │   │   └── ChatContext.tsx  # Proveedor de estado del chat
│   │   ├── views/
│   │   │   ├── LoginView.tsx
│   │   │   └── ChatView.tsx
│   │   ├── components/
│   │   │   ├── ContactList.tsx
│   │   │   ├── MessageList.tsx
│   │   │   └── MessageInput.tsx
│   │   └── styles/
│   │       └── chat.css
│   └── index.html
├── tsconfig.json
├── vite.config.ts
└── package.json
```

**¿Por qué esta estructura?** Electron separa **main** (backend) y **renderer** (frontend). Los modelos definen las tablas de la base de datos. Los contextos manejan el estado compartido. Los componentes son piezas de UI reutilizables.

**¿Por qué Vite y Bun?** Vite es **10x más rápido** que Webpack (Hot Module Replacement instantáneo). Bun es **20x más rápido** que npm (instalación y ejecución). Ambos usan tecnología moderna para desarrollo ultrarrápido.

---

## 2. Configuración de TypeScript

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["src/renderer/**/*"],
  "exclude": ["node_modules"]
}
```

**Explicación:** `module: "ESNext"` usa módulos ES modernos. `jsx: "react-jsx"` usa el nuevo JSX transform (no necesitas importar React). `moduleResolution: "bundler"` optimiza para Vite.

---

## 3. Configuración de Vite

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: 'src/main/main.ts',
        vite: {
          build: {
            outDir: 'dist-electron'
          }
        }
      },
      {
        entry: 'src/main/preload.ts',
        onstart(options) {
          options.reload();
        },
        vite: {
          build: {
            outDir: 'dist-electron'
          }
        }
      }
    ]),
    renderer()
  ],
  build: {
    outDir: 'dist'
  }
});
```

**Explicación:** Vite empaqueta React **instantáneamente** con Hot Module Replacement. El plugin `vite-plugin-electron` compila el proceso main y preload automáticamente. `@vitejs/plugin-react` habilita React con el nuevo JSX transform.

---

## 4. Modelos de Base de Datos con Sequelize

### `src/main/models/User.ts`

```typescript
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';

export class User extends Model {
  declare id: number;
  declare username: string;
  declare password: string;
  declare avatar: string;
  declare status: string;
  declare createdAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: 'https://randomuser.me/api/portraits/lego/1.jpg'
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'online'
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    updatedAt: false
  }
);
```

**Explicación:** Esto define el **plano** para la tabla de usuarios. Cada campo tiene un tipo y reglas. `unique: true` previene nombres de usuario duplicados. `defaultValue` establece valores automáticos.

---

### `src/main/models/Message.ts`

```typescript
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';

export class Message extends Model {
  declare id: number;
  declare senderId: number;
  declare receiverId: number;
  declare text: string;
  declare media: string | null;
  declare isRead: boolean;
  declare sentAt: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    media: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    sentAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'messages',
    timestamps: false
  }
);
```

**Explicación:** Los mensajes conectan dos usuarios (emisor y receptor). El tipo `TEXT` permite mensajes largos. `isRead` rastrea si el mensaje fue visto. `sentAt` almacena cuándo se envió.

---

### `src/main/models/Contact.ts`

```typescript
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';

export class Contact extends Model {
  declare id: number;
  declare userId: number;
  declare contactUserId: number;
  declare nickname: string | null;
  declare createdAt: Date;
}

Contact.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    contactUserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'contacts',
    timestamps: true,
    updatedAt: false
  }
);
```

**Explicación:** Los contactos representan amistades. `userId` es el propietario, `contactUserId` es el amigo. `nickname` te permite renombrar contactos (opcional).

---

### `src/main/database.ts`

```typescript
import { Sequelize } from 'sequelize';
import path from 'path';
import { app } from 'electron';
import { User } from './models/User';
import { Message } from './models/Message';
import { Contact } from './models/Contact';

const dbPath = path.join(app.getPath('userData'), 'chat.db');

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false
});

// Definir relaciones
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

User.hasMany(Contact, { foreignKey: 'userId', as: 'contacts' });
Contact.belongsTo(User, { foreignKey: 'contactUserId', as: 'contactUser' });

// Inicializar base de datos
export async function initDatabase(): Promise<void> {
  await sequelize.sync();
  await seedDemoData();
}

// Datos de demostración para pruebas
async function seedDemoData(): Promise<void> {
  const userCount = await User.count();
  if (userCount > 0) return;

  const alice = await User.create({ username: 'alice', password: 'pass123', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' });
  const bob = await User.create({ username: 'bob', password: 'pass123', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' });
  const charlie = await User.create({ username: 'charlie', password: 'pass123', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' });

  await Contact.create({ userId: alice.id, contactUserId: bob.id });
  await Contact.create({ userId: alice.id, contactUserId: charlie.id });

  await Message.create({ senderId: bob.id, receiverId: alice.id, text: '¡Hola Alice!', sentAt: new Date('2026-01-22T10:00:00') });
  await Message.create({ senderId: alice.id, receiverId: bob.id, text: '¡Hola Bob! ¿Cómo estás?', sentAt: new Date('2026-01-22T10:05:00') });
}

export async function closeDatabase(): Promise<void> {
  await sequelize.close();
}
```

**Relaciones Explicadas:** `User.hasMany(Message)` significa que un usuario puede enviar muchos mensajes. `Message.belongsTo(User)` significa que cada mensaje tiene un emisor. Estas crean **claves foráneas** automáticamente.

**Los datos de demostración** crean usuarios y mensajes de prueba. Solo se ejecuta si la base de datos está vacía.

---

## 5. Script Preload (Puente de Seguridad)

### `src/main/preload.ts`

```typescript
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Autenticación
  login: (username: string, password: string) => 
    ipcRenderer.invoke('auth:login', username, password),
  register: (username: string, password: string) => 
    ipcRenderer.invoke('auth:register', username, password),
  
  // Operaciones de chat
  getContacts: () => 
    ipcRenderer.invoke('chat:getContacts'),
  getMessages: (contactId: number) => 
    ipcRenderer.invoke('chat:getMessages', contactId),
  sendMessage: (receiverId: number, text: string, media?: string) => 
    ipcRenderer.invoke('chat:sendMessage', receiverId, text, media),
  markAsRead: (messageId: number) => 
    ipcRenderer.invoke('chat:markAsRead', messageId)
});
```

**Explicación:** Este es el **guardia de seguridad** que expone funciones seguras a React. React llama `window.electronAPI.sendMessage()`, que envía un mensaje al proceso principal.

---

## 6. HTML Template

### `index.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chat App</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/renderer/index.tsx"></script>
</body>
</html>
```

**Explicación:** Vite usa `<script type="module">` para cargar el código. El path `/src/renderer/index.tsx` se resuelve automáticamente. Tailwind CSS desde CDN para estilos rápidos.

---

## 7. Declaraciones de TypeScript

### `src/renderer/global.d.ts`

```typescript
export {};

declare global {
  interface Window {
    electronAPI: {
      login: (username: string, password: string) => Promise<any>;
      register: (username: string, password: string) => Promise<any>;
      getContacts: () => Promise<any>;
      getMessages: (contactId: number) => Promise<any>;
      sendMessage: (receiverId: number, text: string, media?: string) => Promise<any>;
      markAsRead: (messageId: number) => Promise<any>;
    };
  }
}
```

**Explicación:** Define los tipos para `window.electronAPI`. Sin esto, TypeScript mostraría errores al llamar estas funciones desde React.

---

## 8. Scripts de Package.json

### `package.json`

```json
{
  "name": "chat-app",
  "version": "1.0.0",
  "main": "dist-electron/main.js",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build && electron-builder",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "@vitejs/plugin-react": "latest",
    "electron": "latest",
    "electron-builder": "latest",
    "typescript": "latest",
    "vite": "latest",
    "vite-plugin-electron": "latest",
    "vite-plugin-electron-renderer": "latest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "sequelize": "latest",
    "sqlite3": "latest"
  }
}
```

**Explicación:** `"type": "module"` habilita ES modules. `bun dev` inicia Vite con HMR instantáneo. `bun build` compila todo y crea el ejecutable con electron-builder.

---

## 9. Ejecutar la Aplicación

```bash
bun dev
```

**¿Qué sucede?**
1. Vite compila React **instantáneamente** (sin espera)
2. El plugin de Electron compila main.ts y preload.ts
3. Electron abre la ventana de la app
4. La base de datos se inicializa con datos de demostración
5. ¡HMR funciona! Los cambios se reflejan sin reiniciar

**Prueba la app:**
- Login con `alice` / `pass123`
- Haz clic en Bob para ver la conversación
- Envía un mensaje - ¡aparece instantáneamente!
- Edita un componente React - ¡se actualiza sin recargar!

---

## Recomendación de Base de Datos: **SQLite con Sequelize**

**¿Por qué SQLite en lugar de MongoDB?**

1. **Simplicidad**: No necesita servidor externo - archivo de base de datos almacenado localmente
2. **Rendimiento**: Más rápido para apps de escritorio locales (sin sobrecarga de red)
3. **Datos Relacionales**: Las apps de chat tienen relaciones claras (usuarios → conversaciones → mensajes)
4. **Estándar Electron**: La mayoría de apps Electron usan SQLite para almacenamiento local
5. **Beneficios de Sequelize**: Consultas type-safe, migraciones, relaciones fáciles

**Cuándo usar MongoDB**: Si necesitas sincronización en la nube, colaboración en tiempo real entre dispositivos, o esquema flexible. Para una app Electron local-first como esta, SQLite es la mejor opción.

---

## Conceptos Clave de React

### React Hooks
- **`useState`**: Caja de memoria que guarda datos y activa re-renderizados
- **`useEffect`**: Ejecuta código cuando el componente se monta o los datos cambian
- **`useRef`**: Crea una referencia a un elemento DOM (para scroll)
- **`useContext`**: Receptor de radio que sintoniza un Provider

### Providers (Proveedores)
**Analogía**: Un mesero en un restaurante. En lugar de que cada mesa (componente) vaya a la cocina (base de datos), el mesero trae los datos a todos. `AuthProvider` sirve info del usuario, `ChatProvider` sirve datos del chat.

### Sequelize ORM
- **Modelos**: Planos para tablas de base de datos
- **Relaciones**: `hasMany`, `belongsTo` conectan tablas
- **Consultas**: `findOne()`, `findAll()`, `create()` en lugar de SQL crudo
- **Async/Await**: Las operaciones de base de datos toman tiempo, así que esperamos

### Arquitectura Electron
- **Proceso Principal**: Backend (Node.js, base de datos, sistema de archivos)
- **Proceso Renderer**: Frontend (UI de React con Vite)
- **Script Preload**: Puente de seguridad (expone solo funciones seguras)
- **IPC**: Comunicación Inter-Proceso (mensajes entre main y renderer)

### Stack de Desarrollo
- **Vite**: Bundler ultrarrápido con HMR instantáneo (10x más rápido que Webpack)
- **Bun**: Runtime y package manager (20x más rápido que npm)
- **React 18**: Con nuevo JSX transform (no necesitas `import React`)
- **TypeScript**: Type safety con `moduleResolution: "bundler"`
- **Sequelize**: ORM para SQLite con relaciones automáticas

---

## 10. Ejemplo de Componente React

### `src/renderer/App.tsx`

```tsx
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { LoginView } from './views/LoginView';
import { ChatView } from './views/ChatView';
import './styles/chat.css';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <LoginView />;
  }

  return (
    <ChatProvider>
      <ChatView />
    </ChatProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
```

**Multi-View Rendering:** El `if (!user)` actúa como un **semáforo**. Luz roja (sin usuario) = mostrar login. Luz verde (usuario logueado) = mostrar chat. `ChatProvider` envuelve `ChatView` porque necesita el contexto de auth primero.

**Nota sobre JSX:** Con Vite y `jsx: "react-jsx"`, no necesitas `import React from 'react'`. El nuevo transform lo hace automáticamente.

---

## 11. Punto de Entrada de React

### `src/renderer/index.tsx`

```tsx
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
```

**Explicación:** Encuentra el elemento `root` e inyecta la app de React. `createRoot` es el método de renderizado de React 18. Vite carga este archivo automáticamente desde el `<script type="module">` en index.html.

---

## Notas de Seguridad

1. **Nunca uses `nodeIntegration: true`** - Expone APIs peligrosas
2. **Siempre usa `contextIsolation: true`** - Separa código de Electron y web
3. **Hashea contraseñas en producción** - Usa `bcrypt` en lugar de texto plano
4. **Valida entradas** - Verifica longitud de mensajes, sanitiza HTML
5. **Usa prepared statements** - Sequelize hace esto automáticamente

---

## Próximos Pasos

- Agregar hash de contraseñas con `bcrypt`
- Implementar carga de archivos/imágenes
- Agregar indicadores de escritura (WebSockets)
- Crear chats grupales
- Agregar búsqueda de mensajes
- Implementar selector de emojis
- Compilar con `electron-builder` para distribución

## Ventajas de Vite + Bun

**Velocidad de Desarrollo:**
- ⚡ **HMR instantáneo**: Los cambios en React se reflejan en <50ms
- 🚀 **Instalación rápida**: `bun install` es 20x más rápido que `npm install`
- 📦 **Build optimizado**: Vite genera bundles más pequeños que Webpack
- 🔥 **Dev server**: Inicia en <1 segundo vs 10-30 segundos con Webpack

**Experiencia de Desarrollo:**
- No más esperas largas al guardar archivos
- TypeScript se compila on-demand (solo lo que cambió)
- CSS se actualiza sin recargar la página
- Errores claros y precisos en el navegador

**Aprendizaje react ts, electron, bd, aplicacion fullstack electron** - ¡Ahora tienes una base completa para aplicaciones de chat con el stack más rápido disponible!
