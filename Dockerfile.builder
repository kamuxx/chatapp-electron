# 🐳 Imagen Base Oficial de Node (LTS) en Debian/Ubuntu
FROM node:20-bullseye

# 📌 Instalación de Dependencias Core de Compilación Linux
# dpkg-dev, rpm, fakeroot y build-essential son requeridos por Electron Forge
# para compilar instaladores nativos de Linux (.deb y .rpm)
RUN apt-get update && apt-get install -y \
    dpkg-dev \
    rpm \
    fakeroot \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# ⚙️ Configuración del Entorno de Trabajo
WORKDIR /usr/src/app

# Copiar configuración primero (Optimización de Caché de Docker)
COPY package*.json ./

# Instalar dependencias puras (Evita instalar basura en binarios de SO específicos)
RUN npm install

# 🚀 Copia el resto del código
COPY . .

# 🔐 Compilar e Iniciar la Fuerza de Empaquetado
# Ejecutará directamente platform linux y generará solo deb y rpm
CMD npm run build:css && npx electron-forge make --platform=linux --arch=x64
