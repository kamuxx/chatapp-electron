# 🛠️ Guía de Compilación: Electron en Windows

Esta guía cubre el proceso completo para compilar e instalar **ChatApp** en Windows usando **Electron Builder** con instalador NSIS.

---

## 🚨 Paso 1: Herramientas de Compilación Nativa (Requeridas)

El 99% de los errores se deben a que faltan las herramientas de C++. Windows **no** las incluye por defecto.

### Visual Studio Build Tools
1. Descarga e instala **Visual Studio Build Tools** desde [visualstudio.microsoft.com](https://visualstudio.microsoft.com/downloads/).
2. En la pestaña *Cargas de trabajo*, marca:
   - ✅ **Desarrollo para el escritorio con C++**
3. Haz clic en **Instalar** (descargará varios GB — ten paciencia).
4. **Reinicia el PC** para que Windows registre las variables de entorno.

---

## ⚡ Paso 2: Instalación de Dependencias

```bash
# Instalar con Bun (recomendado — es el gestor del proyecto)
bun install

# O con npm si no tienes bun
npm install
```

---

## 🚀 Paso 3: Comandos de Compilación

### Probar localmente (sin publicar)
Genera la app desempaquetada en `release/win-unpacked/` para pruebas sin necesidad de instalar:
```bash
bun run build
```

### Publicar a GitHub Releases (auto-updater)
Compila el instalador NSIS y lo sube directamente al repositorio de GitHub:
```bash
bun run release
```
> ⚠️ Requiere tener configurado `GH_TOKEN` en las variables de entorno con permisos de escritura al repo.

**Resultado:** En `release/` encontrarás:
- `chatapp-electron-Setup-X.Y.Z.exe` — Instalador NSIS para el usuario final.
- `latest.yml` — Metadata que usa el auto-updater para detectar nuevas versiones.

---

## 🔢 Paso 4: Manejar el Error `gyp ERR! find VS`

Si tienes múltiples versiones de Visual Studio instaladas, `node-gyp` puede confundirse. Fuerza la versión antes de compilar:

```powershell
# En PowerShell — solo para la sesión actual
$env:GYP_MSVS_VERSION="2022"
bun run build
```

---

## 🐛 Errores Comunes

| Error | Causa | Solución |
|---|---|---|
| `gyp ERR! find VS` | `node-gyp` no detecta Visual Studio | Ejecutar `$env:GYP_MSVS_VERSION="2022"` antes del build |
| `EBUSY: resource busy` | Archivo bloqueado por otro proceso | Cerrar todas las instancias de la app y el VS Code |
| `Could not find any VS installation` | VS Build Tools no instalado | Instalar la carga de trabajo *Desktop development with C++* |
