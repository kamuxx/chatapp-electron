# 💬 ChatApp / Electron.js Architecture & Build Pipeline

![Electron](https://img.shields.io/badge/Electron-40.0.0-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22_LTS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

> Una aplicación de mensajería de escritorio orientada a establecer patrones de **arquitectura sólida** en Electron y estrategias robustas de **compilación nativa multiplataforma**.

---

## 🧠 Descripción Técnica (Semi-Senior)

Este repositorio actúa como un PoC (Proof of Concept) avanzado que ilustra la integración de Electron.js con Node 22 LTS, haciendo énfasis en las mejores prácticas de arquitectura de escritorio. 

El proyecto resuelve requerimientos clave de la industria:
- **Separación de responsabilidades**: Aislamiento estricto entre la capa de interfaz de usuario (Renderer) y las operaciones críticas del sistema operativo (Main).
- **Comunicación Segura**: Implementación de IPC (Inter-Process Communication) mitigando riesgos de inyección de código.
- **Toolchain de Compilación**: Resolución de los cuellos de botella generados por dependencias nativas (`node-gyp`) y despliegue cross-platform utilizando Docker para Linux y herramientas nativas (MSVC build tools) para Windows.

---

## 🏗️ Arquitectura de Procesos en Electron

El proyecto sigue el modelo de multiprocesos de Chromium, adaptado para la seguridad y el rendimiento del runtime de Node.js:

1. ⚙️ **Main Process (`app.js`):** El backend de la aplicación. Orquesta el ciclo de vida de la app, gestiona las ventanas nativas (BrowserWindows) y tiene acceso sin restricciones a las APIs del SO y Node.js.
2. 🎨 **Renderer Process (UI):** Responsable de la renderización del HTML, CSS (gestionado vía Tailwind CLI) y ejecución de JavaScript puro (Vanilla JS). Se ejecuta en un entorno de sandbox por defecto.
3. 🌉 **Capa de Comunicación (IPC):** El Renderer no interactúa directamente con Node.js por motivos de seguridad. Toda interacción con el OS, sistema de archivos o bases de datos se enruta mediante invocadores IPC controlados hacia el Main Process.

---

## 🚀 1. Entorno de Desarrollo Local

Requiere **Node.js 22 LTS** para garantizar compatibilidad con ABI de Electron y el toolchain nativo.

```bash
# 1. Clonar repositorio e ingresar al directorio
git clone https://github.com/kamuxx/chatapp-electron.git
cd electronjs

# 2. Instalar dependencias del árbol principal
npm install

# 3. Iniciar el entorno de desarrollo automático
npm run dev
```

> **Nota:** El comando `dev` orquesta en paralelo la compilación iterativa de CSS mediante Tailwind CLI y levanta el entorno de Electron con `nodemon` en modo *watch*.

---

## 📦 2. Pipeline de Compilación y Distribución (Build Tools)

El despliegue de instaladores ejecutables requiere un toolchain predecible para procesar el código C++ nativo a través de `node-gyp` y paquetizar con `electron-forge`.

### 🪟 Windows (`.exe` via Squirrel)

La compilación en Windows demanda las herramientas de desarrollo de Microsoft (MSVC).

1. Instalar **Visual Studio Build Tools 2022+** (Incluir carga de trabajo: *Desarrollo de escritorio con C++*).
2. Para evitar conflictos de múltiples versiones instaladas de VS, inicializar variables de entorno de `gyp`:

```powershell
$env:GYP_MSVS_VERSION="2024" # Ajustar a tu toolset instalado
npm run build:css
npm run make
```
> El resultado se exportará a la ruta `/out/make/squirrel.windows/x64/` (El empaquetador utilizará obligatoriamente los metadatos `"author"` y `"description"` del `package.json`).

### 🐧 Linux (`.deb` / `.rpm` via Docker)

Evitamos contaminar el host Windows e incompatibilidades originadas en dependencias como libc utilizando infraestructura en contenedores. **Docker** provee un ambiente aislado (usualmente Debian-based) donde las herramientas cruzadas construyen los paquetes de forma predecible.

Ejecución de build Linux desde Windows usando `docker-compose`:
```bash
docker-compose -f docker-compose.builder.yml up --build
```
> Los instaladores compilados aparecerán sincronizados en el volumen `/out/make/[deb|rpm]/x64/`.

### 🍎 macOS (`.dmg` / `.zip` Darwin)

Por restricciones a nivel del ecosistema Apple, la compilación cruzada hacia macOS desde Windows/Linux resulta inestable e impracticable para uso en producción. La estrategia adoptada es delegar el build de los binarios macOS hacia un **pipeline de CI/CD** (ej. GitHub Actions utilizando un *runner* `macos-latest`), garantizando herramientas de compilación oficiales (Xcode Command Line Tools).

---

## 📁 Estructura del Proyecto

```text
electronjs/
├── src/
│   ├── app.js                    # Core Runtime / Main Process Configuration
│   ├── renderer/                 # Lógica controladora de UI estricta
│   ├── pages/                    # Vistas HTML / DOM Elements
│   └── assets/                   # Estilos tailwind-source (input.css) y hooks visuales
├── forge.config.js               # Configuración declarativa de makers y build fuses para Forge
├── Dockerfile.builder            # Definición del contenedor efímero para compilaciones Linux
├── docker-compose.builder.yml    # Orquestador del ambiente local aislado
├── package.json                  # Entrypoint, dependencias y metadata de distribución
└── index.js                      # Bootstrap loader de la aplicación
```

---

## 🎯 Roadmap y Registro de Cambios

Para mantener la trazabilidad de la deuda técnica y las especificaciones de arquitectura, el tracking del proyecto se delega a los siguientes documentos fuente:

- 📜 **Changelog**: Historial versionado de distribuciones y características ([`CHANGELOG.md`](./CHANGELOG.md)).
- 🔮 **Planificación de Arquitectura**: Registro de optimizaciones backend/frontend pendientes (Refactorizaciones, seguridad IPC, accesibilidad UI y consistencia CSS) ([`mejoras.md`](./mejoras.md)).

---

> 💡 **Perspectiva Arquitectónica:** El desarrollo integral con Electron trasciende el maquetado del frontend (Chromium). Demanda un entendimiento riguroso del ciclo de vida del *host runtime* (SO), la gestión de errores inter-proceso y DevOps; garantizando pipelines reproducibles y escalables multi-arquitectura orientados a entornos de producción.
