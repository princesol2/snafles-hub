# SNAFLEShub Setup Guide

## Quick Setup

### 1) Install Git (if needed)
- Windows: https://git-scm.com/download/win
- macOS: `brew install git` or https://git-scm.com/download/mac
- Linux: `sudo apt install git` (Debian/Ubuntu) or `sudo yum install git` (RHEL/CentOS)

### 2) Initialize Repository
```bash
cd C:\Users\saura\OneDrive\Desktop\BUSSINESS
git init
git add .
git commit -m "Initial commit: SNAFLEShub e-commerce platform"
```

### 3) Environment Configuration

#### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
VITE_APP_NAME=SNAFLEShub
VITE_APP_DESCRIPTION=Your one-stop e-commerce platform
```

#### Backend (backend/.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/snafleshub
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 4) Install Dependencies
```bash
# frontend
npm install

# backend
cd backend && npm install && cd ..
```

### 5) Start Development Servers

#### Option A: Mock API (no DB)
```bash
cd backend
node server-mock.js
# in another terminal
npm run dev
```

#### Option B: Full API (MongoDB)
```bash
# ensure MongoDB is installed and running
cd backend
npm run dev
# in another terminal
npm run dev
```

### 6) Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health: http://localhost:5000/api/health

## Development Commands

### Frontend
```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend
```bash
npm run dev
npm start
npm run seed
```

## Project Structure
```
SNAFLEShub/
  .gitignore
  README.md
  setup.md
  package.json
  vite.config.js
  tailwind.config.js
  src/
    components/
    pages/
    contexts/
    services/
    utils/
  public/
  backend/
    routes/
    models/
    middleware/
    config/
    server.js
    server-mock.js
    package.json
```

## Security Notes

### Environment Variables
- Never commit `.env` files
- Use strong, unique JWT secrets
- Keep API keys secure; use different keys for dev vs prod

### Database Security
- Use strong MongoDB passwords (for remote)
- Enable auth in production
- Back up regularly

### API Security
- JWT-protected endpoints, rate limiting, CORS
- Input validation

## Deployment

### Frontend (Vercel/Netlify)
1) `npm run build`
2) Deploy the `dist` folder
3) Configure environment variables

### Backend (Heroku/Railway)
1) Configure environment variables
2) Deploy `backend/`
3) Ensure MongoDB connectivity

## Troubleshooting

1) Port in use
   - Change port in `vite.config.js` or `backend/server.js`
2) MongoDB connection failed
   - Ensure MongoDB is running and URI is correct
   - Use mock server as fallback
3) CORS errors
   - Check `FRONTEND_URL` in backend `.env`
4) Env vars not loading
   - Restart dev server; ensure `VITE_` prefix for frontend vars

## Support
Open an issue or reach out to the maintainers.

---

Happy coding!

