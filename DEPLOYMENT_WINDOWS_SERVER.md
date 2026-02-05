# House of Hair - Windows Server Deployment Guide

This guide covers deploying the Django backend to a Windows server (e.g., Fasthosts Windows hosting).

## Prerequisites

- Windows Server with IIS or ability to run Python
- Python 3.11+ installed
- PostgreSQL database (local or remote)
- Domain/subdomain for the API (e.g., api.houseofhair.co.uk)
- SSL certificate (Let's Encrypt or purchased)

## Deployment Options

### Option 1: IIS with wfastcgi (Recommended for Windows Server)

#### Step 1: Install Python on Server

1. Download Python 3.11+ from python.org
2. Install with "Add to PATH" option checked
3. Verify installation:
   ```cmd
   python --version
   ```

#### Step 2: Install Dependencies

```cmd
cd C:\inetpub\wwwroot\house-of-hair-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
pip install wfastcgi
```

#### Step 3: Configure wfastcgi

```cmd
wfastcgi-enable
```

This will output a path like: `C:\Python311\python.exe|C:\Python311\Lib\site-packages\wfastcgi.py`

#### Step 4: Create web.config

Create `web.config` in your Django project root:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="Python FastCGI" 
           path="*" 
           verb="*" 
           modules="FastCgiModule" 
           scriptProcessor="C:\Python311\python.exe|C:\Python311\Lib\site-packages\wfastcgi.py" 
           resourceType="Unspecified" 
           requireAccess="Script" />
    </handlers>
    <staticContent>
      <mimeMap fileExtension=".json" mimeType="application/json" />
    </staticContent>
  </system.webServer>
  <appSettings>
    <add key="PYTHONPATH" value="C:\inetpub\wwwroot\house-of-hair-backend" />
    <add key="WSGI_HANDLER" value="django.core.wsgi.get_wsgi_application()" />
    <add key="DJANGO_SETTINGS_MODULE" value="booking_platform.settings" />
  </appSettings>
</configuration>
```

#### Step 5: Configure IIS

1. Open IIS Manager
2. Add new website:
   - Site name: `house-of-hair-api`
   - Physical path: `C:\inetpub\wwwroot\house-of-hair-backend`
   - Binding: Port 80 (or 443 for HTTPS)
   - Host name: `api.houseofhair.co.uk`

3. Application Pool Settings:
   - .NET CLR Version: No Managed Code
   - Enable 32-bit Applications: False

#### Step 6: Set Environment Variables

In IIS Manager → Site → Configuration Editor:
- Section: `system.webServer/fastCgi`
- Add environment variables from your `.env` file

Or use web.config:
```xml
<appSettings>
  <add key="SECRET_KEY" value="your-secret-key" />
  <add key="DEBUG" value="False" />
  <add key="DB_NAME" value="house_of_hair_db" />
  <add key="DB_USER" value="your-db-user" />
  <add key="DB_PASSWORD" value="your-db-password" />
  <add key="DB_HOST" value="localhost" />
  <add key="DB_PORT" value="5432" />
</appSettings>
```

---

### Option 2: Waitress (Simpler Alternative)

If IIS is too complex, use Waitress as a production WSGI server:

#### Step 1: Install Waitress

```cmd
pip install waitress
```

#### Step 2: Create Production Server Script

Create `run_production.py`:

```python
from waitress import serve
from booking_platform.wsgi import application

if __name__ == '__main__':
    serve(application, host='0.0.0.0', port=8001, threads=4)
```

#### Step 3: Run as Windows Service

Install NSSM (Non-Sucking Service Manager):

```cmd
# Download NSSM from nssm.cc
nssm install HouseOfHairAPI "C:\path\to\venv\Scripts\python.exe" "C:\path\to\run_production.py"
nssm set HouseOfHairAPI AppDirectory "C:\path\to\backend"
nssm start HouseOfHairAPI
```

#### Step 4: Configure Reverse Proxy in IIS

Install URL Rewrite and ARR modules, then add to web.config:

```xml
<system.webServer>
  <rewrite>
    <rules>
      <rule name="Reverse Proxy" stopProcessing="true">
        <match url="(.*)" />
        <action type="Rewrite" url="http://localhost:8001/{R:1}" />
      </rule>
    </rules>
  </rewrite>
</system.webServer>
```

---

## Production Configuration

### 1. Update Django Settings

Edit `backend/booking_platform/settings.py`:

```python
# Production settings
DEBUG = False
ALLOWED_HOSTS = ['api.houseofhair.co.uk', 'www.houseofhair.co.uk']

# CORS for Vercel
CORS_ALLOWED_ORIGINS = [
    "https://house-of-hair-booking.vercel.app",
    "https://house-of-hair-booking-g3w22c8pm-tobys-projects-496c16c0.vercel.app",
]

# Static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'

# Security
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
```

### 2. Collect Static Files

```cmd
python manage.py collectstatic --noinput
```

### 3. Run Migrations

```cmd
python manage.py migrate
```

### 4. Create Superuser

```cmd
python manage.py createsuperuser
```

---

## Database Setup

### Option A: PostgreSQL on Same Server

1. Install PostgreSQL for Windows
2. Create database:
   ```sql
   CREATE DATABASE house_of_hair_db;
   CREATE USER house_of_hair WITH PASSWORD 'secure-password';
   GRANT ALL PRIVILEGES ON DATABASE house_of_hair_db TO house_of_hair;
   ```

### Option B: Remote PostgreSQL

Use a managed PostgreSQL service:
- ElephantSQL (free tier available)
- Supabase (free tier)
- Your existing database server

Update `.env` with connection details.

---

## SSL Certificate

### Free SSL with Let's Encrypt

1. Install win-acme: https://www.win-acme.com/
2. Run certificate request:
   ```cmd
   wacs.exe
   ```
3. Select your IIS site
4. Certificate will auto-renew

### Or Use Fasthosts SSL

If Fasthosts provides SSL, install through their control panel.

---

## Update Vercel Environment Variable

Once backend is deployed:

```cmd
vercel env rm NEXT_PUBLIC_API_BASE_URL production
vercel env add NEXT_PUBLIC_API_BASE_URL
# Enter: https://api.houseofhair.co.uk/api
```

Then redeploy:
```cmd
vercel --prod
```

---

## Firewall Configuration

Open ports in Windows Firewall:
- Port 80 (HTTP)
- Port 443 (HTTPS)
- Port 5432 (PostgreSQL, if remote access needed)

---

## Monitoring & Logs

### IIS Logs
Located in: `C:\inetpub\logs\LogFiles`

### Django Logs
Configure in settings.py:

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': 'C:\\logs\\django_errors.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
```

---

## Backup Strategy

### Automated Database Backups

Create PowerShell script `backup.ps1`:

```powershell
$date = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = "C:\backups\house_of_hair_$date.sql"

& "C:\Program Files\PostgreSQL\16\bin\pg_dump.exe" `
    -h localhost `
    -U house_of_hair `
    -d house_of_hair_db `
    -F c `
    -f $backupFile

# Keep only last 30 days
Get-ChildItem "C:\backups\*.sql" | 
    Where-Object {$_.LastWriteTime -lt (Get-Date).AddDays(-30)} | 
    Remove-Item
```

Schedule with Task Scheduler to run daily.

---

## Cost Comparison

### Fasthosts Windows Hosting
- Shared: ~£10-20/month
- VPS: ~£30-50/month
- Full control, no per-request charges

### vs Render
- Free tier: Limited, sleeps after inactivity
- Paid: $7/month + database costs
- Can get expensive with traffic

**Recommendation:** Use your Fasthosts server if you already have it!

---

## Troubleshooting

### Common Issues

**500 Internal Server Error**
- Check IIS logs
- Verify Python path in web.config
- Ensure all dependencies installed

**Database Connection Failed**
- Check PostgreSQL is running
- Verify credentials in .env
- Check firewall allows connection

**Static Files Not Loading**
- Run `collectstatic`
- Configure IIS to serve /static/ folder
- Check file permissions

**CORS Errors**
- Verify Vercel URL in CORS_ALLOWED_ORIGINS
- Check ALLOWED_HOSTS includes your domain

---

## Security Checklist

- [ ] DEBUG = False in production
- [ ] Strong SECRET_KEY generated
- [ ] Database password is secure
- [ ] SSL certificate installed
- [ ] HTTPS redirect enabled
- [ ] Firewall configured
- [ ] Regular backups scheduled
- [ ] Admin password is strong
- [ ] Email credentials secured
- [ ] .env file not in git

---

## Support

For Fasthosts-specific issues:
- Fasthosts Support: https://www.fasthosts.co.uk/support
- IIS Documentation: https://docs.microsoft.com/iis

For Django deployment:
- Django Deployment Checklist: https://docs.djangoproject.com/en/stable/howto/deployment/checklist/
