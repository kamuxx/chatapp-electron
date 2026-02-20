# 🌍 Guía Arquitectónica de Compilación Multiplataforma (Electron)

Esta guía explica la estrategia técnica para compilar instaladores de Electron en los 3 ecosistemas principales (Windows, Linux y macOS) partiendo desde un entorno Windows.

---

## 🏗️ 1. Arquitectura de Compilación (Senior Architecture)
Electron utiliza binarios nativos de Node.js (vía `node-gyp`) asociados directamente a la arquitectura del Sistema Operativo destino. 
*   **Regla de Oro:** **No se recomienda la compilación cruzada inversa (Cross-Compilation).** Es decir, compilar para macOS desde Windows es inviable por los protocolos de firma de Apple (Code Signing & Notarization).
*   **La Estrategia:** Usaremos Windows para sí mismo, un contenedor Docker para generar instaladores Linux de forma estéril, y CI/CD o una máquina virtual para macOS.

---

## 🪟 2. Compilación para Windows (.exe)
Al estar en un entorno Windows, este es el flujo más nativo y directo. Solo asegúrate de tener instaladas las *Visual Studio Build Tools con C++* (como vimos en `GUIA_COMPILACION_WINDOWS.md`).

**Instrucciones:**
Abre tu terminal (Developer Command Prompt for VS) y ejecuta:
```bash
# Limpia (opcional pero recomendado) y empaqueta el CSS
npm run build:css

# Imprime el ejecutable
npm run make
```
**Resultado:** En la carpeta `out/make/squirrel.windows/x64/` encontrarás tu archivo `chat-app Setup X.Y.Z.exe`.

---

## 🐧 3. Compilación para Linux (.deb / .rpm) vía Docker
En lugar de "ensuciar" el sistema Windows instalando WSL o utilidades de Linux, la arquitectura más limpia es usar un contenedor Docker efímero. 

Para esto, se creó el archivo `Dockerfile.builder` (y su `docker-compose.builder.yml`) que simula un entorno puro de Ubuntu/Debian especializado en empaquetar software.

**Pasos:**
1. Asegúrate de tener **Docker Desktop** instalado y corriendo en tu Windows.
2. Abre la terminal en el proyecto y ejecuta este comando para levantar el contenedor y compilar de una vez:
   ```bash
   docker-compose -f docker-compose.builder.yml up --build
   ```
3. El contenedor creará las distribuciones y luego se apagará solo.
**Resultado:** Tus instaladores `.deb` y `.rpm` aparecerán mágicamente en tu carpeta local `out/make/deb/x64/` y `out/make/rpm/x64/` (Porque docker sincroniza el volumen).

---

## 🍎 4. Compilación para macOS (.zip / .dmg)
macOS es un "ecosistema cerrado". Apple exige herramientas propietarias (`hdiutil`, `codesign`, `altool`) que **únicamente** existen nativamente dentro del kernel de Darwin (macOS).

**Opciones Profesionales:**
1.  **Si tienes una Mac física:**
    *   Clonas este repositorio, instalas node y ejecutas `npm run make`.
2.  **Si no tienes una Mac física (CI/CD Automático):**
    *   Debes usar **GitHub Actions**. Al pushear el código, los servidores de GitHub (que tienen servidores Mac) compilarán el código por ti y te lo regresarán como un "*Release*". Esta es la solución estándar de la industria.

---

## 📝 Resumen Explícito (Modo Junior)
*   **Windows:** Usa tu propia computadora con las herramientas de VS instaladas. Ejecutas `npm run make` y listo.
*   **Linux:** Imagina que Docker es una "máquina virtual de usar y tirar". La prendemos, le pasamos los archivos, ella crea los instaladores tipo `.deb` o `.rpm`, y cuando termina, se destruye dejándote los regalos.
*   **macOS:** Tienes que usar una Mac de verdad física o pedirle prestada una computadora a GitHub (vía GitHub Actions) para que lo empaquete por ti. No puedes obligar a una PC Windows a crear un instalador de Mac porque a Apple no le gusta eso y bloquea el proceso.
