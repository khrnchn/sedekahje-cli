#!/usr/bin/env sh
set -e

REPO="khrnchn/sedekahje-cli"
INSTALL_DIR="${SEDEKAHJE_INSTALL_DIR:-$HOME/.local/bin}"
VERSION="${SEDEKAHJE_VERSION:-latest}"

echo "Installing sedekahje-cli..."
echo ""

# Detect OS and architecture
detect_platform() {
  OS=$(uname -s)
  ARCH=$(uname -m)

  case "$OS" in
    Linux*)  PLATFORM="linux" ;;
    Darwin*) PLATFORM="darwin" ;;
    MINGW*|MSYS*|CYGWIN*) PLATFORM="windows" ;;
    *) echo "Unsupported OS: $OS"; exit 1 ;;
  esac

  case "$ARCH" in
    x86_64|amd64)  ARCH="x64" ;;
    aarch64|arm64) ARCH="arm64" ;;
    *) echo "Unsupported architecture: $ARCH"; exit 1 ;;
  esac

  if [ "$PLATFORM" = "windows" ]; then
    ASSET="sedekah-${PLATFORM}-${ARCH}.exe"
  else
    ASSET="sedekah-${PLATFORM}-${ARCH}"
  fi
}

# Try to install from GitHub Release
install_from_release() {
  detect_platform

  if [ "$VERSION" = "latest" ]; then
    RELEASE_URL="https://api.github.com/repos/${REPO}/releases/latest"
  else
    RELEASE_URL="https://api.github.com/repos/${REPO}/releases/tags/${VERSION}"
  fi

  echo "Fetching release info..."
  RELEASE_JSON=$(curl -fsSL "$RELEASE_URL")
  TAG=$(echo "$RELEASE_JSON" | grep -o '"tag_name": *"[^"]*"' | head -1 | sed 's/.*: *"\(.*\)"/\1/')

  if [ -z "$TAG" ]; then
    echo "No release found. Falling back to build from source (requires Bun)."
    install_from_source
    return
  fi

  DOWNLOAD_URL=$(echo "$RELEASE_JSON" | grep -o "\"browser_download_url\": *\"[^\"]*${ASSET}\"" | head -1 | sed 's/.*: *"\(.*\)"/\1/')

  if [ -z "$DOWNLOAD_URL" ]; then
    echo "No pre-built binary for ${PLATFORM}-${ARCH}. Falling back to build from source (requires Bun)."
    install_from_source
    return
  fi

  echo "Downloading ${TAG}..."
  mkdir -p "$INSTALL_DIR"
  curl -fsSL -o "$INSTALL_DIR/sedekah" "$DOWNLOAD_URL"
  chmod +x "$INSTALL_DIR/sedekah"

  echo ""
  echo "Installed sedekah to $INSTALL_DIR"
  if ! echo ":$PATH:" | grep -q ":$INSTALL_DIR:"; then
    echo "Add to PATH: export PATH=\"\$PATH:$INSTALL_DIR\""
  fi
  echo ""
  echo "Run: sedekah browse"
}

# Fallback: build from source (requires Bun)
install_from_source() {
  TEMP_DIR=$(mktemp -d)

  if ! command -v bun >/dev/null 2>&1; then
    echo "Error: Bun is required to build. Install from https://bun.sh"
    echo "  curl -fsSL https://bun.sh/install | bash"
    exit 1
  fi

  echo "Cloning repository..."
  BRANCH="main"
  [ "$VERSION" != "latest" ] && BRANCH="${VERSION#v}"
  git clone --depth 1 --branch "$BRANCH" "https://github.com/${REPO}.git" "$TEMP_DIR" 2>/dev/null || \
  git clone --depth 1 "https://github.com/${REPO}.git" "$TEMP_DIR"
  cd "$TEMP_DIR"

  echo "Building binary..."
  bun install
  bun run build

  mkdir -p "$INSTALL_DIR"
  mv sedekah "$INSTALL_DIR/sedekah"
  chmod +x "$INSTALL_DIR/sedekah"
  rm -rf "$TEMP_DIR"

  echo ""
  echo "Installed to $INSTALL_DIR/sedekah"
  echo "Run: sedekah browse"
}

install_from_release
