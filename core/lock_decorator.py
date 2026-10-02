import functools
import logging
from typing import Callable, Any  
from fastapi import HTTPException, status
from core.redis import get_redis_client

# Configure logger for standard output logging
logger = logging.getLogger(__name__)
# the high-quality print statements=)) 


def distributed_lock(
    lock_key_pattern: str, 
    timeout: int = 10, 
    blocking_timeout: float = 2.0
) -> Callable: # this is a decorator factory that returns a function
# which means a function returns another function
    """
    Reusable decorator to enforce Redis Distributed Locking on critical backend operations.
    
    Args:
        lock_key_pattern (str): Key template in Redis (e.g., "lock:score:{score_id}").
        timeout (int): Auto-expiration time in seconds (safety net against deadlocks).
        blocking_timeout (float): Max seconds to wait to acquire the lock before failing.
    """
    def decorator(func: Callable) -> Callable:  # receives the target function we want to protect (e.g., update_score)
        @functools.wraps(func)  # preserves the original function's name and documentation
        def wrapper(*args, **kwargs) -> Any:  # runs on every API request and accepts all positional (*args) and keyword (**kwargs) inputs
            # 1. Dynamically build the lock key using kwargs
            try:
                formatted_key = lock_key_pattern.format(**kwargs)  # fills in placeholders like {score_id} with actual values from kwargs
            except (KeyError, IndexError):
                formatted_key = lock_key_pattern  # fallback to the raw pattern string if {score_id} isn't found in kwargs
                # if it falls back, still ok, just a bit less efficient but it's not a big deal 

            redis_db = get_redis_client()# get the Redis client

            
            # 2. Instantiate the Redis Lock object with safety parameters
            lock = redis_db.lock(
                name=formatted_key,  # unique Redis key name for this specific resource (e.g., "lock:score:123")
                timeout=timeout,  # auto-deletes the lock after X seconds to prevent infinite stuck keys if the server crashes
                blocking_timeout=blocking_timeout  # max seconds a new request waits in line for the lock before returning an error
            )

           # 3. Try to acquire the lock
            logger.info(f"🔒 [REDIS LOCK] Attempting to acquire lock for key: '{formatted_key}'...")
            
            acquired = lock.acquire(blocking=True)
            if not acquired:
                logger.warning(f"❌ [REDIS LOCK FAILED] Lock busy for key: '{formatted_key}'. Returning 409 Conflict.")
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Resource is currently being updated by another process. Please try again."
                )

            # Success confirmation log!
            logger.info(f"✅ [REDIS LOCK ACQUIRED] Lock secured for key: '{formatted_key}'. Executing target function...")
            # 4. Execute function and ensure lock release
            try:
                return func(*args, **kwargs)
        ## we use both *args and **kwargs to pass in the arguments to the function to make sure
        ## that the function can be called with either positional or keyword arguments
            finally:
                try:
                    if lock.owned():## checking if the lock is still
                        ## owned before releasing it to avoid releasing a lock that is not owned by the current process

                        lock.release() ## releasing the lock after the function has been executed
                        logger.info(f"🔓 [REDIS LOCK RELEASED] Key: {formatted_key}")
                except Exception as err:
                    logger.warning(f"⚠️ [REDIS LOCK WARNING] Could not release key '{formatted_key}': {err}")

        return wrapper
    return decorator