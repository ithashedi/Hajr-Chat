// this page is considered our backend server
// we are going to be using node js and Express for our server

//creating our app with express (server)
const app = require("express")();
// here we are creating the server by requiring http and .createServer method and then we pass app in the argument which we previously created
const server = require("http").createServer(app);
// now we will  add the cors which is going to help us to get cross orgin requests when we deploy the application
const cors = require("cors");
// now we will set the socket.io when we will pass two arguments one is the server than the options from the cors
const io = require("socket.io")(server, {
  cors: {
    // allow access from all origins
    origin: "*",
    // we will choose the methods GET and POST
    methods: ["GET", "POST"],
  },
});

app.use(cors());
// declearing our port
const PORT = process.env.PORT || 3000;
// now we will create our rout
app.get("/", (req, res) => {
  // this will show when anyone vist the site and can see it's running
  res.send("Running");
});

// till here we have finished setting up our server

// we will create the IO Socket connection
io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  // now we will create all the sockets needed for this application

  // this socket when the call is over
  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });
  // this socket is for calling a user and this will have many data available
  // first user that we are calling then signal data then the call from and finaly the name
  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });
  // here when a call is recieved
  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

// we will use a method call server.listen which is going to listent the port and than console.log ( the port its running on)
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
