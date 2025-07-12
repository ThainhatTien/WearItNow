# 🚀 Quick Setup Guide

## Vấn đề GitHub Secret Scanning đã được giải quyết! ✅

### Bước 1: Tạo file `.env` local
```bash
cp env.example .env
```

### Bước 2: Cập nhật `.env` với thông tin thực tế
```bash
# Chỉnh sửa file .env với credentials thực tế
nano .env
```

### Bước 3: Chạy ứng dụng
```bash
mvn spring-boot:run
```

## 📋 Những gì đã thay đổi:

✅ **Tạo `.gitignore`** - Bảo vệ sensitive files  
✅ **Environment Variables** - Tất cả credentials giờ dùng env vars  
✅ **Template `env.example`** - Hướng dẫn setup cho team  
✅ **Spring Dotenv Support** - Tự động load `.env` file  
✅ **Documentation** - Hướng dẫn chi tiết trong `SECURITY_SETUP.md`  

## 🔐 Quan trọng:
- **KHÔNG** commit file `.env` vào git
- **LUÔN** sử dụng environment variables cho sensitive data
- **REVOKE** Google OAuth credentials cũ nếu đã bị expose

## 📖 Đọc thêm:
- Chi tiết: `SECURITY_SETUP.md`
- GitHub Secrets setup cho production
- Cách xử lý khi bị GitHub chặn push

---
*Bây giờ bạn có thể push code an toàn! 🎉* 