#!/bin/bash

# Dừng kịch bản ngay lập tức nếu có lệnh bị lỗi
set -e

# 1. Tự động kiểm tra và tạo bảng trong Neon DB nếu chưa có
echo "🚀 Checking and creating database tables..."
python -c "import main; print('✅ All tables verified in Neon!')"

# 2. Khởi chạy Celery Worker ở chế độ chạy ngầm (chú ý dấu & ở cuối)
echo "⚡ Starting Celery Worker process..."
celery -A core.celery_app worker --pool=gevent --loglevel=info &

# 3. Khởi chạy FastAPI Web Server ở tiến trình chính
echo "🌐 Starting FastAPI Server..."
exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}  