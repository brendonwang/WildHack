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
    ["1", {position: [47.6062, -122.3321], text: 'Bald Eagle spotted near Pike Place'}],
    ["2", {position: [47.6295, -122.3422], text: 'Great Blue Heron at Fremont Canal'}],
    ["3", {position: [47.6535, -122.3500], text: 'Red-tailed Hawk over Woodland Park'}],
    ["4", {position: [47.6815, -122.2587], text: 'Coyote sighting near Magnuson Park'}],
    ["5", {position: [47.5480, -122.2398], text: 'Deer family in Mercer Island trail'}],
    ["6", {position: [47.6101, -122.2015], text: 'River Otter at Meydenbauer Bay'}],
    ["7", {position: [47.6205, -122.1490], text: 'Black Bear tracks near Eastgate'}],
    ["8", {position: [47.6740, -122.1215], text: 'Osprey nest at Marymoor Park'}],
    ["9", {position: [47.5650, -122.3856], text: 'Harbor Seal at Alki Beach'}],
    ["10", {position: [47.6312, -122.0622], text: 'Elk crossing near Snoqualmie'}],
    ["11", {position: [47.6580, -122.3050], text: 'Peregrine Falcon on UW campus'}],
    ["12", {position: [47.5302, -122.0312], text: 'Bobcat sighting in Tiger Mountain'}],
    ["13", {position: [47.7106, -122.3280], text: 'Raccoon family at Green Lake'}],
    ["14", {position: [47.4910, -122.2108], text: 'Great Horned Owl in Renton Park'}],
    ["15", {position: [47.5725, -122.1650], text: 'Fox near Newcastle Beach Park'}],
]) // replace with database later

io.on("connection", (socket) => {
    console.log("User Connected")
    io.to(socket.id).emit('init', [...Pins.entries()])
})
io.on("upload", (socket) => {
    console.log("New Data Point Created")
})

httpServer.listen(4000);