# React TypeScript + Electron Full-Stack App Guide

**Aprendizaje react ts, electron, bd, aplicacion fullstack electron**

This guide teaches you to build a complete desktop app with React (TypeScript), Electron, SQLite database, authentication, and multi-view rendering.

---

## 1. Project Setup

### Initialize the Project

```bash
npm init -y
npm install electron react react-dom
npm install -D @types/react @types/react-dom typescript webpack webpack-cli
npm install -D ts-loader html-webpack-plugin electron-builder
npm install sequelize sqlite3
npm install -D @types/node
```

### Project Structure

```
my-app/
├── src/
│   ├── main/
│   │   ├── main.ts          # Electron main process
│   │   ├── database.ts      # SQLite operations
│   │   └── preload.ts       # Bridge between main/renderer
│   ├── renderer/
│   │   ├── App.tsx          # Main React component
│   │   ├── index.tsx        # React entry point
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx  # Authentication provider
│   │   └── views/
│   │       ├── LoginView.tsx
│   │       └── DashboardView.tsx
│   └── index.html
├── tsconfig.json
├── webpack.config.js
└── package.json
```

**Why this structure?** Electron has two processes: **main** (Node.js backend) and **renderer** (browser frontend). Separating them keeps code organized. The `preload.ts` acts as a secure bridge.

---

## 2. TypeScript Configuration

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "jsx": "react",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "moduleResolution": "node"
  },
  "include": ["src/**/*"]
}
```

**Explanation:** This tells TypeScript how to compile your code. `jsx: "react"` enables React syntax. `strict: true` catches errors early. `outDir` is where compiled files go.

---

## 3. Webpack Configuration

### `webpack.config.js`

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/renderer/index.tsx',
  target: 'electron-renderer',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'renderer.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};
```

**Explanation:** Webpack bundles your React code into a single file. `target: 'electron-renderer'` optimizes for Electron. `ts-loader` converts TypeScript to JavaScript. The plugin generates the HTML file automatically.

---

## 4. Database Layer with Sequelize ORM

### `src/main/database.ts`

```typescript
import { Sequelize, DataTypes, Model } from 'sequelize';
import path from 'path';
import { app } from 'electron';

// Database connection
const dbPath = path.join(app.getPath('userData'), 'app.db');
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false
});

// User Model
export class User extends Model {
  declare id: number;
  declare username: string;
  declare password: string;
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
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false
  }
);

// Initialize database
export async function initDatabase(): Promise<void> {
  await sequelize.sync();
}

// Database operations
export async function createUser(username: string, password: string): Promise<boolean> {
  try {
    await User.create({ username, password });
    return true;
  } catch {
    return false;
  }
}

export async function findUser(username: string, password: string): Promise<any> {
  const user = await User.findOne({
    where: { username, password },
    attributes: ['id', 'username']
  });
  return user ? user.toJSON() : null;
}

export async function closeDatabase(): Promise<void> {
  await sequelize.close();
}
```

**ORM Analogy: Your Personal Assistant**

Think of Sequelize as a **personal assistant** who speaks both English (JavaScript) and Database language (SQL). Instead of writing SQL yourself, you tell the assistant "create a user" in JavaScript, and the assistant translates it to SQL automatically.

**Why use an ORM?** Raw SQL is error-prone. Sequelize provides **type safety**, **automatic migrations**, and **cleaner code**. `User.create()` is easier to read than `INSERT INTO users...`. The `Model` class gives you methods like `.findOne()`, `.update()`, `.destroy()` for free.

---

## 5. Preload Script (Security Bridge)

### `src/main/preload.ts`

```typescript
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  login: (username: string, password: string) => 
    ipcRenderer.invoke('auth:login', username, password),
  register: (username: string, password: string) => 
    ipcRenderer.invoke('auth:register', username, password)
});
```

