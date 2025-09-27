@echo off
echo 🚀 SNAFLEShub Git Setup
echo ======================
echo.

echo Checking Git installation...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not found in PATH
    echo.
    echo Please try one of these solutions:
    echo 1. Restart your terminal/command prompt
    echo 2. Restart your computer
    echo 3. Reinstall Git and make sure to check "Add Git to PATH" during installation
    echo.
    echo If Git is installed, try running these commands manually:
    echo   git init
    echo   git add .
    echo   git commit -m "Initial commit: SNAFLEShub e-commerce platform"
    echo.
    pause
    exit /b 1
)

echo ✅ Git is installed and working
echo.

echo Initializing Git repository...
git init
if %errorlevel% neq 0 (
    echo ❌ Failed to initialize Git repository
    pause
    exit /b 1
)

echo ✅ Git repository initialized

echo.
echo Adding files to Git...
git add .
if %errorlevel% neq 0 (
    echo ❌ Failed to add files to Git
    pause
    exit /b 1
)

echo ✅ Files added to Git

echo.
echo Creating initial commit...
git commit -m "Initial commit: SNAFLEShub e-commerce platform"
if %errorlevel% neq 0 (
    echo ❌ Failed to create initial commit
    pause
    exit /b 1
)

echo ✅ Initial commit created

echo.
echo 🎉 Git repository setup completed successfully!
echo.
echo Your repository is now ready with:
echo - Proper .gitignore file (excludes sensitive files)
echo - Initial commit with all project files
echo - Ready for remote repository setup
echo.
echo Next steps:
echo 1. Create a repository on GitHub/GitLab/Bitbucket
echo 2. Add remote: git remote add origin <repository-url>
echo 3. Push: git push -u origin main
echo.
pause






