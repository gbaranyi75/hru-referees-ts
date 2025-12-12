# ESLint Config Cleanup Scripts

This directory contains multiple scripts to delete the `eslint.config.mjs` file, which may conflict with the project's `.eslintrc.json` configuration.

## Recommended Usage (Cross-Platform)

```bash
npm run cleanup:eslint
```

This command works on all platforms (Windows, macOS, Linux) as it uses the Node.js script.

## Available Scripts

### 1. cleanup-eslint.js (Node.js - Cross-Platform) ✅ Recommended
**Works on:** Windows, macOS, Linux

```bash
node cleanup-eslint.js
```

or via npm:

```bash
npm run cleanup:eslint
```

**Features:**
- Pure JavaScript, no platform-specific commands
- Works everywhere Node.js is installed
- Provides clear success/error messages
- Safe - checks if file exists before deletion

### 2. cleanup-eslint.bat (Windows Batch)
**Works on:** Windows only

```bash
cleanup-eslint.bat
```

or via Command Prompt/PowerShell:

```bash
.\cleanup-eslint.bat
```

**Note:** This script uses Windows-specific `del` command and will not work on Unix-based systems.

### 3. cleanup-eslint.sh (Unix Shell)
**Works on:** macOS, Linux, Unix

First, make it executable:
```bash
chmod +x cleanup-eslint.sh
```

Then run:
```bash
./cleanup-eslint.sh
```

**Note:** This script uses Unix-specific `rm` command and will not work on Windows.

## Why Delete eslint.config.mjs?

The project uses ESLint 8.57.0 with the traditional `.eslintrc.json` configuration format. The `eslint.config.mjs` file uses the newer "flat config" format (ESLint 9+) and causes conflicts. Deleting it ensures the correct configuration is used.

## Troubleshooting

### "Command not found" on Unix systems
Make sure the shell script is executable:
```bash
chmod +x cleanup-eslint.sh
```

### Script doesn't work
Use the recommended cross-platform npm script:
```bash
npm run cleanup:eslint
```

### Manual deletion
You can always delete the file manually:
- Windows: Delete `eslint.config.mjs` from File Explorer
- macOS: Delete `eslint.config.mjs` from Finder or use `rm eslint.config.mjs` in Terminal
- Linux: Use `rm eslint.config.mjs` in Terminal

## See Also
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Complete deployment guide
- [package.json](./package.json) - NPM scripts configuration
