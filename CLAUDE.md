# sedekahje-cli

CLI & TUI for sedekah.je — browse Malaysian donation QR codes from the terminal.

## Commands

```bash
bun run dev search <query>       # Search institutions
bun run dev random               # Random institution
bun run dev qr <name>            # Display QR code
bun run dev browse               # Launch interactive TUI
bun build src/index.tsx --compile --outfile sedekah  # Compile binary
```

## Tech Stack

- **Runtime**: Bun (always use `bun` instead of `npm`/`node`)
- **CLI**: Commander.js for arg parsing
- **TUI**: @opentui/react (Bun-native React TUI framework)
- **Output**: chalk for colors, qrcode-terminal for QR codes
- **Search**: fuse.js for client-side fuzzy filtering

## Architecture

```
src/
├── index.tsx           # Entry point (commander setup)
├── api.ts              # API client (fetch wrapper for sedekah.je)
├── types.ts            # Institution, Pagination types
├── commands/           # CLI commands (search, random, qr, browse)
├── ui/                 # TUI components (@opentui/react)
│   ├── App.tsx         # Root layout
│   ├── hooks/          # useInstitutions, useFilters
│   └── ...             # InstitutionList, InstitutionDetail, etc.
└── utils/              # format.ts (terminal tables), qr.ts (QR rendering)
```

## API Surface

Production API at `https://sedekah.je`:
- `GET /api/institutions` — paginated list with search, category, state, page, limit
- `GET /api/random` — single random institution

## Development

- `bun run dev` — run CLI
- `bun run type-check` — TypeScript checking
- JSX uses `jsxImportSource: "@opentui/react"` for TUI components
