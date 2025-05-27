#!/bin/bash

set -e

echo "📦 Creando carpeta de plugins de Docker..."
mkdir -p ~/.docker/cli-plugins

echo "⬇️ Descargando buildx más reciente..."

ARCH=$(uname -m)
case "$ARCH" in
    x86_64) ARCH="amd64" ;;
    aarch64) ARCH="arm64" ;;
    *) echo "❌ Arquitectura $ARCH no soportada."; exit 1 ;;
esac

VERSION=$(curl -s https://api.github.com/repos/docker/buildx/releases/latest | grep tag_name | cut -d '"' -f 4)

URL="https://github.com/docker/buildx/releases/download/${VERSION}/buildx-${VERSION}.linux-${ARCH}"
DEST="$HOME/.docker/cli-plugins/docker-buildx"

echo "🌐 URL: $URL"
curl -Lo "$DEST" "$URL"

echo "⚙️ Dando permisos de ejecución..."
chmod +x "$DEST"

echo "✅ Instalación completada."
echo "🔍 Verificando versión de buildx..."
docker buildx version
