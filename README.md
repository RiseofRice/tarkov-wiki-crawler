# Tarkov CLI & Web Search Tool

A TypeScript-based CLI and web application for quickly searching Escape from Tarkov items, quests, ammunition, keys, and bosses. Opens both tarkov.dev and the official Fandom wiki pages automatically.

## Features

- 🔍 **Auto-detection**: Automatically detects whether you're searching for an item, quest, ammo, key, or boss
- 🌐 **Dual Browser Launch**: Opens both tarkov.dev and Fandom wiki simultaneously
- 💾 **Smart Caching**: Caches search results in JSON for faster repeated searches
- 🖥️ **CLI & Web Interface**: Use from command line or through a web UI
- ⚡ **Fast & Lightweight**: Built with TypeScript and modern Node.js

## Installation

```bash
npm install
npm run build
```

## Usage

### CLI Mode

**Basic search (auto-detect type):**
```bash
tarkov "RIP"
tarkov "Debut"
tarkov "5.45x39 BP"
```

**Specific type search:**
```bash
tarkov quest "Debut"
tarkov ammo "M995"
tarkov key "Dorm room 314"
tarkov boss "Reshala"
```

### Web Mode

**Start the web server:**
```bash
tarkov --web
# or
npm run server
```

Then open your browser to `http://localhost:3000` and use the search interface.

## How It Works

1. **Auto-Detection**: The tool analyzes your search query to determine if you're looking for:
   - **Boss**: Known boss names (Reshala, Killa, Shturman, etc.)
   - **Quest**: Quest-related keywords or common quest names
   - **Ammo**: Ammunition patterns (e.g., "5.45x39", "M995")
   - **Key**: Key-related keywords
   - **Item**: Default fallback for general items

2. **URL Generation**: Creates appropriate URLs for tarkov.dev and the Fandom wiki

3. **Caching**: Stores search results in `cache.json` for 7 days

4. **Browser Launch**: Opens both pages in your default browser

## Development

```bash
# Run in development mode
npm run dev

# Build TypeScript
npm run build

# Start built version
npm start
```

## Examples

```bash
# Search for an item
tarkov "Salewa"

# Search for a quest
tarkov quest "Debut"

# Search for ammunition
tarkov ammo "M855A1"

# Search for a key
tarkov key "Factory exit key"

# Search for a boss
tarkov boss "Killa"

# Start web server
tarkov --web
```

## Project Structure

```
tarkov-wiki-crawler/
├── src/
│   ├── cli.ts         # CLI entry point with Commander.js
│   ├── search.ts      # Core search logic and URL generation
│   ├── cache.ts       # JSON caching functionality
│   └── server.ts      # Express web server with HTML UI
├── dist/              # Compiled JavaScript (generated)
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
└── cache.json         # Search cache (generated)
```

## Technologies

- **TypeScript**: Type-safe JavaScript
- **Commander.js**: CLI framework
- **Express**: Web server
- **open**: Cross-platform browser launcher
- **Node.js**: Runtime environment

## License

MIT