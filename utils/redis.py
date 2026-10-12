import redis

from brain.config import ENVIRONMENT_VARIABLES


redis_client = redis.Redis(
    host=ENVIRONMENT_VARIABLES.REDIS_HOST,
    port=ENVIRONMENT_VARIABLES.REDIS_PORT,
    decode_responses=True,
    username="default",
    password=ENVIRONMENT_VARIABLES.REDIS_PASSWORD,
)
