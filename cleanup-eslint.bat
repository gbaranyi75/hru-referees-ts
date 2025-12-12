@echo off
REM Windows batch script to delete eslint.config.mjs
REM For cross-platform support, use: npm run cleanup:eslint

echo Deleting eslint.config.mjs...
del /F /Q "eslint.config.mjs" 2>nul
if %errorlevel% equ 0 (
  echo Done!
) else (
  echo File does not exist or already deleted.
)
pause
