from schemas.postgredb_schema import Base, Engine
from schemas.postgredb_schema import Users, GameSessions, ChatMessages

Base.metadata.create_all(Engine)
print("Database tables verified/created successfully.")
