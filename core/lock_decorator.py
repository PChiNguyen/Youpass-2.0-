# core/lock_decorator.py
import functools
import logging
from typing import Any, Callable

from fastapi import HTTPException, status

from core.redis import get_redis_client

logger = logging.getLogger(__name__)


def distributed_lock(
    lock_key_pattern: str,
    timeout: int = 10,
    blocking_timeout: float = 2.0,
) -> Callable:
    """
    Reusable decorator to enforce Redis Distributed Locking on critical backend operations.
    """
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            try:
                formatted_key = lock_key_pattern.format(**kwargs)
            except (KeyError, IndexError):
                formatted_key = lock_key_pattern

            redis_db = get_redis_client()
            lock = redis_db.lock(
                name=formatted_key,
                timeout=timeout,
                blocking_timeout=blocking_timeout,
            )

            logger.info(f"🔒 [REDIS LOCK] Attempting to acquire lock for key: '{formatted_key}'...")

            acquired = lock.acquire(blocking=True)
            if not acquired:
                logger.warning(f"❌ [REDIS LOCK FAILED] Lock busy for key: '{formatted_key}'. Returning 409 Conflict.")
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Resource is currently being updated by another process. Please try again.",
                )

            logger.info(f"✅ [REDIS LOCK ACQUIRED] Lock secured for key: '{formatted_key}'. Executing target function...")
            try:
                return func(*args, **kwargs)
            finally:
                try:
                    if lock.owned():
                        lock.release()
                        logger.info(f"🔓 [REDIS LOCK RELEASED] Key: {formatted_key}")
                except Exception as err:
                    logger.warning(f"⚠️ [REDIS LOCK WARNING] Could not release key '{formatted_key}': {err}")

        return wrapper

    return decorator