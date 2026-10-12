from schemas.postgredb_schema import Base, Engine
from schemas.postgredb_schema import Users, ChatMessages, Sessions

Base.metadata.create_all(Engine)