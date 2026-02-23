# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [Unreleased]

### 🎯 Próximas Mejoras Planificadas
Ver el archivo [`mejoras.md`](./mejoras.md) para el roadmap completo de mejoras organizadas en 10 categorías.

---

## [1.2.0] - 2026-02-23

### ✨ Características (Features)
- **Notificaciones Visuales de Actualización**: Implementación de un Toast interactivo en base a TailwindCSS inyectado en `chat.html` para dar visibilidad al usuario del proceso de descarga e instalación.
- **Controlador Dinámico de Estado**: Nueva función `showUpdaterUI()` en `chat-renderer.js` que se conecta a los eventos del proceso principal y actualiza la DOM dinámicamente incluyendo barras de progreso con RegExp.
- **Logs Nativos**: Integración de la librería `electron-log` en el backend para trazar mejor el proceso del AutoUpdater.

### 🔧 Configuración (Chore)
- **Migración a Bun**: Reemplazo de `package-lock.json` por `bun.lock` para optimizar los tiempos y estabilidad en el manejo de dependencias.
- **Notarización y Empaquetado Windows**: Modificación profunda del target del builder a NSIS `win: { target: "nsis" }` omitiendo `oneClick: false` para el Setup manual.
- **Actualización de `.gitignore`**: Agregado `/release/` para evitar trackear los compilados finales.

---

## [1.1.0] - 2026-02-20

### ✨ Características (Features)
- **Auto-Updater Activo**: Configuración arquitectónica e integración de `electron-updater`.
- **Comunicación IPC Segura**: Nuevos canales (`update-available`, `update-ready`, `start-update-download`, `install-update`) para coordinar las descargas entre la UI y el Sistema Operativo sin romper la seguridad del *Main Process*.
- **Configuración de Publicación**: Adición del bloque `build.publish` en `package.json` apuntando a GitHub Releases para habilitar las consultas REST del actualizador hacia el repositorio origen.

---

## [0.3.0] - 2026-02-20

### ✨ Características (Features)
- **Empaquetado y Distribución**: Integración con `electron-forge` (`@electron-forge/cli`, makers para squirrel, deb, rpm, zip).
- **Entorno Limpio de Compilación**: Configuración con Docker (`Dockerfile.builder`, `docker-compose.builder.yml` y `.dockerignore`) para empaquetado seguro y multi-plataforma de Electron.

### 📚 Documentación (Docs)
- **Guías de Compilación**: Agregados manuales detallados (`GUIA_COMPILACION_MULTIPLATAFORMA.md` y `GUIA_COMPILACION_WINDOWS.md`) para facilitar los builds de la aplicación.
- **Arquitectura y Contexto**: Inclusión de `gemini.md` describiendo la arquitectura a alto nivel y principios de la aplicación.
- Actualización general en los manuales de integración de React con Electron (`GUIA-REACT-ELECTRON.md` y `GUIA-CHAT-REACT-ELECTRON.md`).

### 🔧 Configuración (Chore)
- **Scripts Npm**: Añadidos scripts `start`, `package` y `make` en el `package.json` para simplificar la ejecución de Forge.
- Configuración de `forge.config.js` adaptada al entorno Windows y con soporte nativo (utilizando `@electron-forge/plugin-auto-unpack-natives` y mitigación de fuses).

---

## [0.2.0] - 2026-01-22

### ♻️ Refactorización

#### Separación de Responsabilidades
- **Creado `src/renderer/chat-renderer.js`**: Toda la lógica JavaScript del renderer process ahora está en un archivo externo (327 líneas)
- **Simplificado `src/pages/chat.html`**: Reducido de 402 a 124 líneas eliminando ~280 líneas de script inline
- **Mejor organización del código**: JavaScript organizado en secciones claras:
  - Variables globales
  - Constantes (iconos de estado de mensajes)
  - Funciones de mensajes (6 funciones)
  - Funciones de contactos (5 funciones)
  - Funciones de navegación y UI (2 funciones)
  - IPC Listeners
  - Event Listeners

#### Mejoras en Funciones de Renderizado

**`renderMessages()` - Refactorizada en 6 funciones especializadas:**
- `getMessageStatusIcon()`: Maneja iconos de estado (leído/enviado)
- `buildMessageBody()`: Construye el cuerpo del mensaje
- `buildMediaWithText()`: Maneja mensajes con imagen + texto
- `formatMessageTime()`: Formatea timestamps
- `createMessageHTML()`: Crea HTML de un mensaje individual
- `renderMessages()`: Función principal simplificada

**Mejoras técnicas:**
- ✅ Uso de `map()` en lugar de `forEach()` con concatenación
- ✅ Validación de datos (array vacío)
- ✅ Desestructuración de objetos
- ✅ Agregado `rel="noopener noreferrer"` a links externos para seguridad
- ✅ Documentación JSDoc completa

