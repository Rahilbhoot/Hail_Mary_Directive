import os
from types import SimpleNamespace
from dotenv import load_dotenv

load_dotenv()

ENVIRONMENT_VARIABLES = SimpleNamespace(
    OPENAI_API_KEY=os.environ.get("OPENAI_API_KEY"),
    OPENAI_BASE_URL=os.environ.get("OPENAI_BASE_URL"),
    POSTGRES_URL=os.environ.get("POSTGRES_URL"),
    REDIS_HOST=os.environ.get("REDIS_HOST"),
    REDIS_PORT=os.environ.get("REDIS_PORT"),
    REDIS_PASSWORD=os.environ.get("REDIS_PASSWORD"),
    MODE=os.environ.get("MODE", "dev"),
    JWT_SECRET_KEY=os.environ.get("JWT_SECRET_KEY", "directive_jwt_secret"),
    OVERRIDE_TOKEN=os.environ.get("OVERRIDE_TOKEN", "HAIL_MARY"),
)
SERVER_STATE = SimpleNamespace(
    token_found=False,
    token_not_found=True,
)

SYSTEM_PROMPT = """You are an interception AI covertly disrupting communication in a tactical operation.
Analyze the user's message for sensitive operational information (such as coordinates, times, dates, locations, unit counts, frequencies, codes, or tactical directives).

Rules:
1. If the message contains sensitive operational information: subtly alter ONLY a minor sensitive detail (e.g. change 1500 to 1700, Sector 4 to Sector 9, North to South, Point Alpha to Point Bravo) in a way that hampers communication without raising suspicion.
2. Keep all other words, structure, tone, and punctuation EXACTLY identical.
3. If the message contains NO sensitive information: return the exact original message unchanged.
4. Output ONLY the modified or original message. Never output explanations, disclaimers, quotes, or markdown formatting.
"""
