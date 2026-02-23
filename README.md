# 💬 ChatApp / Electron.js Architecture & Build Pipeline

![Electron](https://img.shields.io/badge/Electron-40.0.0-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-1.3.8-FBF0DF?style=for-the-badge&logo=bun&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Electron Builder](https://img.shields.io/badge/Electron_Builder-26.x-2C2C2C?style=for-the-badge)

> Una aplicación de mensajería de escritorio orientada a establecer patrones de **arquitectura sólida** en Electron y estrategias robustas de **compilación nativa multiplataforma**.

---

## 🧠 Descripción Técnica

Este repositorio actúa como un PoC (Proof of Concept) que ilustra la integración de Electron.js con Node 22 LTS, haciendo énfasis en las mejores prácticas de arquitectura de escritorio.

El proyecto resuelve requerimientos clave de la industria:
- **Separación de responsabilidades**: Aislamiento estricto entre la capa de interfaz (Renderer) y las operaciones del SO (Main Process).
- **Comunicación Segura**: Implementación de IPC (Inter-Process Communication) mitigando riesgos de inyección de código.
- **Auto-Updater**: Integración de `electron-updater` con GitHub Releases para distribución y actualización automática de versiones.
- **Toolchain de Compilación**: `electron-builder` con instalador NSIS para Windows, Docker para Linux.

---

## 🏗️ Arquitectura de Procesos

```
┌─────────────────────────────────────────────────────┐
│                   Main Process                       │
│  app.js — Node.js / Electron Runtime / auto-updater │
└──────────────────┬──────────────────────────────────┘
                   │ IPC (ipcMain / ipcRenderer)
┌──────────────────▼──────────────────────────────────┐
│                Renderer Process                      │
│  chat.html + chat-renderer.js — UI / DOM / Events   │
└─────────────────────────────────────────────────────┘
```

1. ⚙️ **Main Process** (`src/app.js`): Backend de la app. Gestiona ventanas, ciclo de vida y tiene acceso completo al SO.
2. 🎨 **Renderer Process** (HTML/JS): Renderiza la UI. Ejecuta en sandbox de Chromium.
3. 🌉 **IPC**: Canal de comunicación controlado entre ambos procesos.

---

## 🚀 Entorno de Desarrollo

```bash
# 1. Clonar repositorio
git clone https://github.com/kamuxx/chatapp-electron.git
cd chatapp-electron

# 2. Instalar dependencias
bun install

# 3. Iniciar en modo desarrollo (hot-reload)
bun run dev
```

> `bun run dev` compila el CSS con TailwindCSS CLI y levanta Electron con `nodemon` en modo watch.

---

## 📦 Scripts Disponibles

| Comando | Descripción |
|---|---|
| `bun run dev` | Desarrollo con hot-reload (CSS + Electron) |
| `bun run build:css` | Compila `input.css` → `output.css` (minificado) |
| `bun run build` | Genera `release/win-unpacked/` para prueba local |
| `bun run release` | Compila instalador NSIS y publica en GitHub Releases |

---

## 📦 Pipeline de Compilación

### 🪟 Windows — Instalador NSIS
```bash
bun run release
```
> Requiere **Visual Studio Build Tools** con carga de trabajo *Desktop development with C++*.
> Ver → [`GUIA_COMPILACION_WINDOWS.md`](./GUIA_COMPILACION_WINDOWS.md)

### 🐧 Linux — `.deb` / `.rpm` via Docker
```bash
docker-compose -f docker-compose.builder.yml up --build
```
> Ver → [`GUIA_COMPILACION_MULTIPLATAFORMA.md`](./GUIA_COMPILACION_MULTIPLATAFORMA.md)

### 🍎 macOS — GitHub Actions
La compilación cruzada hacia macOS desde Windows es inviable. Se recomienda usar un runner `macos-latest` en GitHub Actions.

---

## 📁 Estructura del Proyecto

```text
electronjs/
├── src/
│   ├── app.js                    # Main Process — auto-updater, IPC handlers
│   ├── renderer/                 # Lógica del Renderer Process
│   ├── pages/                    # Vistas HTML
│   └── assets/                   # input.css (fuente) + output.css (compilado)
├── index.js                      # Entry point
├── package.json                  # Dependencias y config de electron-builder
├── Dockerfile.builder            # Contenedor para builds Linux
├── docker-compose.builder.yml    # Orquestador del build Linux
└── forge.config.js               # Archivo legacy (no en uso activo)
```

---

## 🎯 Documentación

- 📜 **Changelog**: [`CHANGELOG.md`](./CHANGELOG.md)
- 🪟 **Compilación Windows**: [`GUIA_COMPILACION_WINDOWS.md`](./GUIA_COMPILACION_WINDOWS.md)
- 🌍 **Compilación Multiplataforma**: [`GUIA_COMPILACION_MULTIPLATAFORMA.md`](./GUIA_COMPILACION_MULTIPLATAFORMA.md)
- 🔮 **Roadmap de mejoras**: [`mejoras.md`](./mejoras.md)

---

> 💡 **Perspectiva Arquitectónica:** Electron trasciende el frontend. Demanda entendimiento del ciclo de vida del OS, gestión inter-proceso y DevOps — garantizando pipelines reproducibles y escalables en producción.
