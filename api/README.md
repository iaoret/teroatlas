# Tero Atlas API Documentation

Welcome to the Tero Atlas API! This guide will help you get started with authentication, user management, and querying dashboard data.

## Production API URL

```
https://api.teroatlas.ai
```

---

## 1. Accessing API Documentation

Interactive API documentation is available via Swagger UI:

- **URL:** [https://api.teroatlas.ai/docs](https://api.teroatlas.ai/docs)

You can explore all endpoints, see request/response schemas, and try out requests directly from your browser.

---

## 2. Authentication

All endpoints (except registration and login) require authentication via a Bearer JWT token.

### Login to Obtain a Token

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Example cURL:**
```sh
curl -X POST 'https://api.teroatlas.ai/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"username": "your_username", "password": "your_password"}'
```

**Response:**
```json
{
  "token": "<JWT_TOKEN>",
  "refreshToken": "<REFRESH_TOKEN>"
}
```

Use the `token` as a Bearer token in the `Authorization` header for all subsequent requests.

---

## 3. Register a New User

> **Note:** Registration requires an authenticated Superuser (SU) account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "newuser",
  "password": "newpassword",
  "su": false
}
```

**Example cURL:**
```sh
curl -X POST 'https://api.teroatlas.ai/auth/register' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <SU_JWT_TOKEN>' \
  -d '{"username": "newuser", "password": "newpassword", "su": false}'
```

**Response:**
```json
{
  "id": 2,
  "username": "newuser",
  "su": false
}
```

---

## 4. Refresh a Token

If your JWT token expires, use your `refreshToken` to obtain a new one.

**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "<REFRESH_TOKEN>"
}
```

**Example cURL:**
```sh
curl -X POST 'https://api.teroatlas.ai/auth/refresh' \
  -H 'Content-Type: application/json' \
  -d '{"refreshToken": "<REFRESH_TOKEN>"}'
```

**Response:**
```json
{
  "token": "<NEW_JWT_TOKEN>",
  "refreshToken": "<NEW_REFRESH_TOKEN>"
}
```

---

## 5. Making a Query 

The `/query` endpoint allows you to request dashboard data. You must be authenticated.

**Endpoint:** `POST /query`

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**Request Body Example:**
```json
{
  "query": "dc congressional district economic data",
  "searchParams": {
    "time": { "years": [2019, 2020, 2021, 2022] },
    "intensity": { "variable": "emp", "order": "asc" }
  }
}
```

**Example cURL:**
```sh
curl -X POST 'https://api.teroatlas.ai/query' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <JWT_TOKEN>' \
  -d '{
    "query": "dc congressional district economic data",
    "searchParams": {
      "time": { "years": [2019, 2020, 2021, 2022] },
      "intensity": { "variable": "emp", "order": "asc" }
    }
  }'
```

**Response:**
```json
{
  "dashboardKey": "q1",
  "data": {
    "q1Totals": [/* ... */],
    "q1Top10BySubUnit": [/* ... */],
    "boundingBox": {/* ... */},
    "choroplethicData": {/* ... */},
    "chartInfo": "",
    "coverage": 0.95
  }
}
```

> **Note:** The response structure may vary depending on the query and dashboard type.

---

## 6. Further Help

- For more details, visit the [Swagger UI documentation](https://api.teroatlas.ai/docs).
- If you encounter issues, please contact the Tero Atlas team.
