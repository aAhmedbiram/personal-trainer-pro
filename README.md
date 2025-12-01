# Personal Trainer Pro

A comprehensive web application for personal trainers to manage their clients, workouts, schedules, and track progress. Built with Flask (Python), React, and PostgreSQL.

## Features

- **Client Management**: Add, edit, and manage client information including fitness goals and medical notes
- **Workout Plans**: Create detailed workout plans with multiple exercises, sets, reps, and weights
- **Scheduling**: Schedule training sessions with calendar view and session management
- **Progress Tracking**: Track client progress with weight, body fat percentage, muscle mass, and visual charts
- **Dashboard**: Overview of clients, workouts, and upcoming sessions
- **Authentication**: Secure login and registration system for trainers

## Tech Stack

### Backend
- Python 3.8+
- Flask
- Flask-SQLAlchemy
- Flask-JWT-Extended
- PostgreSQL
- Flask-CORS

### Frontend
- React 18
- React Router
- Axios
- Tailwind CSS
- Recharts (for progress charts)
- Vite

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- PostgreSQL 12 or higher
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Dola
```

### 2. Set up the Backend

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file (copy from .env.example)
# Update DATABASE_URL with your PostgreSQL credentials
# Update SECRET_KEY and JWT_SECRET_KEY with secure random strings

# Create the database
createdb personaltrainer_db

# Or using psql:
# psql -U postgres
# CREATE DATABASE personaltrainer_db;
```

### 3. Set up the Frontend

```bash
cd ../frontend

# Install dependencies
npm install
```

## Configuration

### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here-change-in-production
DATABASE_URL=postgresql://username:password@localhost:5432/personaltrainer_db
JWT_SECRET_KEY=your-jwt-secret-key-here
```

### Database Setup

The database tables will be created automatically when you run the Flask application for the first time.

## Running the Application

### Start the Backend

```bash
cd backend
python app.py
```

The backend will run on `http://localhost:5000`

### Start the Frontend

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
Dola/
├── backend/
│   ├── app.py                 # Flask application entry point
│   ├── config.py              # Configuration settings
│   ├── extensions.py          # Flask extensions
│   ├── requirements.txt       # Python dependencies
│   ├── models/               # Database models
│   │   ├── trainer.py
│   │   ├── client.py
│   │   ├── workout.py
│   │   ├── schedule.py
│   │   └── progress.py
│   └── routes/               # API routes
│       ├── auth.py
│       ├── trainers.py
│       ├── clients.py
│       ├── workouts.py
│       ├── schedules.py
│       └── progress.py
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── contexts/         # React contexts
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new trainer
- `POST /api/auth/login` - Login trainer
- `GET /api/auth/me` - Get current trainer (protected)

### Clients
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create a new client
- `GET /api/clients/:id` - Get client details
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Workouts
- `GET /api/workouts` - Get all workouts (optional: ?client_id=)
- `POST /api/workouts` - Create a new workout
- `GET /api/workouts/:id` - Get workout details
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

### Schedules
- `GET /api/schedules` - Get schedules (optional: ?start_date=, ?end_date=, ?client_id=)
- `POST /api/schedules` - Create a new schedule
- `GET /api/schedules/:id` - Get schedule details
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule

### Progress
- `GET /api/progress?client_id=` - Get progress entries for a client
- `POST /api/progress` - Create a new progress entry
- `GET /api/progress/:id` - Get progress entry details
- `PUT /api/progress/:id` - Update progress entry
- `DELETE /api/progress/:id` - Delete progress entry

### Trainers
- `GET /api/trainers/profile` - Get trainer profile
- `PUT /api/trainers/profile` - Update trainer profile

## Usage

1. Start both the backend and frontend servers
2. Navigate to `http://localhost:3000`
3. Register a new trainer account or login
4. Start managing your clients, workouts, and schedules!

## Development

### Backend Development

The Flask app uses SQLAlchemy for database operations. Models are defined in the `models/` directory, and routes are in the `routes/` directory.

### Frontend Development

The React app uses Vite as the build tool. Components are organized by feature, and Tailwind CSS is used for styling.

## Security Notes

- Change the `SECRET_KEY` and `JWT_SECRET_KEY` in production
- Use environment variables for sensitive configuration
- Implement proper CORS policies for production
- Use HTTPS in production
- Regularly update dependencies

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on the repository.