**Explanation:** `contextBridge` safely exposes functions to React. Think of it as a **security guard** that only allows specific actions. React can call `window.electronAPI.login()`, which sends a message to the main process via `ipcRenderer`.

---

## 6. Main Process (Electron Backend)

### `src/main/main.ts`

```typescript
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { initDatabase, createUser, findUser, closeDatabase } from './database';

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

// Authentication handlers
ipcMain.handle('auth:login', async (event, username: string, password: string) => {
  const user = await findUser(username, password);
  if (user) {
    return { success: true, user };
  }
  return { success: false, error: 'Invalid credentials' };
});

ipcMain.handle('auth:register', async (event, username: string, password: string) => {
  const success = await createUser(username, password);
  if (success) {
    return { success: true };
  }
  return { success: false, error: 'Username already exists' };
});

// Initialize app
app.whenReady().then(async () => {
  await initDatabase();
  createWindow();
});

app.on('window-all-closed', async () => {
  await closeDatabase();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
```

**Explanation:** This is your app's **control center**. `initDatabase()` creates tables before the window opens. `ipcMain.handle()` listens for messages from React (like "login" requests) and responds. Notice `await` keywords - Sequelize operations are **asynchronous** (they take time), so we wait for them to finish. `contextIsolation: true` keeps your app secure.

---

## 7. React Context (Authentication Provider)

### `src/renderer/contexts/AuthContext.tsx`

```typescript
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    const result = await window.electronAPI.login(username, password);
    if (result.success) {
      setUser(result.user);
      return true;
    }
    return false;
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    const result = await window.electronAPI.register(username, password);
    return result.success;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

**Analogy: Provider as a Broadcasting Station**

Imagine a **radio station** broadcasting music. The `AuthProvider` is the station, and `user` is the song playing. Any radio (component) tuned in can hear the song without asking the station directly. `useAuth()` is your radio receiver. When you call `login()`, the station changes the song, and all radios hear the update instantly.

**Why use this?** Without a Provider, you'd pass `user` through every component manually (called "prop drilling"). Providers let any component access shared data easily.

---

## 8. Login View

### `src/renderer/views/LoginView.tsx`

```typescript
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function LoginView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      const success = await register(username, password);
      if (success) {
        setIsRegister(false);
        alert('Account created! Please login.');
      } else {
        setError('Username already exists');
      }
    } else {
      const success = await login(username, password);
      if (!success) {
        setError('Invalid username or password');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: '10px' }}>
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <button onClick={() => setIsRegister(!isRegister)} style={{ marginTop: '10px' }}>
        {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
      </button>
    </div>
  );
}
```

**React Hooks Explained:**

- **`useState`**: Think of it as a **memory box** for your component. `useState('')` creates a box holding an empty string. `setUsername` updates the box, and React re-renders the component to show the new value.
- **`useAuth`**: This hook **tunes into the radio station** (AuthProvider) to get `login` and `register` functions.

**How it works:** When you type in the input, `onChange` puts the text in the memory box. Clicking submit calls `login()` or `register()`, which talks to Electron's main process.

---

## 9. Dashboard View

### `src/renderer/views/DashboardView.tsx`

```typescript
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export function DashboardView() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome, {user?.username}!</h1>
      <p>You are now logged in to the application.</p>
      <button onClick={logout} style={{ padding: '10px 20px', marginTop: '20px' }}>
        Logout
      </button>
    </div>
  );
}
```

**Explanation:** This view shows after login. `useAuth()` grabs the current user from the Provider. Clicking logout clears the user, which triggers React to show the login screen again.

---

## 10. Main App Component (Multi-View Rendering)

### `src/renderer/App.tsx`

```typescript
import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <LoginView />;
  }

  return <DashboardView />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
