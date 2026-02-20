# 💬 ChatApp / Electron.js Masterclass

![Electron](https://img.shields.io/badge/Electron-40.0.0-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22_LTS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

> Una aplicación de mensajería de escritorio diseñada no solo para funcionar, sino para enseñar **arquitectura sólida** y **compilación nativa multiplataforma**.

---

## 🧠 ¿De qué trata este proyecto? (Senior / Junior)

**👨‍💻 Visión Senior:**
Este repositorio es una prueba de concepto (PoC) sobre cómo integrar Electron.js con Node 22 LTS, utilizando IPC (Inter-Process Communication) seguro y aislando el Frontend del Backend nativo. Además, resuelve los cuellos de botella clásicos de compilación (`node-gyp`) y despliegue usando contenedores Docker (Linux) e integraciones de Visual Studio (Windows).

**👶 Explicación Junior (Aprender con manzanas):**
¿Alguna vez te preguntaste cómo se hacen aplicaciones instalables como *WhatsApp Desktop* o *Discord*? Se hacen con **Electron** (que es básicamente un navegador Chrome invisible mezclado con los superpoderes de tu computadora a través de Node.js). En este proyecto aprendemos a construir el chat, pero lo más divertido: **aprendemos a convertir nuestro código en verdaderos instaladores `.exe`, `.deb` y `.rpm`** para que cualquiera los pueda descargar e instalar.

---

## 🏗️ La Arquitectura: Frontend vs Backend en Escritorio

En código web normal, tienes un Frontend (Navegador) y un Backend (Servidor). ¡En Electron es exactamente igual, solo que todo ocurre mágicamente dentro de una sola aplicación!

1. ⚙️ **Main Process (Backend):** Es el archivo principal (`app.js`). Funciona como el "dueño de la casa". Tiene acceso directo a los archivos de tu computadora, hardware y notificaciones.
2. 🎨 **Renderer Process (Frontend):** Son tus archivos HTML, CSS (Tailwind) y JS visual. Todo lo que el usuario ve y hace clic (Botones, listas de chat).
3. 🌉 **El Puente (IPC):** El Frontend *nunca* debe tocar la computadora directamente por seguridad (Imagina que alguien inyecta código malicioso en tu chat). Para pedir algo, el Frontend usa un puente seguro llamado **IPC** *(Inter-Process Communication)* para hablar con el Backend.

---

## 🚀 1. Levantar el Entorno de Desarrollo (Modo Local)

Para modificar el código, editar colores y ver la App corriendo frente a ti, necesitas tener **Node.js (Versión `22 LTS`)**. *(Es obligatorio usar versiones LTS "Pares" para evitar que las herramientas se rompan).*

```bash
# 1. Clona el proyecto y entra a la carpeta
git clone https://github.com/kamuxx/chatapp-electron.git
cd electronjs

# 2. Descarga todas las dependencias
npm install

# 3. Arranca la aplicación mágica
npm run dev
```
👉 *El comando `dev` compila automáticamente todo tu CSS usando Tailwind, y luego levanta la ventana de la App lista para probar.*

---

## 📦 2. Empaquetado a Nivel Producción (El "Jefe Final")

Tener la App corriendo es fácil; el verdadero desafío de un programador Senior es crear **el archivo instalable que envías a los clientes**. Electron usa herramientas escritas en C++ (`node-gyp`), por ende tu Sistema Operativo debe aprender a leerlas.

### 🛠️ Las Herramientas del "Taller" (Lo que instalamos hoy)
Para que todo el proceso de compilación nativa funcione sin explotar, configuramos tu entorno de esta manera exacta:

| Herramienta / Configuración | ¿Para qué sirve? | ¿Cómo se instaló o configuró? |
| :--- | :--- | :--- |
| **Visual Studio Build Tools (C++)** | El compilador nativo de Windows. Lee las instrucciones de C++ para crear tu `.exe`. | Instalador gráfico oficial de Microsoft (Carga de trabajo: *Desarrollo de escritorio C++*). |
| **Variables Ocultas de Windows** | Para evitar el clásico error `"gyp ERR! find VS"`. Es un mapa que le dice al código dónde está Visual Studio 2026. | En consola: `$env:GYP_MSVS_VERSION="2024"` |
| **Requisitos de `package.json`** | El empaquetador `Squirrel` de Windows rechaza tu App si no sabe quién la hizo y qué hace. | Llenamos manualmente los campos `"author"` y `"description"` antes de compilar. |
| **electron-rebuild** | Reconstruye los binarios internos de C++ para que embonen exactamente con tu Node. | `npm install electron-rebuild -D` |
| **Docker Desktop** | Funciona como un "invernadero Linux" para compilar extensiones `.deb/.rpm` sin romper Windows. | Instalado por separado para la compilación inter-OS. |

---

### 🪟 Windows (`.exe` Instalador Squirrel)
Como estás programando desde Windows, compilar para Windows es directo, pero necesitas que Windows sepa compilar C++.
1. Debes tener **Visual Studio Build Tools** instalado (con la carga de trabajo *"Desarrollo para el escritorio con C++"* marcada).
2. Asegúrate de que tu `package.json` **siempre** tenga un `"author": "Tu Nombre"` y una `"description"` de tu app. (Si no lo pones, el creador de `.exe` en Windows lo rechazará diciendo `Authors is required`).

**El Truco Ninja (Si falla la compilación):**
Si tienes un Visual Studio del futuro (v18/2024/2026), el compilador viejo se confundirá. Tienes que decirle a tu consola explícitamente qué año buscar (Copiando esto en tu PowerShell) y luego procesarlo:
```powershell
$env:GYP_MSVS_VERSION="2024"
npm run build:css
npm run make
```
🎉 *Si todo está verde, entra a la carpeta `out/` de tu proyecto y serás dueño de un brillante `chat-app.exe` listo para repartir.*

### 🐧 Linux (`.deb` / `.rpm`)
*¿Cómo rayos compilo para Linux sin instalar Linux en mi PC?*
¡Usamos Docker! Docker es como un invernadero esterilizado. Le tomamos una foto a nuestro código y se la damos al invernadero. Él usa **Ubuntu/Debian** de fondo, crea nuestro instalador Linux nativamente, nos lo escupe a Windows y se destruye sin dejar rastros sucios.

Solo abre tu terminal con Docker Desktop prendido y lanza:
```bash
docker-compose -f docker-compose.builder.yml up --build
```
🎉 *Los paquetes Linux aparecerán mágicamente en `/out/make/deb/x64/`.*

### 🍎 macOS (`.dmg` / `.zip` de Darwin)
Apple vive en un castillo cerrado protector. El fondo de su sistema se rehúsa a dejar que compilen herramientas si no estás usando una Mac física oficial de la marca. No lo puedes forzar desde Windows.

* **La Solución Profesional:** No lo intentes forzar en tu PC. Sube tu código de Windows a GitHub y usa **GitHub Actions** (CI/CD Automático). Es decir, usa una computadora Mac gratuita rentada a GitHub para que ella lea tu código y te genere el `.dmg` en la nube. ¡Bienvenido al estándar de la industria!

---

## 📁 Radiografía del Proyecto (Para no perderte)

```text
electronjs/
├── src/
│   ├── app.js                    # ⚙️ El "Cerebro" de la App (Backend / Main Process)
│   ├── renderer/                 # 🎨 La Lógica de Interfaz y Botones (Frontend)
│   ├── pages/                    # 📄 Las Vistas HTML (Chat, Login)
│   └── assets/                   # 🖌️ Tus estilos fuente y el Tailwind compilado
├── forge.config.js               # 🔨 Las reglas para construir los instaladores nativos
├── Dockerfile.builder            # 🐳 El "laboratorio Linux" para empaquetar
├── package.json                  # 📋 Identificador: Scripts, Autor, Nombre y Overrides
└── index.js                      # 🚪 La puerta de entrada principal
```

---

## 🎯 Mejoras Técnicas, Refactor y Próximos Pasos

El buen código siempre evoluciona. Si quieres ver el registro histórico de esta aplicación y cómo se planean sus mejoras a nivel código (Arquitectura, Seguridad, Rendimiento, UI), tenemos nuestras dos "Fuentes de Verdad":
- 📜 Historial de Cambios (Lo que ya hicimos): [`CHANGELOG.md`](./CHANGELOG.md)
- 🔮 Futuro de la App (El Plan Maestro): [`mejoras.md`](./mejoras.md)

---

> 💡 **Nota del Arquitecto:** Ser experto en Electron no significa solo hacer interfaces brillantes en CSS. Significa diseñar herramientas totalmente robustas, garantizar seguridad IPC e interactuar de maravilla con los núcleos duros y fríos (Kernels) de los Sistemas Operativos sin que tu software explote.
