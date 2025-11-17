Django REST API and Angular frontend application for tracking portfolio values over time.

## Features

- **Portfolio Management**: Create and manage investment portfolios with client information
- **Holdings Management**: Add/remove holdings (stocks, bonds, cash, ETFs, etc.) to portfolios
- **Valuation Snapshots**: Capture portfolio values (Assets Under Management) at specific dates
- **AUM Calculation**: Automatic calculation of total portfolio value using Decimal precision
- **Status Workflow**: Support for DRAFT → CONFIRMED → ARCHIVED status transitions
- **RESTful API**: Complete REST API with filtering and querying capabilities
- **Modern Frontend**: Angular application with Akita state management and DaisyUI
<img width="1663" height="932" alt="Screenshot 2025-11-14 at 15 43 56" src="https://github.com/user-attachments/assets/a39f977c-0d5f-414f-9a36-d898571bcfe1" />
<img width="1658" height="926" alt="Screenshot 2025-11-14 at 15 45 17" src="https://github.com/user-attachments/assets/785783d0-71e9-4f05-a457-00c2861240ed" />

## Tech Stack

### Backend
- Django
- PostgreSQL
- Pytest for testing

### Frontend
- Angular 17
- Akita for state management
- DaisyUI (Tailwind CSS)
- TypeScript
- RxJS for reactive programming

### Infrastructure
- Docker & Docker Compose
- PostgreSQL database
<img width="1671" height="914" alt="Screenshot 2025-11-14 at 15 46 19" src="https://github.com/user-attachments/assets/f6fc2928-95ac-4f37-aa3c-f88837af7bcf" />

## Setup Instructions

### Prerequisites
- Docker and Docker Compose installed
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aduda-Shem/Portfolio-Valuation.git
   cd Portfolio_Valuation
   ```

2. **Start the services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/v1/
   - Swagger UI: http://localhost:8000/swagger/
   - ReDoc: http://localhost:8000/redoc/
   - Django Admin: http://localhost:8000/admin/
   - PgAdmin: http://localhost:5050 (admin@portfolio.com / admin123)
<img width="1546" height="826" alt="Screenshot 2025-11-14 at 22 24 22" src="https://github.com/user-attachments/assets/805dce74-cbff-47fd-b64f-c57fc1c4e8fb" />

### Manual Setup (Without Docker)

#### Backend Setup

1. **Create virtual environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   SECRET_KEY=secret-key
   DEBUG=True
   POSTGRES_DB=portfolio_db
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run server**
   ```bash
   python manage.py runserver
   ```

#### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file in the frontend:
   ```env
   NG_APP_API_URL=http://localhost:8000/api/v1
   ```
   
3. **Run development server**
   ```bash
   npm start
   ```

   The application will be available at http://localhost:3000

## Running Tests

### Backend Tests
```bash
cd backend
pytest
```

For coverage report:
```bash
pytest --cov=portfolio --cov-report=html
```