```

**Multi-View Rendering Explained:** The `if (!user)` check acts as a **traffic light**. If no user is logged in (red light), show `LoginView`. If logged in (green light), show `DashboardView`. React automatically switches views when `user` changes.

**Why wrap with AuthProvider?** The Provider must be **outside** components that use `useAuth()`. Think of it as turning on the radio station before trying to listen.

---

## 11. React Entry Point

### `src/renderer/index.tsx`

```typescript
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
```

**Explanation:** This finds the HTML element with `id="root"` and injects your React app into it. `createRoot` is React 18's way of starting the app.

---

## 12. HTML Template

### `src/index.html`

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>My Electron App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

**Explanation:** This is the skeleton. React fills the `<div id="root">` with your components. Webpack automatically adds the JavaScript bundle.

---

## 13. TypeScript Declarations

### `src/renderer/global.d.ts`

```typescript
export {};

declare global {
  interface Window {
    electronAPI: {
      login: (username: string, password: string) => Promise<any>;
      register: (username: string, password: string) => Promise<any>;
    };
  }
}
```

**Explanation:** This tells TypeScript that `window.electronAPI` exists. Without this, TypeScript would complain when you call `window.electronAPI.login()`.

---

## 14. Package.json Scripts

### `package.json`

```json
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "main": "dist/main.js",
  "scripts": {
    "build:renderer": "webpack",
    "build:main": "tsc src/main/main.ts --outDir dist && tsc src/main/database.ts --outDir dist && tsc src/main/preload.ts --outDir dist",
    "build": "npm run build:renderer && npm run build:main",
    "start": "npm run build && electron ."
  }
}
```

**Explanation:** `build:renderer` bundles React. `build:main` compiles Electron code. `start` builds everything and launches the app.

---

## 15. Running the App

```bash
npm run start
```

**What happens:**
1. Webpack bundles React into `dist/renderer.js`
2. TypeScript compiles Electron code into `dist/main.js`
3. Electron opens a window showing your app
4. Try registering a user, then logging in!

---

## Key Concepts Summary

### React Hooks
**`useState`**: A memory box that holds data and triggers re-renders when updated.  
**`useContext`**: A radio receiver that tunes into a Provider's broadcast.

### Providers
**Analogy**: A waiter at a restaurant. Instead of every table (component) going to the kitchen (database) for food (data), the waiter brings it to everyone. The Provider is the waiter, and `useAuth()` is how you call the waiter to your table.

### Electron Architecture
- **Main Process**: The kitchen (Node.js, database, file system)
- **Renderer Process**: The dining room (React UI)
- **Preload Script**: The waiter (secure bridge between kitchen and dining room)

### Multi-View Rendering
Use conditional logic (`if/else`) to show different components based on state. When state changes, React automatically switches views.

### Sequelize ORM Concepts

**What is an ORM?** Object-Relational Mapping. It's a **translator** between JavaScript objects and database tables.

**Models**: Think of a Model as a **blueprint** for a database table. `User.init()` defines the blueprint (columns, types, rules). Each instance of `User` is one row in the table.

**Operations**:
- `User.create({ username, password })` - Adds a new row
- `User.findOne({ where: { username } })` - Finds one matching row
- `User.findAll()` - Gets all rows
- `user.update({ password: 'new' })` - Updates a row
- `user.destroy()` - Deletes a row

**Why async/await?** Database operations take time (reading from disk). `await` pauses your code until the operation finishes, like waiting for a pizza delivery before eating.

---

## Security Notes

1. **Never use `nodeIntegration: true`** - This exposes dangerous Node.js APIs to the web.
2. **Always use `contextIsolation: true`** - Keeps Electron and web code separated.
3. **Hash passwords in production** - Use `bcrypt` instead of storing plain text.
4. **Validate all inputs** - Check username/password length and format.

---

## Next Steps

- Add password hashing with `bcrypt`
- Create more views (settings, profile)
- Add CSS styling with a framework
- Implement session persistence
- Build the app with `electron-builder` for distribution

**Aprendizaje react ts, electron, bd, aplicacion fullstack electron** - You now have a complete foundation for building full-stack desktop applications!
