# core/rate_limiter.py
from fastapi import HTTPException, Request, Depends
import redis
from core.redis import get_redis_client

class RateLimiter:
    def __init__(self, requests_limit: int = 3, window_seconds: int = 20):
        self.requests_limit = requests_limit
        self.window_seconds = window_seconds

    def __call__(self, request: Request, redis_db: redis.Redis = Depends(get_redis_client)):
        # Xác định IP client và endpoint route
        client_ip = request.client.host if request.client else "unknown"
        rate_key = f"rate_limit:{client_ip}:{request.url.path}"

        # Tăng số lượng request trong Redis
        request_count = redis_db.incr(rate_key)

        # Đặt thời gian hết hạn cho lần request đầu tiên
        if request_count == 1:
            redis_db.expire(rate_key, self.window_seconds)

        # Chặn request nếu vượt quá giới hạn
        if request_count > self.requests_limit:
            ttl = redis_db.ttl(rate_key)
            
            # 1. TẠO THÔNG BÁO LỖI
            log_message = f"🚫 [ANTI-SPAM TRIGGERED] IP {client_ip} bị chặn do spam route {request.url.path}. Vui lòng thử lại sau {ttl} giây!"
            
            # 2. IN RA CONSOLE SERVER (RENDER LOGS SẼ THẤY DÒNG NÀY)
            print(log_message)

            # 3. TRẢ LỖI VỀ BÊN CLIENT (BROWSER / POSTMAN)
            raise HTTPException(
                status_code=429,
                detail=log_message
            )