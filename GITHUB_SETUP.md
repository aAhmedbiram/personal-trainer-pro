# GitHub Setup Instructions

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name it (e.g., "personal-trainer-pro" or "trainer-app")
5. Choose Public or Private
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 2: Connect Your Local Repository to GitHub

After creating the repository on GitHub, you'll see a page with setup instructions. Use the commands below, replacing `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name:

```bash
# Add the remote repository (replace with your GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Alternative: Using SSH

If you prefer SSH (and have SSH keys set up):

```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Quick Command Template

Replace the placeholders and run:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Troubleshooting

### If you get authentication errors:
- Use a Personal Access Token instead of password
- Generate one at: GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
- Use the token as your password when pushing

### If the repository already exists on GitHub:
- You can still add it as remote and push
- If there are conflicts, use: `git push -u origin main --force` (be careful with this!)

### To check your remote:
```bash
git remote -v
```

### To change the remote URL:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

