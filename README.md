# sedekahje-cli

CLI & TUI for [sedekah.je](https://sedekah.je) — browse Malaysian donation QR codes from your terminal.

## Install

```bash
bun install
```

## Usage

### CLI Commands

```bash
# Search institutions
bun run dev search masjid
bun run dev search masjid --state Selangor --category masjid
bun run dev search masjid --json | jq .

# Random institution
bun run dev random
bun run dev random --json

# Display QR code in terminal
bun run dev qr "masjid negara"

# Interactive TUI browser
bun run dev browse
bun run dev browse --state Selangor
```

### TUI Keybindings

| Key | Action |
|-----|--------|
| `j`/`k` | Navigate list |
| `Tab` | Switch between list/detail panes |
| `/` | Search |
| `f` | Filter by category |
| `r` | Load random institution |
| `n`/`p` | Next/previous page |
| `o` | Open in browser |
| `q` | Quit |

## Build

Compile to a standalone binary:

```bash
bun run build
./sedekah search masjid
```
