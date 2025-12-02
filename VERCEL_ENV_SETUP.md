# Vercel Environment Variable Setup

## Critical: Set API URL Environment Variable

Your frontend is deployed but **cannot connect to the backend** because the `VITE_API_URL` environment variable is not set in Vercel.

## Quick Fix Steps:

1. **Go to your Vercel project**: `personal-trainer-pro`
2. **Click "Settings"** (gear icon)
3. **Go to "Environment Variables"** (left sidebar)
4. **Click "Add New"**
5. **Enter:**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://personal-trainer-pro-personal-trainer-pro.up.railway.app`
   - **Environments:** Select all three:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
6. **Click "Save"**
7. **Redeploy:**
   - Go to "Deployments" tab
   - Click the three dots (⋯) on the latest deployment
   - Click "Redeploy"

## Why This Is Needed:

- Without `VITE_API_URL`, the frontend tries to use `/api` (relative URL)
- This doesn't work because the frontend is on Vercel and the backend is on Railway
- Setting `VITE_API_URL` tells the frontend where to find your backend API

## Verify It's Working:

After redeploying, check the browser console (F12) to see:
- If `VITE_API_URL` is being used
- Any network errors when trying to register/login

## Current API URL:

Your backend is running at:
`https://personal-trainer-pro-personal-trainer-pro.up.railway.app`

Make sure this exact URL is set as `VITE_API_URL` in Vercel!



