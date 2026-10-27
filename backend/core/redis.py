# core/redis.py
import os
import redis

# Reads REDIS_URL from Render/Docker env, or defaults to local redis
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# Single, reusable Redis connection client
redis_client = redis.from_url(REDIS_URL, decode_responses=True)

def get_redis_client() -> redis.Redis:
    """FastAPI Dependency to inject Redis client into routes."""
    return redis_client