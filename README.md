# sedekahje-cli

Browse Malaysian donation QR codes from your terminal. A CLI & TUI companion for [sedekah.je](https://sedekah.je).

## Interactive TUI

Launch the full terminal UI with `sedekahje` or `sedekahje browse`:

```
┌─ Institutions ──────────────┬─ Detail ─────────────────────┐
│ > Masjid Negara          KL │ Masjid Negara                │
│   Masjid Sultan Salahuddin  │ Category: masjid              │
│   Masjid Wilayah Persekut.. │ State:    W.P. Kuala Lumpur   │
│   Masjid As-Syakirin        │ City:     Kuala Lumpur        │
│   Masjid Jamek              │ Payment:  DuitNow             │
│                              │                               │
│                              │  ── DuitNow ──────────        │
│                              │  ▄▄▄ ▄▄▄ █ ▄▄▄ ▄▄▄           │
│                              │  █ ▄ █ █ █ █ ▄ █             │
│                              │  ▀▀▀ ▀▀▀ █ ▀▀▀ ▀▀▀           │
│                              │  Scan with DuitNow            │
├──────────────────────────────┴──────────────────────────────┤
│ j/k:navigate  Tab:detail  /:search  f:filter  q:quit       │
│ buymeacoffee.com/khairin                                    │
└─────────────────────────────────────────────────────────────┘
```

Two-pane layout with real-time search, category filters, keyboard navigation, and inline QR code rendering — all powered by [@opentui/react](https://opentui.com).

### Keybindings

| Key | Action |
|-----|--------|
| `j`/`k` | Navigate list |
| `Tab` | Switch between list/detail panes |
| `/` | Search |
| `f` | Filter by category (masjid, surau, tahfiz, kebajikan, lain-lain) |
| `r` | Load random institution |
| `n`/`p` | Next/previous page |
| `o` | Open in browser |
| `q` / `Ctrl+C` | Quit |

## CLI Commands

```bash
# Search institutions
sedekahje search masjid
sedekahje search masjid --state Selangor --category masjid --limit 10
sedekahje search masjid --json | jq .

# Random institution
sedekahje random
sedekahje random --json

# Display QR code in terminal
sedekahje qr "masjid negara"

# Launch TUI (either works)
sedekahje
sedekahje browse
sedekahje browse --state Selangor
```

## Install

### Quick install (recommended)

Downloads a pre-built binary from [GitHub Releases](https://github.com/khrnchn/sedekahje-cli/releases). No Bun required.

```bash
curl -fsSL https://raw.githubusercontent.com/khrnchn/sedekahje-cli/main/install.sh | sh
```

Installs to `~/.local/bin` by default. Set `SEDEKAHJE_INSTALL_DIR` to customize:

```bash
curl -fsSL https://raw.githubusercontent.com/khrnchn/sedekahje-cli/main/install.sh | SEDEKAHJE_INSTALL_DIR=/usr/local/bin sh
```

Install a specific version:

```bash
curl -fsSL https://raw.githubusercontent.com/khrnchn/sedekahje-cli/main/install.sh | SEDEKAHJE_VERSION=v0.1.0 sh
```

**Supported:** Linux (x64), macOS (Apple Silicon), Windows (x64)

### From source (requires [Bun](https://bun.sh))

```bash
git clone https://github.com/khrnchn/sedekahje-cli.git
cd sedekahje-cli
bun install
```

### Run

```bash
bun run dev                 # TUI (default)
bun run dev browse          # TUI
bun run dev search masjid   # CLI
bun run dev qr "masjid negara"
```

### Build standalone binary

```bash
bun run build
./sedekahje browse
```

### Publishing a release

Releases are **automated on every push** to `main` or `master`. [GitHub Actions](.github/workflows/release.yml) builds binaries and publishes to [Releases](https://github.com/khrnchn/sedekahje-cli/releases). Each release is tagged as `v{version}+{sha}` (e.g. `v0.1.0+abc1234`).

## Tech Stack

- [Bun](https://bun.sh) — runtime & bundler
- [@opentui/react](https://opentui.com) — terminal UI framework
- [Commander.js](https://github.com/tj/commander.js) — CLI argument parsing
- [chalk](https://github.com/chalk/chalk) — terminal colors
- [qrcode-terminal](https://github.com/gtanner/qrcode-terminal) — QR rendering

## Support

[buymeacoffee.com/khairin](https://buymeacoffee.com/khairin)
