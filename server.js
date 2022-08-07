const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");

// this sets the static folder
app.use(express.static(path.resolve(__dirname, "client")));

// app.get("/", (req, res) => {
//     res.render()
// })

app.use("/api/video", require("./routes/video"));

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`server started on port ${port}`));
