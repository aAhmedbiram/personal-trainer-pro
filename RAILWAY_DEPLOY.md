# Railway Deployment Guide

## Prerequisites
- GitHub repository pushed (already done ✅)
- Railway account connected to GitHub

## Step 1: Add PostgreSQL Database

1. In your Railway project, click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway will automatically create a PostgreSQL database
3. The `DATABASE_URL` environment variable will be automatically set

## Step 2: Configure Environment Variables

In your Railway service settings, add these environment variables:

1. Go to your service → **"Variables"** tab
2. Add the following variables:

```
SECRET_KEY=your-random-secret-key-here
JWT_SECRET_KEY=your-random-jwt-secret-key-here
FLASK_ENV=production
```

**To generate secure keys:**
```python
import secrets
print(secrets.token_hex(32))
```

Run this in Python to generate random keys.

## Step 3: Deploy

1. Railway should automatically detect the deployment from your GitHub repo
2. If not, go to **"Settings"** → **"Source"** → Connect your GitHub repo
3. Railway will automatically:
   - Detect Python (from `requirements.txt`)
   - Install backend dependencies
   - Build the frontend (if configured)
   - Start the server with gunicorn

## Step 4: Check Deployment Logs

1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. Check the logs for any errors

## Troubleshooting

### Error: "No module named 'gunicorn'"
- ✅ Fixed: Added `gunicorn==21.2.0` to `requirements.txt`

### Error: "Module not found" or import errors
- Make sure all dependencies are in `requirements.txt`
- Check that the working directory is set correctly

### Database Connection Errors
- Verify `DATABASE_URL` is set (Railway sets this automatically for PostgreSQL)
- Check that PostgreSQL service is running
- The config now handles Railway's `postgres://` URL format

### CORS Errors
- ✅ Fixed: Updated CORS to allow all origins in production

### Port Issues
- Railway automatically sets the `PORT` environment variable
- Gunicorn is configured to use `$PORT`

## Project Structure for Railway

Railway will:
1. Detect this is a Python project (from `requirements.txt`)
2. Install Python dependencies from `backend/requirements.txt`
3. Run the start command from `Procfile` or `nixpacks.toml`

## Important Files Created

- `Procfile` - Tells Railway how to start the app
- `nixpacks.toml` - Alternative build configuration
- `runtime.txt` - Python version specification
- Updated `backend/app.py` - Fixed for production deployment
- Updated `backend/config.py` - Handles Railway's database URL format

## Next Steps After Deployment

1. **Get your app URL**: Railway will provide a URL like `https://your-app.railway.app`
2. **Update frontend API URL**: If deploying frontend separately, update the API base URL
3. **Test the API**: Visit `https://your-app.railway.app/api/auth/me` (should return 401, which is expected)

## Separate Frontend Deployment (Optional)

If you want to deploy the frontend separately:

1. Create a new service in Railway
2. Set the root directory to `frontend`
3. Railway will detect it's a Node.js project
4. Build command: `npm run build`
5. Start command: `npm run preview` (or use a static file server)

Or use Vercel/Netlify for the frontend (they're optimized for React apps).



