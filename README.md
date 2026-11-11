# TransportPro – Transport Agency Management System

TransportPro is a full-featured web-based transport management ERP designed for Indian goods transport agencies.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, React Router, Lucide Icons
- **Backend**: Python 3.11, Django 4.2+, Django REST Framework, WhiteNoise, Gunicorn
- **Database**: PostgreSQL
- **Deployment**: Docker Compose / Vercel (frontend) + Render/Fly.io/AWS (backend)

## Architecture

- **Multi-Agency Isolation**: Every query and business record is scoped by `agency` foreign key.
- **REST API**: All endpoints located under `/api/v1/`.
- **Token Auth**: Standard DRF token authentication (`Token <token>`).

## Quick Start (Docker)

```bash
# 1. Clone repository
git clone https://github.com/AbhiSingh109/TranportPro.git
cd TranportPro

# 2. Copy env template
cp backend/.env.example backend/.env

# 3. Launch full stack
docker compose up --build
```

- Frontend: http://localhost:80
- Backend API: http://localhost:8000/api/v1/
- Django Admin: http://localhost:8000/admin/

## Local Development (Without Docker)

### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate   # Windows
# source venv/bin/activate # Linux/Mac
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000 and proxies `/api` calls to http://localhost:8000.

## Modules

1. **Dashboard**: Live analytics (revenue, expenses, active trips, deliveries).
2. **Bookings**: End-to-end booking lifecycle (Draft → Delivered). Auto-generated booking numbers.
3. **Trips**: Multi-consignment trips with vehicle and driver assignment + dispatch validation.
4. **Fleet**: Vehicle documents, expiry tracking, ownership types, maintenance status.
5. **Drivers**: Driver profiles, licences, emergency contacts, assignment status.
6. **Customers**: Consignor/consignee management, credit limits, GSTIN.
7. **Tracking**: Event-based tracking history + public tracking endpoint via LR number.
8. **Billing & Invoices**: Freight invoices with auto GST calculations, payments, outstanding balance.
9. **Expenses**: Trip-wise and general expense recording across fuel, toll, allowance, etc.
10. **Reports**: Revenue, expense breakdown, and outstanding balance aggregation.
11. **Notifications**: Multi-channel notification logs (Email, WhatsApp, In-App).

## Vercel Deployment

Connect this repository to Vercel. Set `frontend` as root or use the included `vercel.json` at root.
Set `VITE_API_URL` to your production backend API URL (e.g. `https://api.yourdomain.com/api/v1`).

