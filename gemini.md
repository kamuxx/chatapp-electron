# Project Mandate: Chat App (Electron)

## 1. Technical Stack (Non-Negotiable)
- **Language**: JavaScript (CommonJS)
- **Framework/Runtime**: Electron v40 + Electron Forge
- **Styling**: TailwindCSS v4
- **Packaging/Architecture**: Squirrel.Windows (integraciones nativas vía C++) y empaquetado multiplataforma (zip, deb, rpm).

## 2. Architecture Principles
- **Desktop First (Electron Arquitecture)**: Separación estricta entre **Main Process** (Node.js backend/SO) y **Renderer Process** (Frontend UI).
- **Secure Communication**: Uso de `preload` e IPC (Inter-Process Communication) para enviar datos seguros entre el frontend y el backend nativo.
- **Styling Utility-First**: Componentes estrcuturados en interfaces simples utilizando puramente HTML/JS con TailwindCSS para estilización y compilación de CSS vía CLI.

## 3. Business Context
- Aplicación de escritorio tipo "Chat App" diseñada para correr como una aplicación genuinamente instalable en el ecosistema Windows (y potencialmente otras plataformas) utilizando estándares modernos web pero con integración a nivel del sistema operativo.
