# Lishmah Sources (מקורות לשמה)

A full-stack web application for distributing Torah study materials (PDF source sheets) from a rabbi to students. Features anonymous public access and secure admin content management with download analytics.

## Tech Stack

- **Frontend:** Vue 3 (Composition API) + Vite + Pinia + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL (Neon Tech)
- **File Storage:** Cloudinary
- **Deployment:** Frontend on Vercel/Netlify, Backend on Render

## Features

### Public Interface
- Browse and download PDF source sheets
- Filter by category
- Sort by newest or most popular
- Mobile-first responsive design
- Hebrew language interface with RTL support
- Download counter tracking

### Admin Interface
- Secure JWT-based authentication
- Upload new PDF sheets with metadata
- Manage categories (create/delete)
- View all sheets with download statistics
- Delete sheets (removes from both database and Cloudinary)

## Project Structure

```
lishmah_sources/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── config/            # Database, Cloudinary config
│   │   ├── middleware/        # Auth, file validation
│   │   ├── routes/            # API endpoints
│   │   ├── controllers/       # Business logic
│   │   ├── models/            # Database queries
│   │   └── server.js          # Express app entry
│   ├── migrations/            # Database schema
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # Vue 3 + Vite
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── views/             # Page components
│   │   ├── stores/            # Pinia state management
│   │   ├── services/          # API client
│   │   ├── router/            # Vue Router
│   │   └── main.js
│   ├── .env.example
│   └── package.json
│
├── CLAUDE.md                   # Development guidance
├── spec.md                     # Hebrew SRS
├── DEV_PLAN.md                 # Development plan
└── README.md                   # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon Tech account)
- Cloudinary account
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd lishmah_sources
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Configure your environment variables in `.env`:

```env
# Database (Neon Tech PostgreSQL)
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Authentication
JWT_SECRET=generate_random_secure_string_here_at_least_32_chars
ADMIN_USERNAME=rabbi
ADMIN_PASSWORD_HASH=bcrypt_hash_of_password

# Server
PORT=3000
NODE_ENV=development
```

**Generate admin password hash:**

```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your_password', 10));"
```

### 3. Database Setup

Run the migration script on your Neon Tech database:

```bash
# Copy SQL from backend/migrations/001_initial_schema.sql
# Run it in Neon Tech SQL Editor or via psql
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Configure your environment variables in `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 5. Run Development Servers

**Backend:**
```bash
cd backend
npm run dev
```
Server runs on http://localhost:3000

**Frontend:**
```bash
cd frontend
npm run dev
```
App runs on http://localhost:5173

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/sheets` | Get all sheets (with filters) | No |
| GET | `/api/sheets/:id/download` | Increment counter & get file URL | No |
| POST | `/api/auth/login` | Admin login | No |
| GET | `/api/categories` | Get all categories | No |
| POST | `/api/sheets` | Upload new sheet | Yes (Admin) |
| DELETE | `/api/sheets/:id` | Delete sheet | Yes (Admin) |
| POST | `/api/categories` | Create category | Yes (Admin) |
| DELETE | `/api/categories/:id` | Delete category | Yes (Admin) |

## Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - Build Command: `cd backend && npm install`
   - Start Command: `node src/server.js`
   - Environment Variables: Add all from `.env`
4. Deploy

### Frontend (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy:
   ```bash
   cd frontend
   vercel --prod
   ```
3. Set environment variable:
   - `VITE_API_BASE_URL`: Your Render backend URL

### Database (Neon Tech)

1. Create a project at neon.tech
2. Run the migration SQL in Neon console
3. Copy connection string to Render environment variables

## Critical Implementation Notes

### Download Counter Logic
The counter MUST increment BEFORE serving the file to ensure accuracy:
1. Client sends GET to `/api/sheets/:id/download`
2. Server updates: `download_count = download_count + 1`
3. Server returns file URL
4. Client opens URL

### File Storage
- Files are NEVER saved to local disk
- Stream directly from multer buffer to Cloudinary
- Always delete from Cloudinary when deleting a sheet

### Render Sleep Mode
- Backend sleeps after 15 min inactivity
- Frontend has retry logic for 502/503 errors
- Shows loading message: "מעיר את השרת..."

## Security Checklist

- ✅ JWT secret is strong random string
- ✅ Admin password is bcrypt hashed
- ✅ All admin routes protected with auth middleware
- ✅ File validation rejects non-PDF files
- ✅ CORS configured for production
- ✅ .env files never committed to git

## Testing

### Backend
```bash
# Test database connection
node -e "require('./src/config/database')"

# Test endpoints
curl http://localhost:3000/api/sheets
curl http://localhost:3000/health
```

### Frontend
- Open http://localhost:5173
- Test browsing sheets
- Test filters and sorting
- Test login at /login
- Test admin panel at /admin

## License

ISC

## Author

Built for distributing Torah study materials to yeshiva students.
