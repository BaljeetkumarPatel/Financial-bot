# 💰 Financial Bot

An intelligent financial management application powered by AI that helps users manage their finances, create budgets, track expenses, analyze financial statements, and receive personalized financial advice.

**Live Demo:** [financial-bot-beige.vercel.app](https://financial-bot-beige.vercel.app)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Usage Guide](#usage-guide)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

Financial Bot is a full-stack web application designed to empower individuals with intelligent financial management tools. By combining AI-powered chatbots, data analysis, and intuitive visualizations, users can gain comprehensive control over their finances.

The application leverages modern AI models (Google Generative AI & OpenAI) to understand financial documents and provide personalized advice. It supports features like PDF statement analysis, budget planning, expense tracking, tax optimization, and real-time financial insights.

---

## ✨ Features

### 🤖 AI-Powered Chatbot
- Real-time financial advice powered by Google Generative AI and OpenAI
- Natural language processing for financial queries
- Context-aware responses based on user financial data
- Multi-turn conversation support

### 📊 Financial Dashboard
- Real-time financial metrics and KPIs
- Interactive charts and visualizations using Recharts
- Expense tracking and categorization
- Net worth calculation and trends

### 📄 Statement Analysis
- PDF statement upload and processing
- Automatic extraction of financial data from bank statements
- OCR-powered text recognition using pytesseract
- Financial statement parsing and analysis

### 💼 Budget Management
- Create and manage monthly/yearly budgets
- Category-wise budget allocation
- Budget vs. actual spending comparison
- Alert system for budget overruns

### 🔐 Tax Planning
- Tax deduction calculator
- Tax compliance guidance
- Financial strategy recommendations for tax optimization
- Year-round tax planning assistance

### 👤 User Profile Management
- Secure user authentication with JWT
- Password encryption using bcrypt
- User preferences and settings
- Account management

### 📈 Financial Analytics
- Spending patterns analysis
- Income trend visualization
- Financial goal tracking
- Report generation and export

---

## 📸 Screenshots

Below are the key screenshots showcasing the Financial Bot interface and features:

### 1. Dashboard Overview
![Dashboard Overview](./Screenshot/Screenshot%202026-05-05%20225619.png)
*Main financial dashboard displaying key metrics and overview*

### 2. Financial Analytics
![Financial Analytics](./Screenshot/Screenshot%202026-05-05%20225917.png)
*Detailed financial analytics and insights*

### 3. Budget Management
![Budget Management](./Screenshot/Screenshot%202026-05-05%20230247.png)
*Budget creation and tracking interface*

### 4. Expense Tracking
![Expense Tracking](./Screenshot/Screenshot%202026-05-05%20230335.png)
*Expense categorization and visualization*

### 5. AI Chatbot Interface
![AI Chatbot](./Screenshot/Screenshot%202026-05-05%20230616.png)
*AI-powered financial advice chatbot*

### 6. Statement Analysis
![Statement Analysis](./Screenshot/Screenshot%202026-05-05%20230648.png)
*PDF statement upload and processing interface*

### 7. Tax Planning Tool
![Tax Planning](./Screenshot/Screenshot%202026-05-05%20230715.png)
*Comprehensive tax planning and deduction calculator*

### 8. Financial Goals & Settings
![Settings & Goals](./Screenshot/Screenshot%202026-05-06%20003355.png)
*User profile, financial goals, and application settings*

---

## 🛠️ Tech Stack

### Backend
**Framework & Runtime:**
- **FastAPI** - Modern, fast web framework for building APIs
- **Uvicorn** - ASGI web server
- **Gunicorn** - Production-ready application server

**Database:**
- **MongoDB** - NoSQL database for flexible data storage
- **Motor** - Async MongoDB driver

**AI & ML:**
- **Google Generative AI** - For advanced financial chatbot capabilities
- **OpenAI** - Alternative AI model for conversational AI
- **Transformers** - For NLP tasks
- **PyTorch** & **Accelerate** - Deep learning framework

**Document Processing:**
- **pdfplumber** - PDF text extraction
- **pdf2image** - PDF to image conversion
- **PyMuPDF** - Advanced PDF manipulation
- **pytesseract** - OCR text recognition
- **Pillow** - Image processing

**Authentication & Security:**
- **PyJWT** - JSON Web Token implementation
- **passlib[bcrypt]** - Password hashing

**Utilities:**
- **Pydantic** - Data validation and settings
- **python-dotenv** - Environment variable management
- **email-validator** - Email validation
- **requests** - HTTP client
- **python-multipart** - Multipart form data handling

### Frontend
**Framework & Build:**
- **React 19.1** - UI component library
- **Vite 7.1** - Fast build tool and dev server
- **React Router DOM 7.9** - Client-side routing

**Styling & UI:**
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **Tailwind CSS Vite Plugin** - Vite integration for Tailwind
- **Lucide React** - Beautiful SVG icon library
- **Framer Motion** - React animation library

**Data & Visualization:**
- **Recharts 3.3** - React charting library
- **Axios 1.13** - HTTP client for API calls

**Document Generation & Rendering:**
- **html2canvas** - Convert HTML to canvas/images
- **jsPDF** - PDF generation from DOM
- **react-markdown** - Markdown rendering in React
- **remark-gfm** - GitHub Flavored Markdown support
- **rehype-sanitize** - HTML sanitization

**Development Tools:**
- **ESLint** - Code quality and linting
- **Globals** - Global variable definitions
- **TypeScript types** - Type safety for React

### DevOps & Deployment
- **Vercel** - Frontend deployment platform
- **Docker** - Containerization (optional)

**Language Composition:**
- Python: 97.1%
- JavaScript: 1.5%
- C: 1.2%
- Cython: 0.1%
- PowerShell: 0.1%

---

## 📁 Project Structure

```
Financial-bot/
├── backend/
│   ├── app/
│   │   ├── auth/              # Authentication & authorization
│   │   ├── budget/            # Budget management module
│   │   ├── chatbot/           # AI chatbot integration
│   │   ├── dashboard/         # Dashboard API endpoints
│   │   ├── financial_manager/  # Core financial logic
│   │   ├── home/              # Home page API
│   │   ├── profile/           # User profile management
│   │   ├── routes/            # API route handlers
│   │   ├── services/          # Business logic services
│   │   ├── statement/         # PDF statement processing
│   │   ├── tax/               # Tax planning module
│   │   ├── usage/             # Usage tracking
│   │   ├── config.py          # Configuration settings
│   │   ├── db.py              # Database connections
│   │   ├── main.py            # FastAPI app initialization
│   │   └── models.py          # Pydantic data models
│   ├── requirements.txt       # Python dependencies
│   ├── package.json           # Node.js metadata (if needed)
│   └── venv/                  # Virtual environment
│
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service calls
│   │   ├── App.jsx           # Main App component
│   │   └── main.jsx          # Entry point
│   ├── public/               # Static assets
│   ├── index.html            # HTML template
│   ├── vite.config.js        # Vite configuration
│   ├── eslint.config.js      # ESLint configuration
│   ├── package.json          # Node dependencies
│   └── tailwind.config.js    # Tailwind CSS config
│
├── pdfforfinance/            # Finance RAG System
│   ├── backend/              # RAG backend services
│   ├── frontend/             # RAG frontend UI
│   └── *.pdf                 # Financial PDFs
│
├── Screenshot/               # Application screenshots
├── .gitignore
├── .gitattributes
└── README.md
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Python** 3.8+
- **Node.js** 16+ and npm
- **MongoDB** (local or MongoDB Atlas cloud database)
- **Git**

Optional:
- **Tesseract OCR** (for PDF text extraction)
- **Docker** (for containerization)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/BaljeetkumarPatel/Financial-bot.git
cd Financial-bot
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install Tesseract OCR (optional but recommended)
# On Windows: Download installer from https://github.com/UB-Mannheim/tesseract/wiki
# On macOS: brew install tesseract
# On Linux: sudo apt-get install tesseract-ocr
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file for frontend environment variables (if needed)
# See Configuration section below
```

---

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend/` directory:

```bash
# Database Configuration
MONGODB_URL=mongodb://localhost:27017
# Or use MongoDB Atlas:
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/financial_bot

# AI/LLM Configuration
GOOGLE_API_KEY=your_google_generative_ai_key
OPENAI_API_KEY=your_openai_api_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_ALGORITHM=HS256
JWT_EXPIRATION=86400  # 24 hours in seconds

# API Configuration
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# Tesseract Configuration (if using OCR)
PYTESSERACT_PATH=/path/to/tesseract  # Optional

# Environment
ENVIRONMENT=development  # or production
```

### Frontend Configuration

Create a `.env.local` file in the `frontend/` directory:

```bash
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

### Get API Keys

1. **Google Generative AI:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add to `.env`

2. **OpenAI:**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Add to `.env`

3. **MongoDB:**
   - Create account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster
   - Get connection string and add to `.env`

---

## ▶️ Running the Application

### Development Mode

#### Terminal 1 - Backend

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### Production Mode

#### Backend

```bash
cd backend
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000
```

#### Frontend

```bash
cd frontend
npm run build
npm run preview
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### User Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `DELETE /api/profile` - Delete user account

### Dashboard
- `GET /api/dashboard` - Get dashboard metrics
- `GET /api/dashboard/summary` - Financial summary

### Budget
- `GET /api/budget` - Get all budgets
- `POST /api/budget` - Create new budget
- `PUT /api/budget/{id}` - Update budget
- `DELETE /api/budget/{id}` - Delete budget

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Add new expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense

### Financial Manager
- `GET /api/financial-manager/net-worth` - Calculate net worth
- `GET /api/financial-manager/analytics` - Financial analytics

### Statement Processing
- `POST /api/statement/upload` - Upload and process statement
- `GET /api/statement/{id}` - Get statement details

### Tax Planning
- `GET /api/tax/deductions` - Tax deduction calculator
- `POST /api/tax/plan` - Generate tax plan

### Chatbot
- `POST /api/chatbot/query` - Send message to AI chatbot
- `GET /api/chatbot/history` - Get conversation history

### Usage
- `GET /api/usage` - Get API usage statistics

---

## 📖 Usage Guide

### 1. Sign Up
- Visit the application homepage
- Click on "Sign Up"
- Enter email and create password
- Verify email if required

### 2. Complete Profile
- Go to Profile section
- Fill in personal and financial information
- Set financial goals
- Save preferences

### 3. Upload Statement
- Navigate to "Statement Analysis"
- Upload your bank/investment statement (PDF)
- Wait for processing and analysis
- Review extracted data

### 4. Create Budget
- Go to "Budget" section
- Set monthly budget
- Allocate funds by category
- Set budget alerts

### 5. Track Expenses
- Log daily expenses or upload statements
- Categorize transactions
- Monitor spending vs budget
- View spending trends

### 6. Analyze Finances
- Check Financial Dashboard
- Review charts and metrics
- View Net Worth calculation
- Export reports

### 7. Get Financial Advice
- Open AI Chatbot
- Ask financial questions
- Get personalized recommendations
- Plan taxes and investments

---

## 🏗️ Architecture

### Backend Architecture

```
FastAPI Application
├── Routes Layer (API Endpoints)
├── Services Layer (Business Logic)
├── Models Layer (Data Validation)
└── Database Layer (MongoDB Integration)
    └── Collections:
        ├── users
        ├── budgets
        ├── expenses
        ├── statements
        ├── financial_goals
        └── transactions
```

### Data Flow

```
User Request
    ↓
Frontend (React)
    ↓
API Call (Axios)
    ↓
Backend Routes (FastAPI)
    ↓
Services (Business Logic)
    ↓
MongoDB (Data Persistence)
    ↓
AI Models (Analysis & Recommendations)
    ↓
Response → Frontend → UI Update
```

### Authentication Flow

```
User Login
    ↓
Verify Credentials
    ↓
Generate JWT Token
    ↓
Store Token (Frontend)
    ↓
Include Token in API Headers
    ↓
Validate Token (Middleware)
    ↓
Grant Access to Protected Routes
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
   ```bash
   git clone https://github.com/BaljeetkumarPatel/Financial-bot.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow PEP 8 for Python code
   - Follow ESLint rules for JavaScript
   - Write clear, descriptive commit messages

4. **Test your changes**
   ```bash
   # Backend tests
   pytest tests/
   
   # Frontend tests
   npm test
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "Add: description of your changes"
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Describe the changes clearly
   - Reference related issues
   - Ensure all tests pass

---

## 📝 License

This project is open source and available under the MIT License. See the LICENSE file for more details.

---

## 📞 Support & Contact

- **GitHub Issues:** [Report bugs here](https://github.com/BaljeetkumarPatel/Financial-bot/issues)
- **GitHub Discussions:** [Ask questions here](https://github.com/BaljeetkumarPatel/Financial-bot/discussions)
- **Author:** Baljeenkumar Patel
- **Live Demo:** [financial-bot-beige.vercel.app](https://financial-bot-beige.vercel.app)

---

## 🙏 Acknowledgments

- FastAPI for the excellent web framework
- React and Vite for modern frontend tooling
- MongoDB for flexible data storage
- Google Generative AI and OpenAI for AI capabilities
- All open-source contributors

---

## 🔄 Recent Updates

**Version 0.0.1 - Initial Release**
- ✅ Core FastAPI backend setup
- ✅ React + Vite frontend
- ✅ MongoDB integration
- ✅ JWT authentication
- ✅ AI Chatbot integration (Google Generative AI & OpenAI)
- ✅ PDF statement processing with OCR
- ✅ Budget management system
- ✅ Financial dashboard with visualizations
- ✅ Expense tracking and categorization
- ✅ Tax planning tools
- ✅ User profile management
- ✅ Finance RAG System (pdfforfinance)
- ✅ Application screenshots and documentation

---

**Happy Financial Management! 💼✨**
