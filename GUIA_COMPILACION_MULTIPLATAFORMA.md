# 🌍 Guía de Compilación Multiplataforma (Electron Builder)

Esta guía explica la estrategia para compilar instaladores de ChatApp en los 3 ecosistemas principales usando **Electron Builder** como toolchain único.

---

## 🏗️ 1. Regla de Oro de la Compilación Nativa

Electron Builder necesita compilar binarios nativos de Node.js (`node-gyp`) ligados directamente al SO destino.

> **No se recomienda compilación cruzada.** Compilar para macOS desde Windows es inviable por los protocolos de firma de Apple. Compilar para Linux desde Windows requiere Docker.

---

## 🪟 2. Windows (`.exe` instalador NSIS)

Flujo nativo y directo. Requiere **Visual Studio Build Tools con C++** (ver `GUIA_COMPILACION_WINDOWS.md`).

```bash
# Compilar CSS y generar instalador NSIS + publicar en GitHub
bun run build:css
bun run release
```

**Resultado:** `release/chatapp-electron-Setup-X.Y.Z.exe`

---

## 🐧 3. Linux (`.deb` / `.rpm`) vía Docker

Usamos Docker para evitar contaminar el host Windows con herramientas de Linux. El contenedor efímero ya tiene todo configurado.

```bash
# Solo necesitas Docker Desktop corriendo
docker-compose -f docker-compose.builder.yml up --build
```

**Resultado:** Los instaladores `.deb` y `.rpm` aparecerán en tu carpeta `release/linux/` sincronizados vía volumen de Docker.

> **Analogía:** Docker es como una "máquina virtual de usar y tirar". La enciendes, construye los paquetes, te los deja y se apaga sola.

---

## 🍎 4. macOS (`.dmg` / `.zip`)

Apple exige herramientas propietarias (`codesign`, `hdiutil`) que **solo existen en macOS**. Las opciones son:

| Opción | Cuándo usarla |
|---|---|
| Mac física | Clonas el repo, `bun install`, `bun run release` |
| GitHub Actions (`macos-latest` runner) | Sin Mac — los servidores de GitHub compilan por ti |

Para CI/CD automatizado, los servidores de GitHub ejecutan el build en macOS y suben el `.dmg` directamente al GitHub Release.

---

## 📊 Resumen de Scripts

| Comando | Target | Resultado |
|---|---|---|
| `bun run build` | Local | `release/win-unpacked/` — prueba sin instalar |
| `bun run release` | GitHub | Instalador NSIS + `latest.yml` para auto-updater |
| `docker-compose up` | Linux | `.deb` + `.rpm` en `release/` |
