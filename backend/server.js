const {createServer} = require("http");
const {Server} = require("socket.io");
const {instrument} = require("@socket.io/admin-ui");

const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io", "http://localhost:3000", "https://wildlife-tracker-omega.vercel.app"],
        credentials: true
    },
    connectionStateRecovery: {}
});

instrument(io, {
    auth: false,
    mode: "development",
});

let Pins = new Map([
]) // replace with database later

io.on("connection", (socket) => {
    console.log("User Connected")
    io.to(socket.id).emit('init', [...Pins.entries()])
    socket.on("upload", (payload) => {
        console.log(payload)
        let newPin = [crypto.randomUUID(), {
            position: [Number(payload.lat), Number(payload.lng)],
            name: payload.animalName,
            details: payload.details
        }]
        Pins.set(newPin[0], newPin[1])
        io.emit("newpin", newPin)
        console.log("New Pin:")
        console.log(Pins);
    })
})

httpServer.listen(4000);
