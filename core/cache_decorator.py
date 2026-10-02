# core/cache_decorator.py
import functools
import json
import hashlib
import os
import logging
from dataclasses import is_dataclass, asdict
from typing import Callable, Any, List
from core.redis import get_redis_client

# Configure logger to output directly to Uvicorn's stdout stream
logger = logging.getLogger("uvicorn.error")


def cache_response(prefix: str, ttl: int = 3600, use_hash: bool = False):
    """
    Unified reusable decorator to cache any function output in Redis.
    """
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            # 🟢 BYPASS REDIS IN TEST ENVIRONMENT, SO THAT IT RUNS FASTER  
            if os.getenv("TESTING", "False").lower() in ("true", "1"):
                return func(*args, **kwargs)

            redis_db = get_redis_client()

            # 1. Collect arguments
            start_idx = 1 if args and hasattr(args[0], '__class__') and not isinstance(args[0], (str, int, float, dict, list)) else 0
            clean_args = [str(arg) for arg in args[start_idx:]]
            clean_kwargs = [f"{k}={v}" for k, v in sorted(kwargs.items())]
            param_string = ":".join(clean_args + clean_kwargs)

            # 2. Build Cache Key
            if use_hash:
                hashed_params = hashlib.sha256(param_string.encode("utf-8")).hexdigest()
                cache_key = f"{prefix}:{hashed_params}"
            else:
                cache_key = f"{prefix}:{param_string}".strip(":")

            # 3. CACHE HIT CHECK
            try:
                cached_data = redis_db.get(cache_key)
                if cached_data:
                    logger.info(f"⚡ [REDIS HIT]: Serving from cache -> {cache_key}")
                    return json.loads(cached_data)
            except Exception as e:
                logger.warning(f"⚠️ [REDIS WARNING]: Failed to read cache: {e}")

            # 4. CACHE MISS -> Execute original function
            logger.info(f"🐢 [REDIS MISS]: Fetching from DB -> {cache_key}")
            result = func(*args, **kwargs)

            if result is None:
                return None  

            # 5. Automatic Serialization
            if isinstance(result, list):
                serialized = []
                for item in result:
                    if is_dataclass(item):
                        serialized.append(asdict(item))
                    elif hasattr(item, '__table__'):
                        serialized.append({c.name: getattr(item, c.name) for c in item.__table__.columns})
                    else:
                        serialized.append(item)
            elif is_dataclass(result):
                serialized = asdict(result)
            elif hasattr(result, '__table__'):
                serialized = {c.name: getattr(result, c.name) for c in result.__table__.columns}
            else:
                serialized = result

            # 6. Save into Redis
            try:
                redis_db.setex(
                    name=cache_key,
                    time=ttl,
                    value=json.dumps(serialized, default=str)
                )
            except Exception as e:
                logger.warning(f"⚠️ [REDIS WARNING]: Failed to write cache: {e}")

            return serialized

        return wrapper
    return decorator


def invalidate_cache(prefixes: List[str]):
    """
    Decorator to automatically clear Redis cache keys matching given prefixes.
    """
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            # 1. Run the database mutation first
            result = func(*args, **kwargs)

            # BYPASS REDIS IN TEST ENVIRONMENT
            if os.getenv("TESTING", "False").lower() in ("true", "1"):
                return result

            # 2. If mutation succeeded, clear matching Redis keys
            try:
                redis_db = get_redis_client()
                for prefix in prefixes:
                    keys_to_delete = list(redis_db.scan_iter(match=f"{prefix}*"))
                    if keys_to_delete:
                        redis_db.delete(*keys_to_delete)
                        logger.info(f"🧹 [REDIS INVALIDATE]: Deleted {len(keys_to_delete)} keys matching prefix '{prefix}*'")
                    else:
                        logger.info(f"ℹ️ [REDIS INVALIDATE]: No cached keys found matching prefix '{prefix}*'")
            except Exception as e:
                logger.warning(f"⚠️ [REDIS WARNING]: Failed to invalidate cache: {e}")

            return result
        return wrapper
    return decorator