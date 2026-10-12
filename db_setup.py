from schemas.postgredb_schema import Base, Engine
from schemas.postgredb_schema import Users, Sessions, ChatMessages, AuditLogs

Base.metadata.create_all(Engine)
print("Database tables verified/created successfully.")
