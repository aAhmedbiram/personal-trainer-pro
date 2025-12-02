# Setup Guide

## Quick Start

### 1. Database Setup

First, make sure PostgreSQL is installed and running on your system.

#### Create the database:

```bash
# Using psql command line
psql -U postgres
CREATE DATABASE personaltrainer_db;
\q
```

Or using createdb:
```bash
createdb personaltrainer_db
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
# Copy the following and update with your values:
```

Create a file named `.env` in the `backend` directory:

```env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=change-this-to-a-random-secret-key
DATABASE_URL=postgresql://username:password@localhost:5432/personaltrainer_db
JWT_SECRET_KEY=change-this-to-a-random-jwt-secret-key
```

**Important**: Replace:
- `username` and `password` with your PostgreSQL credentials
- `SECRET_KEY` with a random string (you can generate one using Python: `python -c "import secrets; print(secrets.token_hex(32))"`)
- `JWT_SECRET_KEY` with another random string

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

### 4. Run the Application

#### Terminal 1 - Backend:
```bash
cd backend
python app.py
```

The backend will start on `http://localhost:5000`

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

### 5. First Use

1. Open your browser and go to `http://localhost:3000`
2. Click "Sign up" to create a trainer account
3. Fill in your information and create an account
4. You'll be automatically logged in and redirected to the dashboard

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Make sure PostgreSQL is running:
   ```bash
   # Check if PostgreSQL is running
   # Windows: Check Services
   # macOS: brew services list
   # Linux: sudo systemctl status postgresql
   ```

2. Verify your DATABASE_URL in `.env` matches your PostgreSQL setup

3. Make sure the database exists:
   ```bash
   psql -U postgres -l
   ```

### Port Already in Use

If port 5000 or 3000 is already in use:

- Backend: Change the port in `backend/app.py` (last line)
- Frontend: Change the port in `frontend/vite.config.js`

### Module Not Found Errors

Make sure you've:
- Activated your virtual environment (backend)
- Installed all dependencies (`pip install -r requirements.txt` and `npm install`)

### CORS Errors

If you see CORS errors in the browser console, make sure:
- The backend is running on port 5000
- The frontend is running on port 3000
- The CORS configuration in `backend/app.py` matches your frontend URL

## Production Deployment

For production deployment:

1. Set `FLASK_ENV=production` in `.env`
2. Use a strong `SECRET_KEY` and `JWT_SECRET_KEY`
3. Configure proper CORS origins
4. Use a production-grade database
5. Set up HTTPS
6. Use environment variables for all sensitive data
7. Build the frontend: `cd frontend && npm run build`
8. Serve the frontend build with a production server (nginx, etc.)

## Next Steps

- Add more features as needed
- Customize the UI to match your brand
- Add email notifications
- Integrate payment processing
- Add client portal (optional)
- Add mobile app (optional)



