# Railway Setup Steps - Quick Guide

## ✅ Step 1: Postgres Database (Already Done!)
You've successfully created the Postgres database service.

## Step 2: Connect Your App Service to Postgres

1. **Go to your main app service** (the "personal-trainer-pro" service, not the Postgres service)
2. Click on the **"Variables"** tab
3. Click **"Add Variable"** or **"New Variable"**
4. For the variable name, type: `DATABASE_URL`
5. For the value, click the **`{}`** button (or "Add Reference")
6. Select **"Postgres"** service
7. Select **"DATABASE_URL"** from the dropdown
8. Click **"Add"**

This creates a reference so your app can access the database connection string.

## Step 3: Add Required Environment Variables

In your **main app service** (not Postgres), add these variables:

### Required Variables:

1. **SECRET_KEY**
   - Name: `SECRET_KEY`
   - Value: Generate a random string (see below)
   - Click "Add"

2. **JWT_SECRET_KEY**
   - Name: `JWT_SECRET_KEY`
   - Value: Generate another random string
   - Click "Add"

3. **FLASK_ENV**
   - Name: `FLASK_ENV`
   - Value: `production`
   - Click "Add"

### How to Generate Random Keys:

You can use this Python command:
```python
import secrets
print(secrets.token_hex(32))
```

Or use an online generator, or just use a long random string.

## Step 4: Verify Your Service

1. Make sure your main app service is connected to your GitHub repo
2. Check that it's deploying (go to "Deployments" tab)
3. The service should automatically redeploy when you add variables

## Step 5: Check Deployment Logs

1. Go to your main app service
2. Click "Deployments" tab
3. Click on the latest deployment
4. Check the logs for any errors

## Troubleshooting

### If your service shows "Crashed":
- Check the deployment logs
- Make sure all environment variables are set
- Verify DATABASE_URL is properly referenced from Postgres service

### If you see database connection errors:
- Make sure DATABASE_URL is added as a reference (not a plain value)
- Verify Postgres service is running (green checkmark)
- Check that the variable reference points to the correct Postgres service

### If deployment fails:
- Check that `requirements.txt` includes all dependencies
- Verify `Procfile` is in the root directory
- Make sure Python version is compatible

## Quick Checklist

- [x] Postgres database created
- [ ] DATABASE_URL added as reference in app service
- [ ] SECRET_KEY added
- [ ] JWT_SECRET_KEY added
- [ ] FLASK_ENV=production added
- [ ] App service connected to GitHub repo
- [ ] Deployment successful

