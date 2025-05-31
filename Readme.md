# 📁 Secure File Upload & Metadata Processing Microservice

A secure file upload service in Node.js that stores file metadata in a database, runs background processing tasks, and tracks the status of those tasks.

## How to Run Locally

### Tech Stack

- Node.js ≥ 18
- PostgreSQL
- Redis
- Yarn or npm

### 📦 Setup

1. **Clone the repository:**

   ```bash
   git clone    https://github.com/Vedant005/File_secure.git

   cd file_secure
   ```

2. Install Dependencies

   ```
   npm install
   ```

3. Create and configure .env

```
PORT=3000
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://user:password@localhost:5432/upload_service
REDIS_PORT=6379
```

4. Generate and migrate Prisma schema:

```
npx prisma migrate dev --name init
```

5. Run the app and worker

- Server:

```
npm run dev
```

- Worker:

```
npm run worker
```

### API Documentation

1.  Authentication

POST /auth/login

```json
{
  "email": "testing@dmail.com",
  "password": "testingPass"
}
```

2.  Upload File
    POST /upload

Headers:

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

FormData:

- file: any file format (required)
- title: string (optional)
- description : string (optional)

Response:

```json
{
  "id": 1,
  "status": "uploaded"
}
```

3. Get File Status

GET /files/:id

```
Authorization: Bearer <token>
```

Response:

```json
{
  "id": 1,
  "title": "My File",
  "description": "Some papers",
  "original_filename": "example.txt",
  "status": "processed",
  "extracted_data": "abc123filehash...",
  "uploaded_at": "2025-05-31T08:00:00.000Z"
}
```

A rough API Flow :

1. POST /auth/login
   → Receive JWT

2. POST /upload (with file + metadata)
   → Returns file ID + status uploaded

3. Background job picks up and processes file
   → Updates DB status to processed

4. GET /files/:id
   → Returns file info, status, and extracted result
