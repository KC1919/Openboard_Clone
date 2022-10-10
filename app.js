const express = require("express");
const app = express();
const socket = require("socket.io");

app.use(express.static("public"));


const server = app.listen(3000, (res) => {
    console.log("Server listening on port: 3000");
});

const io = socket(server);

io.on("connection", (socket) => {
    console.log("New connection made");

    socket.on("beginPath", (data) => {
        // console.log(data);
        io.sockets.emit("beginPath", data);
    });

    socket.on("drawPath", (data) => {
        io.sockets.emit("drawPath", data);
    })

    socket.on("updatePenColor",(data)=>{
        io.sockets.emit("updatePenColor",data);
    })

    socket.on("updatePenWidth",(data)=>{
        io.sockets.emit("updatePenWidth",data);
    })

    socket.on("undo",data=>{
        io.sockets.emit("undo",data);
    })

    socket.on("redo",data=>{
        io.sockets.emit("redo",data);
    })

    socket.on("updateTrackerData",data=>{
        io.sockets.emit("updateTrackerData",data);
    })
})