from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth.routes import router as auth_router
from app.chatbot.routes import router as chatbot_router
from app.budget.routes import router as budget_router
from app.statement.routes import router as statement_router
from app.tax.routes import router as tax_router
from app.financial_manager.routes import router as financial_manager_router
from app.routes.dashboard_routes import router as dashboard_router
from app.profile import routes_profile
from app.dashboard.routes_forecast import router as forecast_router
from app.usage.routes_usage import router as usage_router


app = FastAPI(title="Secure Banking Auth API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chatbot_router)
app.include_router(budget_router)
app.include_router(statement_router, prefix="/statement", tags=["Statement Analysis"])
app.include_router(tax_router)
app.include_router(financial_manager_router)
app.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(routes_profile.router, prefix="/profile", tags=["Profile"])
app.include_router(forecast_router)
app.include_router(forecast_router, tags=["AI Forecast"])
app.include_router(usage_router)