**`renderContacts()` - Refactorizada en 5 funciones especializadas:**
- `getMessagePreview()`: Genera preview inteligente del último mensaje (truncado a 30 chars)
- `getRelativeTime()`: Calcula tiempo relativo REAL (antes era hardcoded "Hace 5 min")
  - Soporta: "Ahora", "Hace X min", "Hace Xh", "Ayer", "Hace Xd", o fecha
- `createContactHTML()`: Construye HTML de un contacto
- `handleContactClick()`: Maneja clicks usando delegación de eventos
- `renderContacts()`: Función principal simplificada

**Mejoras técnicas:**
- ✅ Eliminación de `onclick` inline - ahora usa delegación de eventos
- ✅ Event listener único en el contenedor (mejor rendimiento)
- ✅ `loading="lazy"` en imágenes de avatares
- ✅ `object-cover` en avatares para mejor visualización
- ✅ `truncate` en CSS para evitar overflow
- ✅ Border en indicador online para mejor contraste
- ✅ `transition-colors` en hover
- ✅ Validación completa de datos

### 📚 Documentación

#### README.md Completo (218 líneas)
- **Badges profesionales**: Electron, Tailwind CSS, JavaScript
- **Descripción detallada**: Propósito educativo del proyecto
- **Stack tecnológico**: Tabla con versiones y propósitos
- **Estructura del proyecto**: Árbol de directorios con comentarios
- **Diagrama de arquitectura IPC**: Flujo de comunicación Main ↔ Renderer
- **Modelo de datos**: Estructuras de contacto y mensaje
- **Instrucciones de instalación**: Paso a paso
- **Scripts disponibles**: Tabla de comandos npm
- **Roadmap**: Vinculado a `mejoras.md`
- **Recursos de aprendizaje**: Links a documentación oficial

#### mejoras.md - Plan de Mejoras (823 líneas)
- **Contexto completo de la aplicación**: Descripción, propósito, stack, arquitectura
- **Funcionalidad actual documentada**: Qué funciona y qué no
- **10 categorías de mejoras**:
  1. Accesibilidad (A11y)
  2. Semántica HTML
  3. JavaScript - Mejores Prácticas
  4. Rendimiento
  5. UX/UI - Funcionalidad Interactiva
  6. Estilos CSS - Consistencia
  7. Seguridad
  8. Mantenibilidad
  9. Funcionalidad Faltante
  10. Responsive Design
- **Priorización sugerida**: Alta, Media, Baja
- **Checklist de validación**: Para cada mejora
- **Regla no negociable**: No introducir bugs

### 🔧 Configuración

#### .gitignore
- Excluye `node_modules/`
- Excluye archivos de build y logs
- Excluye archivos del sistema operativo
- Excluye configuraciones de IDEs

---

## [0.1.0] - 2026-01-22

### ✨ Características Iniciales

#### Aplicación Base de Chat
- **Interfaz de usuario completa** con Tailwind CSS v4.1.18
- **Lista de contactos dinámica**: 6 contactos de ejemplo
- **Vista de chat funcional**: Mensajes enviados/recibidos diferenciados
- **Soporte de imágenes**: Visualización de imágenes en mensajes
- **Indicadores de lectura**: Doble check azul (leído) / gris (enviado)
- **Timestamps**: Hora de envío en cada mensaje
- **Dark mode**: Diseño moderno con tema oscuro
- **Responsive design**: Breakpoints sm, md, lg

#### Arquitectura Electron
- **Main Process** (`src/app.js`): 
  - Configuración de BrowserWindow
  - Menú personalizado con DevTools
  - IPC handlers para comunicación
- **Renderer Process** (`src/pages/chat.html`):
  - Interfaz de usuario
  - Lógica de renderizado (inicialmente inline)
- **Datos mock** (`src/chats.js`):
  - 6 contactos con 15+ mensajes cada uno
  - Estructura completa de mensajes con metadata

#### Navegación y UX
- **Selección de contactos**: Click para ver mensajes
- **Tecla ESC**: Limpia selección y vuelve al estado inicial
- **Estado "sin chat seleccionado"**: Mensaje placeholder
- **Hover states**: Efectos visuales en elementos interactivos

#### Sistema de Build
- **Tailwind CSS CLI**: Compilación de estilos
- **Nodemon**: Hot-reload automático en desarrollo
- **Script `npm run dev`**: Compila CSS + inicia Electron con watch mode

### 📁 Estructura de Archivos

```
electronjs/
├── src/
│   ├── app.js              # Main process
│   ├── chats.js            # Datos mock
│   ├── pages/
│   │   ├── chat.html       # Interfaz principal
│   │   ├── index.html
│   │   └── auth/
│   │       ├── login.html
│   │       └── register.html
│   ├── components/
│   │   └── layout.html
│   └── assets/
│       ├── input.css       # Estilos fuente
│       ├── output.css      # CSS compilado
│       └── typography.css
├── index.js                # Entry point
├── package.json
├── nodemon.json
└── .gitignore
```

