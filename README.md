# House of Hair Booking System

Complete booking platform for House of Hair salon in Alnwick.

## 🌟 Features

### Customer-Facing
- **Service Booking**: Browse services with prices and durations
- **Staff Selection**: Choose your preferred stylist or select "Any Available"
- **Date & Time Selection**: Real-time availability checking
- **Email Confirmations**: Automatic booking confirmations via IONOS SMTP
- **Mobile Responsive**: Works perfectly on all devices

### Admin Features
- **Booking Management**: View, filter, and cancel bookings
- **Cancel Bookings**: One-click cancellation that frees up time slots immediately
- **Price Display**: See booking prices and total revenue at a glance
- **Staff Management**: Add/edit staff members and assign services
- **Service Management**: Configure services, pricing, and durations
- **Client Database**: Track customer information and booking history
- **Schedule Management**: Set business hours and staff availability
- **CSV Exports**: Download booking and client data for marketing

### Technical Features
- **Real-time Availability**: Time slots update based on existing bookings
- **Automatic Slot Management**: Cancelled bookings immediately free up time slots
- **Revenue Tracking**: Dashboard shows total revenue from all bookings
- **Email Notifications**: Automatic confirmation emails to customers

## Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Custom CSS with House of Hair branding

### Backend
- Django 5.2.11
- Django REST Framework
- PostgreSQL
- SMTP Email (IONOS)

## Local Development

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Create superuser:
   ```bash
   python manage.py createsuperuser
   ```

6. Start development server:
   ```bash
   python manage.py runserver 8001
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local`:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8001/api
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Open browser to `http://localhost:3001`

## Admin Access

- URL: `http://localhost:8001/admin/`
- Use superuser credentials created during setup

## 🌐 Deployment

### Frontend (Vercel)
- **Live URL**: https://house-of-hair-booking.vercel.app
- **Deployment**: Automatic via GitHub push to main branch
- **Environment Variables**:
  - `NEXT_PUBLIC_API_BASE_URL` - Backend API URL

### Backend
- **Requirements**: 
  - PostgreSQL database
  - Python 3.11+
  - SMTP email configuration (IONOS)
- **Environment Variables** (see `.env` section below)
- **Deployment**: 
  - Pull latest changes: `git pull origin main`
  - Activate virtual environment
  - Restart Django/Gunicorn service

### Database
- PostgreSQL 14+
- Database name: `house_of_hair_db`
- Migrations: `python manage.py migrate`

## 🔑 Environment Variables

### Backend (.env)
```bash
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=False  # Set to False in production
ALLOWED_HOSTS=your-domain.com,localhost

# Database
DB_NAME=house_of_hair_db
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432

# Email (IONOS SMTP)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.ionos.co.uk
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@domain.com
EMAIL_HOST_PASSWORD=your-password
DEFAULT_FROM_EMAIL=your-email@domain.com

# CORS
CORS_ALLOWED_ORIGINS=https://house-of-hair-booking.vercel.app,http://localhost:3001
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8001/api  # Local development
# NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com/api  # Production
```

## 📡 API Endpoints

### Bookings
- `GET /api/bookings/` - List all bookings
- `POST /api/bookings/` - Create booking
- `PATCH /api/bookings/{id}/` - Update booking (e.g., cancel)
- `GET /api/bookings/slots/` - Get available time slots

### Services & Staff
- `GET /api/services/` - List services
- `GET /api/staff/` - List staff members

### Clients
- `GET /api/clients/` - List clients
- `POST /api/clients/` - Create client

## 🔧 Key Features Implementation

### Cancel Booking
Cancelling a booking via the admin interface:
1. Changes booking status to 'cancelled'
2. Automatically frees up the time slot
3. Slot becomes immediately available for new bookings

### Price Display
- Booking prices pulled from service pricing
- Total revenue calculated in dashboard
- Prices shown in booking table and detail view
- CSV export includes pricing information

### Availability Logic
- Only 'pending' and 'confirmed' bookings block time slots
- Cancelled, completed, or no-show bookings don't affect availability
- Real-time slot checking prevents double bookings

## 🐛 Troubleshooting

### Frontend Issues
- **API errors**: Verify `NEXT_PUBLIC_API_BASE_URL` is correct
- **Build failures**: Check TypeScript errors in Vercel logs
- **CORS errors**: Ensure backend `CORS_ALLOWED_ORIGINS` includes Vercel URL

### Backend Issues
- **500 errors**: Check server logs for Python exceptions
- **Database errors**: Verify database credentials in `.env`
- **Email not sending**: Check SMTP credentials and server logs

## 📄 License

Proprietary - House of Hair, Alnwick
