from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth_routes import AUTH_ROUTER
from routes.chat_routes import CHAT_ROUTER
from middleware.authenticate_user import AuthContextMiddleware

server = FastAPI(title="Directive Server", version="0.1.0")

server.add_middleware(AuthContextMiddleware)

server.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

server.include_router(AUTH_ROUTER)
server.include_router(CHAT_ROUTER)