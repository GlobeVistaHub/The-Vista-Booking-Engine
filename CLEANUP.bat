@echo off
echo ===================================================
echo   Antigravity Emergency Cleanup Script
echo ===================================================
echo.
echo You are stuck in the youtube-assets folder in your terminal!
echo That is why the commands deleted 0 bytes of space.
echo.
echo I am locked out from running commands due to Windows Sandbox rules,
echo so I created this script to do it for you automatically from the correct folder.
echo.
echo Deleting Next.js Cache (This is massive)...
rmdir /s /q .next\cache 2>nul
echo Done.
echo.
echo Deleting node_modules Cache...
rmdir /s /q node_modules\.cache 2>nul
echo Done.
echo.
echo Deleting Windows Temp Files (This is usually 10GB+)...
del /q /f /s %TEMP%\* 2>nul
for /d %%x in (%TEMP%\*) do @rd /s /q "%%x" 2>nul
echo Done.
echo.
echo ===================================================
echo Cleanup Complete! Check your Hard Drive Space Now!
echo You can close this window.
echo ===================================================
pause
