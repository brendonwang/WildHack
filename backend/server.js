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

let Pins = new Map(Object.entries({
    '1cafa012-47cb-4041-9938-b17402fc6299': {
        position: [47.60431120244565, -122.31834411621095],
        name: 'Raccoon',
        details: ''
    },
    '6a1c695c-cd6b-47d2-aae5-a0de68ac47b2': {
        position: [47.651534362719005, -122.17835426330568],
        name: 'Horse',
        details: 'There was a rogue horse that galloped passed me as I was walking along the trail.'
    },
    'a94fb7c5-3234-40b3-ae0a-409fc807e54c': {
        position: [47.5948773677043, -122.33842849731447],
        name: 'Pigeon',
        details: 'Pigeon spotted at Terminal 46 while waiting for cruise.'
    },
    '13a998ab-c0e2-403d-ba7b-27a8c17e4166': {
        position: [47.674635091761616, -122.20161437988283],
        name: 'Bald Eagle',
        details: 'Nesting in tall tree'
    },
    '2a1d8471-b172-47ad-9410-42ae8b1449cc': {
        position: [47.545846870927605, -122.09749639034273],
        name: 'Cougar',
        details: 'A cougar jumped over the fence and got into my backyard.'
    }
})) // replace with database later

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
