# House of Hair - DigitalOcean App Platform Deployment

Quick guide for deploying to DigitalOcean App Platform.

## Step-by-Step Deployment

### Step 1: Connect GitHub (You're Here!)

1. Click **"Connect GitHub account"** button
2. Authorize DigitalOcean to access your GitHub
3. Select repository: **NBNEORIGIN/house-of-hair-booking**
4. Click **Next**

### Step 2: Configure App Settings

**Source Directory:**
- Set to: `backend`
- This tells DigitalOcean where your Django app is

**Branch:**
- Use: `main`

**Autodeploy:**
- ✅ Enable - Auto-deploy on git push

### Step 3: Detect Build Settings

DigitalOcean should auto-detect Python. If not:

**Build Command:**
```bash
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
```

**Run Command:**
```bash
gunicorn booking_platform.wsgi:application --bind 0.0.0.0:$PORT
```

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

```
SECRET_KEY=your-django-secret-key-here
DEBUG=False
ALLOWED_HOSTS=.ondigitalocean.app
DATABASE_URL=${db.DATABASE_URL}
EMAIL_HOST=smtp.ionos.co.uk
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=toby@nbnesigns.com
EMAIL_HOST_PASSWORD=!49Monkswood
DEFAULT_FROM_EMAIL=toby@nbnesigns.com
CORS_ALLOWED_ORIGINS=https://house-of-hair-booking.vercel.app,https://house-of-hair-booking-g3w22c8pm-tobys-projects-496c16c0.vercel.app
```

### Step 5: Add PostgreSQL Database

1. Click **"Add Resource"** → **Database**
2. Select **PostgreSQL**
3. Choose **Dev Database** ($7/month) or **Basic** ($15/month)
4. Database will auto-connect to your app

### Step 6: Review & Deploy

1. Review settings
2. Click **"Create Resources"**
3. Wait 5-10 minutes for deployment

### Step 7: Get Your API URL

After deployment:
- Your API will be at: `https://your-app-name.ondigitalocean.app`
- Copy this URL

### Step 8: Update Django Settings

The app needs `gunicorn` - add to `requirements.txt`:

```bash
# In your local terminal:
cd D:\nbne-booking-instances\clients\house-of-hair\backend
echo gunicorn >> requirements.txt
git add requirements.txt
git commit -m "Add gunicorn for production"
git push
```

### Step 9: Update Vercel Environment Variable

```bash
cd D:\nbne-booking-instances\clients\house-of-hair\frontend
vercel env rm NEXT_PUBLIC_API_BASE_URL production
vercel env add NEXT_PUBLIC_API_BASE_URL
# Enter: https://your-app-name.ondigitalocean.app/api
vercel --prod
```

### Step 10: Update Django CORS

In `backend/booking_platform/settings.py`, update:

```python
ALLOWED_HOSTS = ['.ondigitalocean.app', 'house-of-hair-booking.vercel.app']
```

Commit and push - DigitalOcean will auto-deploy!

## Pricing

**App Platform:**
- Basic: $5/month (512MB RAM)
- Professional: $12/month (1GB RAM)

**Database:**
- Dev: $7/month (1GB storage)
- Basic: $15/month (10GB storage)

**Total: $12-27/month** for complete production setup

## Custom Domain (Optional)

1. In DigitalOcean dashboard, go to your app
2. Settings → Domains
3. Add: `api.houseofhair.co.uk`
4. Update DNS:
   - Type: CNAME
   - Name: api
   - Value: your-app-name.ondigitalocean.app

## Monitoring

- **Logs:** Available in DigitalOcean dashboard
- **Metrics:** CPU, Memory, Bandwidth usage
- **Alerts:** Set up email alerts for downtime

## Automatic Deployments

Every time you push to GitHub `main` branch:
1. DigitalOcean detects the push
2. Builds new version
3. Runs migrations
4. Deploys automatically
5. Zero downtime

## Troubleshooting

**Build Failed:**
- Check build logs in DigitalOcean
- Verify requirements.txt is complete
- Ensure gunicorn is installed

**Database Connection Error:**
- Verify DATABASE_URL is set
- Check database is running
- Review connection logs

**CORS Errors:**
- Update CORS_ALLOWED_ORIGINS
- Include both Vercel URLs
- Redeploy after changes

## Backups

DigitalOcean automatically backs up your database daily.

**Manual Backup:**
1. Go to Databases
2. Click your database
3. Backups & Restore
4. Create backup

## Scaling

As traffic grows:
1. Upgrade app tier (more RAM/CPU)
2. Upgrade database tier
3. Add CDN for static files
4. Enable caching