### 🎨 Diseño UI/UX

#### Sidebar (Lista de Contactos)
- Header con título "Chats" y botón de nuevo chat
- Input de búsqueda (visual, sin funcionalidad)
- Lista scrollable de contactos con:
  - Avatar circular
  - Indicador de estado online (punto verde)
  - Nombre del contacto
  - Preview del último mensaje
  - Timestamp relativo
- Footer con configuración de usuario

#### Área de Chat
- Header con:
  - Avatar del contacto
  - Nombre
  - Estado ("Escribiendo...")
- Área de mensajes scrollable con:
  - Burbujas diferenciadas (enviados: azul, recibidos: gris)
  - Soporte para texto e imágenes
  - Timestamps
  - Indicadores de lectura
- Footer con:
  - Botón de adjuntar archivo (visual)
  - Input de mensaje (visual)
  - Botón de enviar (visual)

### 🔌 Comunicación IPC

#### Eventos Main → Renderer
- `contacts`: Envía lista de contactos al cargar
- `user-messages`: Envía mensajes del contacto seleccionado

#### Eventos Renderer → Main
- `contact-selected`: Notifica selección de contacto con nick

### 🛠️ Dependencias

#### Producción
- `tailwindcss@4.1.18`: Framework CSS
- `@tailwindcss/cli@4.1.18`: CLI de Tailwind

#### Desarrollo
- `electron@40.0.0`: Framework principal
- `nodemon@3.1.11`: Hot-reload

### ⚙️ Configuración

#### package.json - Scripts
```json
{
  "dev": "clear && npm run build:css & nodemon --exec electron .",
  "build:css": "tailwindcss -i ./src/assets/input.css -o ./src/assets/output.css --minify"
}
```

#### nodemon.json
- Watch: `src/**/*.{js,html,css,json}`
- Delay: 500ms
- Verbose: true

### 🐛 Problemas Conocidos

#### Warnings de Electron DevTools
- `Autofill.enable` y `Autofill.setAddresses` no encontrados
- **Impacto**: Solo warnings en consola, no afecta funcionalidad
- **Causa**: Electron DevTools buscando APIs de Chrome no disponibles

#### Funcionalidad Pendiente
- ❌ Búsqueda de contactos no funcional
- ❌ Botón de adjuntar archivo sin implementar
- ❌ Input de mensaje sin funcionalidad de envío
- ❌ Tiempo relativo hardcoded (solucionado en v0.2.0)

### 🔒 Seguridad

#### Configuración Actual (Insegura - Solo para Desarrollo)
```javascript
webPreferences: {
    nodeIntegration: true,      // ⚠️ Debe cambiarse
    contextIsolation: false     // ⚠️ Debe cambiarse
}
```

**Nota**: Ver `mejoras.md` sección #7 para plan de migración a Context Bridge.

---

## [0.0.0] - 2026-01-22

### 🎉 Inicio del Proyecto
- Creación del repositorio en GitHub
- Licencia ISC agregada
- README inicial del repositorio

---

## Leyenda de Tipos de Cambios

- ✨ **Características**: Nuevas funcionalidades
- ♻️ **Refactorización**: Mejoras de código sin cambiar funcionalidad
- 🐛 **Correcciones**: Arreglo de bugs
- 📚 **Documentación**: Cambios en documentación
- 🎨 **Estilos**: Cambios de UI/UX
- ⚡ **Rendimiento**: Mejoras de performance
- 🔒 **Seguridad**: Mejoras de seguridad
- 🔧 **Configuración**: Cambios en configuración
- 🗑️ **Eliminaciones**: Código o archivos eliminados
- 🚀 **Deploy**: Cambios relacionados con despliegue

---

## Estadísticas del Proyecto

### Líneas de Código (v0.2.0)
- **Total**: ~5,100 líneas
- **JavaScript**: ~800 líneas
- **HTML**: ~600 líneas
- **CSS**: ~50 líneas (fuente)
- **JSON**: ~400 líneas (datos mock)
- **Markdown**: ~1,100 líneas (docs)

### Commits
- **Total**: 5 commits
- **Inicial**: 1
- **Desarrollo**: 2
- **Documentación**: 1
- **Refactorización**: 1

### Archivos
- **Total**: 21 archivos (sin contar node_modules)
- **Código fuente**: 12 archivos
- **Documentación**: 3 archivos
- **Configuración**: 6 archivos

---

## Contribuidores

- **kamuxx** - Desarrollo inicial y refactorización

---

## Licencia

Este proyecto está bajo la licencia ISC - ver el archivo [LICENSE](LICENSE) para más detalles.

---

**Nota**: Este es un proyecto educativo en desarrollo activo. Las versiones pueden cambiar frecuentemente durante el proceso de aprendizaje.
