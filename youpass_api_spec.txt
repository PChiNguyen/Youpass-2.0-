# OpenAPI Specification Summary: YouPass 2.0 API
**Version:** 2.0.0  
**Description:** Minimal backend API for YouPass 2.0 IELTS preparation platform.  
**OpenAPI Version:** 3.1.0  

---

## 🔑 Authentication Endpoints

### 1. Register User
* **Endpoint:** `POST /api/auth/register`
* **Summary:** Register User
* **Description:** Registers a new user account, handles password hashing, and checks for email conflicts via UserService. Requires a password.
* **Request Body:** JSON payload matching the `UserRegister` schema (Required).
* **Responses:**
  * `201`: Successful Response (Returns `UserResponse` data).
  * `422`: Validation Error (Returns `HTTPValidationError` data).

### 2. Login
* **Endpoint:** `POST /api/auth/login`
* **Summary:** Login
* **Description:** Authenticates user credentials against hashed passwords via UserService, generates a JWT access token, and sets a secure HttpOnly cookie.
* **Request Body:** URL-encoded form data matching the `Body_login_api_auth_login_post` schema (Required).
* **Responses:**
  * `200`: Successful Response.
  * `422`: Validation Error (Returns `HTTPValidationError` data).

### 3. Google Login
* **Endpoint:** `POST /api/auth/google-login`
* **Summary:** Google Login
* **Description:** Verifies Google ID token and delegates user upsert logic entirely to UserService.
* **Request Body:** JSON payload matching the `GoogleLoginRequest` schema (Required).
* **Responses:**
  * `200`: Successful Response.
  * `422`: Validation Error (Returns `HTTPValidationError` data).

### 4. Read Users Me
* **Endpoint:** `GET /api/auth/me`
* **Summary:** Read Users Me
* **Description:** Returns the profile of the currently authenticated user.
* **Security:** Requires `OAuth2PasswordBearer` token.
* **Responses:**
  * `200`: Successful Response (Returns `UserResponse` data).

---

## 📝 Tests Endpoints

### 5. Create Test
* **Endpoint:** `POST /api/tests/`
* **Summary:** Create Test
* **Description:** Tạo mới một bài kiểm tra IELTS. (Create a new IELTS test).
* **Security:** Requires `OAuth2PasswordBearer` token.
* **Request Body:** JSON payload matching the `TestCreate` schema (Required).
* **Responses:**
  * `201`: Successful Response (Returns `TestResponse` data).
  * `422`: Validation Error (Returns `HTTPValidationError` data).

### 6. Get All Tests
* **Endpoint:** `GET /api/tests/`
* **Summary:** Get All Tests
* **Description:** Lấy danh sách tất cả các bài kiểm tra, có thể lọc theo kỹ năng (Reading, Listening...). (Get a list of all tests, filterable by skills).
* **Query Parameters:**
  * `skill_type` (Optional): Filter by `SkillType` or null.
  * `skip` (Optional, Default: 0): Number of records to skip (Integer).
  * `limit` (Optional, Default: 100): Maximum number of records to return (Integer).
* **Responses:**
  * `200`: Successful Response (Returns an array of `TestResponse` items).
  * `422`: Validation Error (Returns `HTTPValidationError` data).

### 7. Get Test By Id
* **Endpoint:** `GET /api/tests/{test_id}`
* **Summary:** Get Test By Id
* **Description:** Lấy chi tiết một bài kiểm tra dựa vào ID. (Get details of a specific test by its ID).
* **Path Parameters:**
  * `test_id` (Required): The unique identifier of the test (UUID string format).
* **Responses:** *(Incomplete in source file)*
