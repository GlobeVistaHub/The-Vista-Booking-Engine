@echo off
cd ..\vista-manifesto
npx remotion bundle src/index.tsx > build_error.txt 2>&1
echo Done.
