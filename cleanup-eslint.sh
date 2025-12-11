#!/bin/bash

# Cross-platform shell script for Unix/Linux/macOS

echo "Deleting eslint.config.mjs..."

if [ -f "eslint.config.mjs" ]; then
  rm -f eslint.config.mjs
  echo "✓ Done!"
else
  echo "ℹ File eslint.config.mjs does not exist (already deleted)"
fi
