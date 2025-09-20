# Git Setup Guide for SNAFLEShub

## 🚀 Quick Setup

### Option 1: Run the Setup Script
```bash
git-setup.bat
```

### Option 2: Manual Setup

If the script doesn't work, follow these steps manually:

#### 1. Initialize Git Repository
```bash
git init
```

#### 2. Add All Files
```bash
git add .
```

#### 3. Create Initial Commit
```bash
git commit -m "Initial commit: SNAFLEShub e-commerce platform"
```

#### 4. Check Status
```bash
git status
```

## 🔧 Troubleshooting

### Git Not Found Error
If you get "git is not recognized", try these solutions:

1. **Restart Terminal**: Close and reopen your terminal/command prompt
2. **Restart Computer**: Sometimes PATH updates require a restart
3. **Reinstall Git**: Download from [git-scm.com](https://git-scm.com/download/win) and make sure to check "Add Git to PATH"

### Alternative Git Locations
Try these commands if Git is installed but not in PATH:

```bash
# Common Git installation paths
"C:\Program Files\Git\bin\git.exe" --version
"C:\Program Files (x86)\Git\bin\git.exe" --version
"C:\Users\%USERNAME%\AppData\Local\Programs\Git\bin\git.exe" --version
```

## 📁 What's Included

Your `.gitignore` file excludes:
- ✅ Environment variables (`.env`, `.env.local`)
- ✅ Node modules (`node_modules/`)
- ✅ Build outputs (`dist/`, `build/`)
- ✅ Log files (`*.log`)
- ✅ IDE files (`.vscode/`, `.idea/`)
- ✅ System files (`.DS_Store`, `Thumbs.db`)
- ✅ SSL certificates (`*.pem`, `*.key`)
- ✅ Upload directories (`uploads/`)

## 🔒 Security Features

- **No sensitive data**: All API keys, passwords, and secrets are excluded
- **No personal files**: System and IDE files are ignored
- **Clean repository**: Only source code and configuration files are tracked

## 🚀 Next Steps

### 1. Create Remote Repository
- Go to [GitHub](https://github.com), [GitLab](https://gitlab.com), or [Bitbucket](https://bitbucket.org)
- Create a new repository
- Copy the repository URL

### 2. Add Remote Origin
```bash
git remote add origin <your-repository-url>
```

### 3. Push to Remote
```bash
git push -u origin main
```

### 4. Verify Setup
```bash
git remote -v
git log --oneline
```

## 📋 Useful Git Commands

### Daily Workflow
```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to remote
git push

# Pull latest changes
git pull
```

### Branch Management
```bash
# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main
git checkout feature-name

# Merge branch
git checkout main
git merge feature-name
```

### Viewing History
```bash
# View commit history
git log --oneline

# View file changes
git diff

# View specific commit
git show <commit-hash>
```

## 🆘 Getting Help

If you encounter issues:

1. **Check Git Installation**: `git --version`
2. **Check Repository Status**: `git status`
3. **View Git Configuration**: `git config --list`
4. **Reset if Needed**: `git reset --hard HEAD`

## 📞 Support

For additional help:
- Git Documentation: [git-scm.com/doc](https://git-scm.com/doc)
- GitHub Help: [help.github.com](https://help.github.com)
- Create an issue in this repository

---

**Happy Coding! 🚀**

