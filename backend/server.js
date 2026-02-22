const http = require("node:http")
const { URL } = require("node:url")

const PORT = Number(process.env.PORT || 4000)

const pins = new Map()
const subscribers = new Set()

function sendJson(res, statusCode, body) {
  const payload = JSON.stringify(body)
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  })
  res.end(payload)
}

function sendNoContent(res) {
  res.writeHead(204, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  })
  res.end()
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ""
    req.on("data", (chunk) => {
      raw += chunk
    })
    req.on("end", () => {
      if (!raw) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(raw))
      } catch {
        reject(new Error("Invalid JSON"))
      }
    })
    req.on("error", reject)
  })
}

function listPins() {
  return Array.from(pins.values()).sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })
}

function publish(event) {
  const frame = `data: ${JSON.stringify(event)}\n\n`
  for (const res of subscribers) {
    res.write(frame)
  }
}

function createPin(input) {
  const now = new Date().toISOString()
  const pin = {
    id: crypto.randomUUID(),
    lat: input.lat,
    lng: input.lng,
    title: typeof input.title === "string" && input.title.trim() ? input.title.trim() : "Untitled Pin",
    description: typeof input.description === "string" ? input.description.trim() : "",
    createdAt: now,
    updatedAt: now,
  }
  pins.set(pin.id, pin)
  publish({ type: "pin_created", pin })
  return pin
}

function updatePin(id, patch) {
  const current = pins.get(id)
  if (!current) return null
  const next = {
    ...current,
    lat: typeof patch.lat === "number" ? patch.lat : current.lat,
    lng: typeof patch.lng === "number" ? patch.lng : current.lng,
    title:
      typeof patch.title === "string"
        ? patch.title.trim() || "Untitled Pin"
        : current.title,
    description:
      typeof patch.description === "string"
        ? patch.description.trim()
        : current.description,
    updatedAt: new Date().toISOString(),
  }
  pins.set(id, next)
  publish({ type: "pin_updated", pin: next })
  return next
}

function deletePin(id) {
  const deleted = pins.delete(id)
  if (!deleted) return false
  publish({ type: "pin_deleted", pinId: id })
  return true
}

const server = http.createServer(async (req, res) => {
  const method = req.method || "GET"
  const url = new URL(req.url || "/", `http://${req.headers.host}`)
  const pathname = url.pathname

  if (method === "OPTIONS") {
    sendNoContent(res)
    return
  }

  if (method === "GET" && pathname === "/api/pins") {
    sendJson(res, 200, { pins: listPins() })
    return
  }

  if (method === "POST" && pathname === "/api/pins") {
    try {
      const body = await parseBody(req)
      if (typeof body.lat !== "number" || typeof body.lng !== "number") {
        sendJson(res, 400, { error: "lat and lng must be numbers" })
        return
      }
      const pin = createPin(body)
      sendJson(res, 201, { pin })
    } catch {
      sendJson(res, 400, { error: "Invalid JSON" })
    }
    return
  }

  if (method === "GET" && pathname === "/api/pins/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    })
    res.write(": connected\n\n")
    subscribers.add(res)

    const heartbeat = setInterval(() => {
      res.write(": ping\n\n")
    }, 20000)

    req.on("close", () => {
      clearInterval(heartbeat)
      subscribers.delete(res)
    })
    return
  }

  const pinIdMatch = pathname.match(/^\/api\/pins\/([^/]+)$/)
  if (pinIdMatch && method === "PATCH") {
    const pinId = decodeURIComponent(pinIdMatch[1])
    try {
      const body = await parseBody(req)
      const updated = updatePin(pinId, body)
      if (!updated) {
        sendJson(res, 404, { error: "Pin not found" })
        return
      }
      sendJson(res, 200, { pin: updated })
    } catch {
      sendJson(res, 400, { error: "Invalid JSON" })
    }
    return
  }

  if (pinIdMatch && method === "DELETE") {
    const pinId = decodeURIComponent(pinIdMatch[1])
    const deleted = deletePin(pinId)
    if (!deleted) {
      sendJson(res, 404, { error: "Pin not found" })
      return
    }
    sendJson(res, 200, { ok: true })
    return
  }

  sendJson(res, 404, { error: "Not found" })
})

server.listen(PORT, () => {
  console.log(`Pins backend listening on http://localhost:${PORT}`)
})
