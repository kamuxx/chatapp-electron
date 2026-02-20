# 🛠️ Guía Definitiva de Compilación: Electron en Windows

Esta guía ha sido actualizada para resolver los problemas de compilación más agresivos que ocurren con versiones modernas como **Visual Studio 2026 (v18)**, **Node 22 LTS**, y los requisitos estrictos de los instaladores de Windows (Squirrel).

---

## 🚨 Paso 1: Instalación de Herramientas (La Base)

El 99% de los errores se deben a que faltan las herramientas de compilación de C++. Windows NO las trae por defecto.

### 1. Visual Studio Build Tools
1. Descarga e inicia el instalador de **Visual Studio Build Tools**.
2. En la pestaña "Cargas de trabajo" (Workloads), **MARCA** la opción:
   * ✅ **Desarrollo para el escritorio con C++** (Desktop development with C++).
3. Haz clic en **Instalar**. (Esto descargará varios GB, ten paciencia).
4. **Reinicio OBLIGATORIO:** Reinicia tu PC para que Windows registre las variables de entorno.

---

## ⚡ Paso 2: Configuración Obligatoria del `package.json`

Antes de siquiera intentar compilar, tu archivo `package.json` **DEBE** cumplir estas reglas, o el empaquetador de Windows (`Squirrel.Windows`) fallará silenciosamente:

1. **Requisitos de Squirrel:** Squirrel exige saber quién hizo la app y para qué sirve. Si faltan estos campos, el comando `npm run make` fallará diciendo `Authors is required. Description is required.`
   Asegúrate de tener esto en tu `package.json`:
   ```json
   "author": "Tu Nombre o Empresa",
   "description": "Una descripción de lo que hace la aplicación",
   ```

2. **(Opcional pero recomendado) Actualizar node-gyp:** Si tienes "Visual Studio 2026" (v18), el `node-gyp` viejo se confundirá. Se recomienda forzar a usar uno moderno añadiendo esto a la raíz de tu `package.json`:
   ```json
   "overrides": {
     "node-gyp": "^12.2.0",
     "@electron/node-gyp": "^12.2.0"
   }
   ```

---

## 🧹 Paso 3: Limpieza Radical y Preparación

Abre tu terminal (PowerShell o Git Bash) en la carpeta de tu proyecto. Si has tenido errores antes, limpia los cachés viejos:

```powershell
# Borra las dependencias corruptas o viejas
rm -rf node_modules
rm -rf out
del package-lock.json

# Reinstala todo aplicando las reglas nuevas
npm install
```

---

## 🚀 Paso 4: Evitar el Error "gyp ERR! find VS" y Compilar

Si instalaste un Visual Studio muy moderno (Como el Preview 2026), `node-gyp` no sabrá leer la versión. **Debemos decirle manualmente la versión antes de compilar.**

En tu terminal (PowerShell dentro de VS Code), ejecuta estos comandos en orden:

```powershell
# 1. Le decimos al compilador qué versión de Visual Studio buscar (Evita el "undefined")
$env:GYP_MSVS_VERSION="2024"

# 2. (Opcional) Compila el CSS o Tailwind si tu app lo requiere
npm run build:css

# 3. Genera el ejecutable (.exe / instalador)
npm run make
```

**Si todo sale bien:**
Verás muchos logs verdes y la barra de progreso avanzará. Al final, en tu proyecto aparecerá una carpeta llamada `out`. Adentro encontrarás: `out/make/squirrel.windows/x64/` con tu precioso instalador **.exe**.

---

## 🐛 Solución Rápida a Errores Comunes

### Error: `Authors is required. Description is required.`
* **Causa:** El instalador no sabe qué nombre de creador poner en Windows.
* **Solución:** Ve a tu `package.json`, llena los campos `"author"` y `"description"` y vuelve a compilar (Visto en el Paso 2).

### Error: `Could not find any Visual Studio installation` o `"undefined" found at...`
* **Causa:** `node-gyp` está desactualizado o está confundido por una versión de Visual Studio del futuro.
* **Solución:** Asegúrate de ejecutar `$env:GYP_MSVS_VERSION="2024"` (o `"2022"`) en PowerShell justo antes de ejecutar `npm run make`.

### Error: `EBUSY: resource busy or locked`
* **Causa:** Un archivo está siendo usado por otro programa (Visual Studio, VS Code, tu propia App corriendo).
* **Solución:** Cierra TODAS las instancias de tu App. Cierra ventanas adicionales y vuelve a intentar.
