# Task 3 — REST API & Backend Development

A RESTful **Task Items API** built with **Node.js, Express, and SQLite**. It demonstrates CRUD operations, request validation, consistent error handling, automated tests, and API documentation.

## Assignment requirements covered

- **Backend framework:** Node.js + Express
- **CRUD API:** Create, read all, read one, update, and delete items
- **Database:** SQLite; initialized automatically at runtime
- **Validation:** required fields, supported field names, data types, status values, and ID checks
- **Error handling:** JSON error responses and suitable HTTP status codes
- **Documentation:** endpoint guide, OpenAPI specification, and Postman collection
- **Testing:** automated API tests using Node's built-in test runner

## Requirements

- Node.js 18 or newer
- npm

## Run locally

1. Download and extract this project, or clone the GitHub repository.
2. Open a terminal in the `rest-api-backend-task3` folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. Check the health endpoint in a browser: `http://localhost:3000/api/health`
6. Test the API with Postman using `docs/postman_collection.json` or follow `docs/API_DOCUMENTATION.md`.

For development, run `npm run dev`.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check service status |
| GET | `/api/items` | List items; supports optional search/status filters |
| GET | `/api/items/:id` | Retrieve one item |
| POST | `/api/items` | Create an item |
| PUT | `/api/items/:id` | Update an item |
| PATCH | `/api/items/:id` | Partially update an item |
| DELETE | `/api/items/:id` | Delete an item |

### Example request

`POST /api/items`

```json
{
  "title": "Prepare project report",
  "description": "Complete the REST API documentation",
  "status": "pending"
}
```

See `docs/API_DOCUMENTATION.md` for full request/response examples, validation rules, and status codes.

## Run tests

```bash
npm test
```

## Deploy as a web service (Render)

1. Push the **contents of this project folder** to a GitHub repository (do not upload only the ZIP file).
2. In Render, choose **New + → Web Service** and connect that repository.
3. Render can use the included `render.yaml`. If entering settings manually, use:
   - Runtime: Node
   - Build command: `npm install`
   - Start command: `npm start`
   - Health check path: `/api/health`
4. Deploy, then open `https://YOUR-SERVICE.onrender.com/api/health` to confirm the service responds.

**Database note:** the SQLite database file is created at runtime. On free hosting, the local filesystem may be temporary and can be reset during redeploy/restart. For production persistence, use a persistent disk or a managed database.

## GitHub submission checklist

- [ ] Upload extracted project files, including `server.js`, `src/`, `tests/`, `docs/`, `package.json`, `render.yaml`, and this README.
- [ ] Confirm `README.md` appears on the repository front page.
- [ ] Include the GitHub repository URL in the task submission.
- [ ] If a live backend URL is required, submit the Render URL after deployment.

## Project structure

```text
rest-api-backend-task3/
├── server.js
├── package.json
├── render.yaml
├── .env.example
├── src/
│   ├── app.js
│   ├── db.js
│   ├── routes/items.js
│   └── middleware/
├── tests/api.test.js
└── docs/
    ├── API_DOCUMENTATION.md
    ├── openapi.yaml
    └── postman_collection.json
```
