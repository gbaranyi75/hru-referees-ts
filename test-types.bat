@echo off
echo Starting TypeScript type check...
echo.
call npx tsc --noEmit
echo.
echo Type check complete!
pause
