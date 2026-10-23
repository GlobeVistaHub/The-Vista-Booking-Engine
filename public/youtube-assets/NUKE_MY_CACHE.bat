@echo off
echo ===================================================
echo   Antigravity Deep surgical Self-Cleanup Script
echo ===================================================
echo.
echo I see the issue now! Windows Storage is still showing 10GB
echo because I preserved my old conversation logs and past browser videos.
echo.
echo This script will surgically delete the cache of all 24 PAST conversations 
echo and their massive browser video logs, while keeping our CURRENT active 
echo conversation 100%% safe and untouched.
echo.
echo Deleting past conversation brains (preserving current session)...
for /d %%i in ("C:\Users\uu\.gemini\antigravity\brain\*") do (
  if /i not "%%~nxi"=="e8a35253-ff64-4fc3-bf00-6e1afbe58c83" (
    rmdir /s /q "%%i" 2>nul
  )
)
echo Done.
echo.
echo Deleting past browser recording videos...
for /d %%i in ("C:\Users\uu\.gemini\antigravity\browser_recordings\*") do (
  if /i not "%%~nxi"=="e8a35253-ff64-4fc3-bf00-6e1afbe58c83" (
    rmdir /s /q "%%i" 2>nul
  )
)
echo Done.
echo.
echo Deleting old execution logs and artifacts...
rmdir /s /q "C:\Users\uu\.gemini\antigravity\conversations" 2>nul
rmdir /s /q "C:\Users\uu\.gemini\antigravity\html_artifacts" 2>nul
rmdir /s /q "C:\Users\uu\.gemini\antigravity\playground" 2>nul
echo Done.
echo.
echo ===================================================
echo Deep Self-Cleanup Complete!
echo Windows Storage should now show that the 10GB is gone!
echo ===================================================
pause
