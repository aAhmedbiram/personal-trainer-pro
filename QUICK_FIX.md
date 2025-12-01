# Quick Fix: Cannot Connect to Server

## The Problem
Frontend on Vercel cannot connect to Backend on Railway.

## The Solution (3 Steps)

### Step 1: Set Environment Variable in Vercel

1. Go to: https://vercel.com/ahmedbirams-projects/personal-trainer-pro/settings/environment-variables
2. Click "Add New"
3. Enter:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://personal-trainer-pro-personal-trainer-pro.up.railway.app`
   - **Environments:** Select ALL (Production, Preview, Development)
4. Click "Save"

### Step 2: Redeploy

1. Go to: https://vercel.com/ahmedbirams-projects/personal-trainer-pro/deployments
2. Find the latest deployment
3. Click the three dots (⋯) → "Redeploy"
4. Wait for deployment to complete (2-3 minutes)

### Step 3: Verify

1. Open your app: https://personal-trainer-pro.vercel.app/register
2. Open Browser Console (F12)
3. Try to register
4. Check console - you should see:
   ```
   API base URL: https://personal-trainer-pro-personal-trainer-pro.up.railway.app
   ```
   NOT:
   ```
   API base URL: /api
   ```

## Visual Guide

### In Vercel Settings:
```
Settings → Environment Variables → Add New
┌─────────────────────────────────────┐
│ Key: VITE_API_URL                  │
│ Value: https://personal-trainer-...│
│ ☑ Production                        │
│ ☑ Preview                           │
│ ☑ Development                       │
│ [Save]                              │
└─────────────────────────────────────┘
```

## Still Not Working?

1. **Check if variable is set:**
   - Go to Vercel → Settings → Environment Variables
   - Make sure `VITE_API_URL` is listed

2. **Check deployment logs:**
   - Go to Deployments → Latest → Build Logs
   - Look for any errors

3. **Clear browser cache:**
   - Press Ctrl+Shift+Delete
   - Clear cache and reload

4. **Check browser console:**
   - Press F12 → Console tab
   - Look for error messages
   - Check Network tab to see what URL is being called

## Test Backend Directly

Open in browser:
```
https://personal-trainer-pro-personal-trainer-pro.up.railway.app/
```

Should show JSON with API info. If this doesn't work, the backend issue is on Railway side.

