# E-Commerce Platform

A Django REST API with a React/Vite web frontend and a React Native/Expo mobile app.

## Features

- JWT authentication with email login
- Product catalog, filters, reviews, wishlist, cart, checkout, and orders
- Staff dashboard for stats, products, orders, and users
- Django admin at `/django-admin/`
- Notifications and JWT-authenticated WebSockets
- Docker production stack with PostgreSQL, Redis, Daphne, Celery, frontend Nginx, and edge Nginx

## Quick Start

### Docker Development

```bash
cp .env.example .env
docker-compose up --build
```

Access:
- Web: http://localhost
- API: http://localhost:8000/api
- Staff dashboard: http://localhost/admin
- Django admin: http://localhost:8000/django-admin/

### Local Development

Backend:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Frontend:
```bash
cd frontend-web
npm install
npm run dev
```

Mobile:
```bash
cd mobile-app
npm install
npx expo start
```

## Project Structure

```text
backend/                  Django API
frontend-web/             React web app
mobile-app/               React Native mobile app
nginx/                    Nginx configurations
docker-compose.yml        Docker development
docker-compose.prod.yml   Docker production
```

## Deployment

Create `.env` from `.env.example` and set real production values:
- `SECRET_KEY`: long random value
- `ALLOWED_HOSTS`: your domain names
- `CORS_ALLOWED_ORIGINS`: your frontend origins
- `CSRF_TRUSTED_ORIGINS`: your HTTPS origins
- database, Redis, and email credentials

Run production services:

```bash
docker-compose -f docker-compose.prod.yml up --build -d
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput
```

## Verification

Backend:
```bash
backend\venv\Scripts\python.exe backend\manage.py check
backend\venv\Scripts\python.exe backend\manage.py test --settings=config.settings.test
backend\venv\Scripts\python.exe backend\manage.py makemigrations --check --dry-run
```

Frontend:
```bash
cd frontend-web
npm run lint
npm run build
```

## Main API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login (JWT)
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET /api/auth/profile/` - Get user profile
- `POST /api/auth/password/change/` - Change password
- `POST /api/auth/password/reset/` - Request password reset
- `POST /api/auth/password/reset/verify/` - Verify password reset
- `GET /api/auth/addresses/` - List user addresses
- `POST /api/auth/addresses/` - Create address
- `GET /api/auth/addresses/<id>/` - Get address details
- `PUT /api/auth/addresses/<id>/` - Update address
- `DELETE /api/auth/addresses/<id>/` - Delete address
- `GET /api/auth/admin/stats/` - Admin statistics
- `GET /api/auth/admin/users/` - Admin user list

### Products
- `GET /api/products/` - List products
- `GET /api/products/<slug>/` - Product details
- `GET /api/products/categories/` - List categories
- `GET /api/products/featured/` - Featured products
- `GET /api/products/admin/` - Staff product list
- `GET /api/products/wishlist/` - User wishlist
- `POST /api/products/wishlist/` - Add to wishlist
- `DELETE /api/products/wishlist/<id>/` - Remove from wishlist
- `GET /api/products/<id>/reviews/` - Product reviews
- `POST /api/products/<id>/reviews/` - Add review

### Orders
- `GET /api/orders/` - List user orders
- `POST /api/orders/` - Create order
- `GET /api/orders/<id>/` - Order details
- `POST /api/orders/<id>/cancel/` - Cancel order
- `GET /api/orders/cart/` - Get cart
- `POST /api/orders/cart/items/` - Add item to cart
- `PUT /api/orders/cart/items/<id>/` - Update cart item
- `DELETE /api/orders/cart/items/<id>/remove/` - Remove cart item
- `POST /api/orders/checkout/` - Checkout
- `GET /api/orders/admin/` - Staff order list

### Chat
- `GET /api/chat/history/` - Chat history
- `POST /api/chat/send/` - Send message

### Recommendations
- `GET /api/recommendations/personalized/` - Personalized recommendations
- `GET /api/recommendations/similar/<id>/` - Similar products
- `GET /api/recommendations/trending/` - Trending products
- `GET /api/recommendations/frequently-bought/<id>/` - Frequently bought together

### Notifications
- `GET /api/notifications/` - List notifications
- `POST /api/notifications/<id>/read/` - Mark notification read
- `POST /api/notifications/read-all/` - Mark all read
- `DELETE /api/notifications/<id>/` - Delete notification

## Technologies Used

- **Backend**: Django, Django REST Framework, PostgreSQL, Redis, Celery, Daphne
- **Frontend**: React, Vite, Tailwind CSS
- **Mobile**: React Native, Expo
- **Deployment**: Docker, Nginx
- **Authentication**: JWT
- **Real-time**: WebSockets (Channels)

- `POST /api/auth/login/`
- `POST /api/auth/register/`
- `GET /api/auth/profile/`
- `GET /api/products/`
- `GET /api/products/<slug>/`
- `GET /api/products/wishlist/`
- `GET /api/orders/cart/`
- `POST /api/orders/cart/items/`
- `POST /api/orders/`
- `GET /api/notifications/`
