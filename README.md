# 💬 ChatApp - Electron.js

> Aplicación de mensajería instantánea de escritorio construida con Electron.js como proyecto educativo para aprender los fundamentos del framework.

![Electron](https://img.shields.io/badge/Electron-40.0.0-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 📋 Descripción

**ChatApp** es una aplicación de chat de escritorio que simula la interfaz y funcionalidad básica de aplicaciones de mensajería modernas como WhatsApp o Telegram. Este proyecto fue creado con fines educativos para aprender y practicar:

- ✅ Arquitectura de aplicaciones Electron.js
- ✅ Comunicación IPC (Inter-Process Communication)
- ✅ Diseño de interfaces modernas con Tailwind CSS
- ✅ Desarrollo de aplicaciones de escritorio multiplataforma

## ✨ Características

### Implementadas
- 📱 **Lista de Contactos**: Renderizado dinámico con avatares y preview de mensajes
- 💬 **Vista de Chat**: Burbujas de mensajes diferenciadas (enviados/recibidos)
- 🖼️ **Soporte de Imágenes**: Visualización de imágenes en mensajes
- ✓ **Indicadores de Lectura**: Doble check azul/gris para estado de mensajes
- 🕒 **Timestamps**: Hora de envío en cada mensaje
- 🎨 **Dark Mode**: Interfaz moderna con tema oscuro
- 📱 **Responsive**: Adaptable a diferentes tamaños de ventana
- ⌨️ **Navegación por Teclado**: Tecla ESC para limpiar selección

### En Desarrollo
- 📤 Envío de mensajes real
- 📎 Adjuntar archivos
- 🔍 Búsqueda de contactos funcional
- 🔔 Notificaciones de escritorio
- 💾 Persistencia de datos

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Electron.js** | 40.0.0 | Framework principal para aplicaciones de escritorio |
| **Tailwind CSS** | 4.1.18 | Framework CSS para estilos modernos |
| **Node.js** | - | Runtime de JavaScript |
| **Nodemon** | 3.1.11 | Hot-reload durante desarrollo |

## 📁 Estructura del Proyecto

```
electronjs/
├── src/
│   ├── app.js                    # Proceso principal (Main Process)
│   ├── chats.js                  # Datos mock de contactos y mensajes
│   ├── renderer/
│   │   └── chat-renderer.js      # Lógica del renderer process
│   ├── pages/
│   │   ├── chat.html             # Interfaz principal del chat
│   │   ├── index.html            # Página de inicio
│   │   └── auth/
│   │       ├── login.html        # Página de login
│   │       └── register.html     # Página de registro
│   ├── components/
│   │   └── layout.html           # Layout base
│   └── assets/
│       ├── input.css             # Estilos Tailwind (fuente)
│       ├── output.css            # CSS compilado
│       └── typography.css        # Estilos de tipografía
├── index.js                      # Entry point de la aplicación
├── package.json                  # Dependencias y scripts
├── nodemon.json                  # Configuración de Nodemon
├── mejoras.md                    # Plan de mejoras futuras
└── .gitignore                    # Archivos ignorados por Git
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/kamuxx/chatapp-electron.git
   cd chatapp-electron
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

   Este comando:
   - Compila los estilos de Tailwind CSS
   - Inicia la aplicación Electron
   - Activa hot-reload con Nodemon

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia la aplicación en modo desarrollo con hot-reload |
| `npm run build:css` | Compila los estilos de Tailwind CSS |

## 🏗️ Arquitectura

### Flujo de Datos (IPC)

```
┌─────────────────────────────────────────────────────────┐
│                    Main Process                         │
│                     (app.js)                            │
└──────────────┬──────────────────────┬───────────────────┘
               │                      │
               │ send('contacts')     │ send('user-messages')
               ↓                      ↓
┌─────────────────────────────────────────────────────────┐
│                 Renderer Process                        │
│                   (chat.html)                           │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Sidebar    │  │  Chat Area   │  │   Footer     │ │
│  │  (Contacts)  │  │  (Messages)  │  │   (Input)    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└──────────────┬──────────────────────────────────────────┘
               │
               │ send('contact-selected')
               ↓
         Main Process
```

### Modelo de Datos

#### Contacto
```javascript
{
  nick: "alice",
  name: "Alice Johnson",
  avatar: "https://picsum.photos/id/1005/80/80",
  last_message_at: "2026-01-20T13:10:00-04:00",
  messages: [...]
}
```

#### Mensaje
```javascript
{
  id: "1",
  text: "Mensaje de texto",
  sent_at: "2026-01-20T12:00:00-04:00",
  is_read: true,
  direction: "sent" | "received",
  fromMe: true | false,
  media: "url" | null
}
```

## 🎨 Capturas de Pantalla

> _Próximamente: Capturas de la interfaz de la aplicación_

## 📚 Aprendizajes Clave

Este proyecto me permitió aprender:

1. **Arquitectura Electron**: Diferencia entre Main Process y Renderer Process
2. **IPC Communication**: Comunicación bidireccional entre procesos
3. **Seguridad**: Configuración de `nodeIntegration` y `contextIsolation`
4. **Tailwind CSS**: Diseño responsive y moderno
5. **Hot Reload**: Configuración de Nodemon para desarrollo ágil
6. **Refactorización de código**: Separación de responsabilidades y mejores prácticas

## 📜 Historial de Cambios

### Versión Actual: **v0.2.0** (2026-01-22)

#### Últimos Cambios
- ♻️ **Refactorización completa**: Separación de lógica JavaScript en archivo externo
- 📚 **Documentación mejorada**: README completo y plan de mejoras detallado
- ⚡ **Optimizaciones**: Funciones refactorizadas con mejores prácticas
- 🎯 **Mejoras de UX**: Tiempo relativo dinámico y preview de mensajes inteligente

Para ver el historial completo de cambios, consulta el archivo [`CHANGELOG.md`](./CHANGELOG.md).

### Versiones Anteriores
- **v0.1.0** (2026-01-22): Versión inicial con funcionalidad básica de chat
- **v0.0.0** (2026-01-22): Inicio del proyecto

## 🔮 Roadmap

Consulta el archivo [`mejoras.md`](./mejoras.md) para ver el plan completo de mejoras organizadas en 10 categorías:

- 🎯 Accesibilidad (A11y)
- 📝 Semántica HTML
- 💻 JavaScript - Mejores Prácticas
- ⚡ Rendimiento
- 🎨 UX/UI - Funcionalidad Interactiva
- 🎭 Estilos CSS - Consistencia
- 🔒 Seguridad
- 🛠️ Mantenibilidad
- ✨ Funcionalidad Faltante
- 📱 Responsive Design

## 🤝 Contribuciones

Este es un proyecto educativo personal, pero las sugerencias y feedback son bienvenidos. Si encuentras algún bug o tienes ideas de mejora:

1. Abre un **Issue** describiendo el problema o sugerencia
2. Si quieres contribuir código, abre un **Pull Request**

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia ISC.

## 👨‍💻 Autor

**kamuxx**
- GitHub: [@kamuxx](https://github.com/kamuxx)

---

⭐ Si este proyecto te ayudó a aprender Electron.js, considera darle una estrella!

## 📖 Recursos de Aprendizaje

- [Documentación oficial de Electron](https://www.electronjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Nota**: Este proyecto está en desarrollo activo como parte de mi proceso de aprendizaje de Electron.js. La funcionalidad puede estar incompleta o cambiar frecuentemente.
