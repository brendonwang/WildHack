# Backend

Standalone pins backend for the map demo.

## Run

```bash
cd backend
pnpm dev
```

Server starts on `http://localhost:4000`.

## API

- `GET /api/pins`
- `POST /api/pins`
- `PATCH /api/pins/:id`
- `DELETE /api/pins/:id`
- `GET /api/pins/events` (SSE)
