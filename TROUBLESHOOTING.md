# Troubleshooting Guide

## Current Status

✅ **Backend API is deployed and running** on Railway
- Root endpoint: `https://personal-trainer-pro-personal-trainer-pro.up.railway.app/`
- API endpoints are accessible

## Common Issues

### 1. "The app didn't run" - Frontend Not Deployed

**Issue:** You're trying to access the full web application, but only the backend is deployed.

**Solution:** The React frontend needs to be deployed separately. You have two options:

#### Option A: Deploy Frontend to Vercel/Netlify (Recommended)
1. Go to [Vercel.com](https://vercel.com) or [Netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL=https://personal-trainer-pro-personal-trainer-pro.up.railway.app`
5. Deploy

#### Option B: Update Frontend to Use Railway API
1. Update `frontend/src/services/api.js` to use your Railway URL
2. Build the frontend: `cd frontend && npm run build`
3. Serve the build folder

### 2. Database Connection Errors

**Symptoms:** API returns 500 errors when trying to create/read data

**Check:**
- In Railway, go to your service → Variables tab
- Verify `DATABASE_URL` is set (should be automatically set from Postgres service)
- Check deployment logs for database connection errors

**Fix:**
- Make sure Postgres service is running (green checkmark)
- Verify DATABASE_URL variable is referenced from Postgres service

### 3. CORS Errors

**Symptoms:** Frontend can't connect to API

**Fix:** CORS is already configured to allow all origins in production. If you still see errors:
- Check that `FLASK_ENV=production` is set in Railway variables
- Verify the frontend is using the correct API URL

### 4. Authentication Errors

**Symptoms:** Can't login or register

**Check:**
- Make sure `SECRET_KEY` and `JWT_SECRET_KEY` are set in Railway variables
- Verify they have actual values (not empty strings)

### 5. 404 Errors on API Endpoints

**Symptoms:** Getting 404 when accessing `/api/*` endpoints

**Check:**
- Verify the deployment is successful (green checkmark in Railway)
- Check that all routes are registered in `backend/app.py`
- View deployment logs for any import errors

### 6. Port Issues

**Symptoms:** App won't start

**Check:**
- Railway automatically sets `$PORT` environment variable
- Procfile uses `$PORT` correctly
- Check deployment logs for port binding errors

## Testing the API

### Test Root Endpoint
```bash
curl https://personal-trainer-pro-personal-trainer-pro.up.railway.app/
```

### Test Registration
```bash
curl -X POST https://personal-trainer-pro-personal-trainer-pro.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### Test Login
```bash
curl -X POST https://personal-trainer-pro-personal-trainer-pro.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

## Next Steps

1. **If backend is working:** Deploy the frontend separately
2. **If you see specific errors:** Check Railway deployment logs
3. **If database issues:** Verify Postgres service is running and connected

## Getting Help

Please provide:
1. The exact error message you're seeing
2. Where you're seeing it (browser, Railway logs, etc.)
3. What you were trying to do when it happened

