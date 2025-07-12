# Hướng dẫn Setup Bảo mật cho WearItNow Backend

## 🔒 Vấn đề GitHub Secret Scanning

GitHub Secret Scanning đã phát hiện **Google OAuth Client ID và Client Secret** trong file `application.properties` và chặn push để bảo vệ bảo mật.

### Tại sao bị chặn?
- GitHub tự động quét tất cả commits để tìm credentials
- Phát hiện patterns khớp với Google OAuth credentials
- Push bị chặn để ngăn chặn việc lộ sensitive information

## 🛡️ Giải pháp đã triển khai

### 1. Tạo `.gitignore` toàn diện
- Bảo vệ các file environment variables (`.env*`)
- Loại trừ build artifacts và IDE files
- Ngăn chặn commit nhầm sensitive files

### 2. Sử dụng Environment Variables
Tất cả sensitive information giờ đây sử dụng environment variables:

```properties
# Thay vì hardcode
spring.datasource.password=my_secret_password

# Sử dụng environment variables
spring.datasource.password=${MYSQL_PASSWORD:}
```

### 3. Template Environment Variables
File `env.example` chứa template cho tất cả environment variables cần thiết.

## 🚀 Cách setup cho Development

### Bước 1: Tạo file `.env` local
```bash
# Copy template
cp env.example .env

# Chỉnh sửa với thông tin thực tế
nano .env
```

### Bước 2: Cấu hình các credentials
Cập nhật file `.env` với thông tin thực tế:

```bash
# Database Configuration
MYSQL_URL=jdbc:mysql://localhost:3306/wearItnow
MYSQL_USERNAME=root
MYSQL_PASSWORD=your_actual_password

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret

# JWT Configuration
SIGNER_KEY=your_secure_jwt_key
VALID_DURATION=3600
REFRESHABLE_DURATION=36000

# Email Configuration
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Cloudinary Configuration
CLOUDINARY_URL=cloudinary://your_actual_cloudinary_url

# GHN Configuration
GHN_ACCESS_TOKEN=your_actual_ghn_token

# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_TTL=60000
```

### Bước 3: Cài đặt Spring Boot dotenv support
Thêm dependency vào `pom.xml`:

```xml
<dependency>
    <groupId>me.paulschwarz</groupId>
    <artifactId>spring-dotenv</artifactId>
    <version>4.0.0</version>
</dependency>
```

## 🌐 Cách setup cho Production (GitHub Actions/Railway/Heroku)

### GitHub Secrets
1. Vào repository Settings > Secrets and variables > Actions
2. Thêm các secrets:
   - `MYSQL_URL`
   - `MYSQL_USERNAME`
   - `MYSQL_PASSWORD`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `SIGNER_KEY`
   - `MAIL_USERNAME`
   - `MAIL_PASSWORD`
   - `CLOUDINARY_URL`
   - `GHN_ACCESS_TOKEN`

### Railway/Heroku Environment Variables
Cấu hình tương tự trong dashboard của platform:
- Railway: Settings > Environment Variables
- Heroku: Settings > Config Vars

## 🔧 Cách tạo Google OAuth Credentials an toàn

### Bước 1: Tạo Google Cloud Project
1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện tại
3. Enable Google+ API

### Bước 2: Tạo OAuth 2.0 Credentials
1. Vào APIs & Services > Credentials
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Chọn "Web application"
4. Cấu hình:
   - **Authorized JavaScript origins**: `http://localhost:3000`, `https://yourdomain.com`
   - **Authorized redirect URIs**: `http://localhost:3000/auth/google/callback`

### Bước 3: Lưu trữ an toàn
- **KHÔNG** commit credentials vào git
- Sử dụng environment variables
- Sử dụng GitHub Secrets cho CI/CD
- Sử dụng platform-specific environment variables cho production

## 🚨 Cách xử lý khi bị GitHub chặn push

### Nếu push vẫn bị chặn:

1. **Xóa credentials khỏi git history**:
```bash
# Sử dụng git filter-branch hoặc BFG Repo-Cleaner
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch src/main/resources/application.properties' \
--prune-empty --tag-name-filter cat -- --all
```

2. **Tạo credentials mới**:
   - Revoke credentials cũ trong Google Cloud Console
   - Tạo credentials mới
   - Cập nhật environment variables

3. **Force push sau khi clean history**:
```bash
git push --force-with-lease origin main
```

## 📋 Checklist bảo mật

- [ ] File `.env` không được commit
- [ ] Tất cả sensitive data sử dụng environment variables
- [ ] GitHub Secrets được cấu hình cho CI/CD
- [ ] Production environment variables được cấu hình
- [ ] Credentials cũ đã được revoke (nếu có)
- [ ] `.gitignore` đã được cập nhật
- [ ] Team members đã được thông báo về quy trình mới

## 🔄 Quy trình phát triển mới

1. **Khi thêm sensitive configuration mới**:
   - Thêm vào `env.example` với placeholder
   - Sử dụng `${ENV_VAR:default_value}` trong application.properties
   - Cập nhật documentation

2. **Khi onboard developer mới**:
   - Cung cấp file `.env` riêng (không qua git)
   - Hướng dẫn copy từ `env.example`
   - Cung cấp actual credentials qua kênh an toàn

3. **Khi deploy production**:
   - Cấu hình environment variables trên platform
   - Verify tất cả variables đã được set
   - Test application startup

## 📞 Liên hệ
Nếu gặp vấn đề với setup bảo mật, liên hệ team lead hoặc tạo issue trong repository. 