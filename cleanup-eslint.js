#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'eslint.config.mjs');

try {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log('✓ Deleted eslint.config.mjs');
  } else {
    console.log('ℹ File eslint.config.mjs does not exist (already deleted)');
  }
  process.exit(0);
} catch (error) {
  console.error('✗ Error deleting eslint.config.mjs:', error.message);
  process.exit(1);
}
