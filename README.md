# House of Hair Booking System

Complete booking platform for House of Hair salon in Alnwick.

## Features

- **Service Booking**: Browse services with prices and durations
- **Staff Selection**: Choose your preferred stylist
- **Date & Time Selection**: Real-time availability checking
- **Email Confirmations**: Automatic booking confirmations via email
- **Admin Dashboard**: Manage bookings, clients, services, and staff
- **CRM Features**: Client tracking with booking history and spending
- **CSV Exports**: Download booking and client data for marketing

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

## Deployment

### Frontend (Vercel)
- Deployed at: https://house-of-hair-booking.vercel.app
- Environment variable: `NEXT_PUBLIC_API_BASE_URL`

### Backend
- Requires PostgreSQL database
- Configure SMTP settings in `.env`
- Update CORS_ALLOWED_ORIGINS for production domain

## Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=house_of_hair_db
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432
EMAIL_HOST=smtp.ionos.co.uk
EMAIL_PORT=587
EMAIL_HOST_USER=your-email
EMAIL_HOST_PASSWORD=your-password
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8001/api
```

## License

Proprietary - House of Hair
