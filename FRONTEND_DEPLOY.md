# Frontend Deployment Guide for Vercel

## Issue
Vercel is detecting Flask instead of React because it's looking at the root directory.

## Solution: Configure Vercel Settings

### Option 1: Use vercel.json (Recommended)
I've created a `vercel.json` file that tells Vercel to build the frontend. This should work automatically.

### Option 2: Manual Configuration in Vercel Dashboard

If the automatic detection doesn't work, configure manually:

1. **Go to your Vercel project settings**
2. **Navigate to "Settings" → "General"**
3. **Configure Build & Development Settings:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
   - **Development Command:** `npm run dev`

4. **Go to "Settings" → "Environment Variables"**
5. **Add:**
   - **Name:** `VITE_API_URL`
   - **Value:** `https://personal-trainer-pro-personal-trainer-pro.up.railway.app`
   - **Environment:** Production, Preview, Development (select all)

6. **Redeploy** your project

## Alternative: Deploy Frontend as Separate Repository

If you continue having issues, you could:
1. Create a new GitHub repository just for the frontend
2. Copy the `frontend/` folder contents to the new repo
3. Deploy that repository to Vercel

## Testing After Deployment

Once deployed, your frontend will be available at a Vercel URL like:
`https://personal-trainer-pro.vercel.app`

The frontend will automatically connect to your Railway backend API.

