@echo off
echo ===================================================
echo   Antigravity Emergency Cleanup Script
echo ===================================================
echo.
echo Deleting Next.js Cache...
rmdir /s /q ..\..\.next\cache 2>nul
echo Done.
echo.
echo Deleting node_modules Cache...
rmdir /s /q ..\..\node_modules\.cache 2>nul
echo Done.
echo.
echo Deleting Windows Temp Files (This is where the 30GB is hiding!)...
del /q /f /s %TEMP%\* 2>nul
for /d %%x in (%TEMP%\*) do @rd /s /q "%%x" 2>nul
echo Done.
echo.
echo ===================================================
echo Cleanup Complete! Check your Hard Drive Space Now!
echo You can close this window.
echo ===================================================
pause
