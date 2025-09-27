# Git Repository Setup - SNAFLEShub

## Repository Status
Your Git repository is initialized and configured with sensible security defaults.

## Security Features Implemented

### .gitignore Highlights
Confidential files excluded from version control:

#### Environment & Secrets
- `.env` files (all variants)
- `config/secrets.js`, `config/keys.js`
- `secrets/`, `keys/`

#### Keys & Certificates
- `*.pem`, `*.key`, `*.crt`, `*.csr`
- `ssl/`, `certificates/`

#### Database & Dumps
- `*.db`, `*.sqlite`, `*.sql`, `*.dump`

#### Service Keys
- `stripe-keys.js`, `payment-config.js`
- `mongo-config.js`, `database-config.js`
- `jwt-secret.js`, `auth-config.js`
- `aws-keys.js`, `google-keys.js`, `facebook-keys.js`

#### Production Files
- `deploy-config.js`, `production.env`

## Current Repository Commands
```bash
git status           # status
git log --oneline    # history
git branch -a        # branches
```

## Next Steps

### 1) Connect Remote (optional)
```bash
git remote add origin https://github.com/yourusername/snafleshub.git
git push -u origin main
```

### 2) Development Branch
```bash
git checkout -b development
git push -u origin development
```

### 3) Branch Protection (GitHub/GitLab)
- Protect `main` from direct pushes
- Require PR reviews and passing checks

## Git Configuration

### User Info
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Useful Aliases
```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'
```

## Commit Guidelines

### Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- feat, fix, docs, style, refactor, test, chore

### Examples
```bash
git commit -m "feat(auth): add JWT token refresh"
git commit -m "fix(payment): resolve Stripe webhook validation"
git commit -m "docs(readme): update installation"
```

## Workflow

### Feature Development
```bash
git checkout -b feature/new-feature
git add .
git commit -m "feat: implement new feature"
git push origin feature/new-feature
# open a pull request to main
```

### Hotfixes
```bash
git checkout main && git pull origin main
git checkout -b hotfix/critical-bug-fix
git add . && git commit -m "fix: resolve critical security issue"
git push origin hotfix/critical-bug-fix
```

## Security Best Practices

### Before Committing
1) Never commit sensitive data (API keys, passwords, DB creds, private keys)
2) Use env vars; commit `.env.example` templates only
3) Review changes with `git diff` and `git status`

### Regular Checks (examples)
```bash
git log --all --full-history -- "*.env" "*.key" "*.pem"
```

## Repository Snapshot (example)
- Languages: JavaScript, JSX, CSS, JSON, Markdown
- Frameworks: React, Express.js
- Database: MongoDB

## Troubleshooting

### Accidentally Committed Secrets
```bash
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch path/to/secret.file' \
  --prune-empty --tag-name-filter cat -- --all
git push origin --force --all
```

### Large Files
```bash
git lfs install
git lfs track "*.psd" "*.zip" "*.pdf"
git add .gitattributes
git commit -m "Add LFS tracking for large files"
```

## Resources
- Git docs: https://git-scm.com/doc
- GitHub Flow: https://guides.github.com/introduction/flow/
- Conventional Commits: https://www.conventionalcommits.org/
- Git LFS: https://git-lfs.github.com/

