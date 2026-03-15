# sedekahje-cli

Browse Malaysian donation QR codes from your terminal. A CLI & TUI companion for [sedekah.je](https://sedekah.je).

## Interactive TUI

Launch the full terminal UI with `sedekah browse`:

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
sedekah search masjid
sedekah search masjid --state Selangor --category masjid --limit 10
sedekah search masjid --json | jq .

# Random institution
sedekah random
sedekah random --json

# Display QR code in terminal
sedekah qr "masjid negara"

# Launch TUI
sedekah browse
sedekah browse --state Selangor
```

## Install

Requires [Bun](https://bun.sh).

```bash
git clone https://github.com/khrnchn/sedekahje-cli.git
cd sedekahje-cli
bun install
```

### Run

```bash
bun run dev browse          # TUI
bun run dev search masjid   # CLI
bun run dev qr "masjid negara"
```

### Build standalone binary

```bash
bun run build
./sedekah browse
```

## Tech Stack

- [Bun](https://bun.sh) — runtime & bundler
- [@opentui/react](https://opentui.com) — terminal UI framework
- [Commander.js](https://github.com/tj/commander.js) — CLI argument parsing
- [chalk](https://github.com/chalk/chalk) — terminal colors
- [qrcode-terminal](https://github.com/gtanner/qrcode-terminal) — QR rendering

## Support

[buymeacoffee.com/khairin](https://buymeacoffee.com/khairin)
