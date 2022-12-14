const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const socketEvents = require('./socket-events');

// An object to store connected clients and their data
const connectedClients = {};

// Serve the static files
app.use('/css', express.static(`${__dirname}/client/css`));
app.use('/js', express.static(`${__dirname}/client/js`));
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/client/index.html`);
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`A client has connected (id: ${socket})`);
  if (!(socket.id in connectedClients)) {
    connectedClients[socket.id] = {};
  }

  socket.on('disconnect', () => {
    console.log(`Client disconnected (id: ${socket.id})`);
    delete connectedClients[socket.id];
  });

  socket.on('getdata', () => {
    io.socket.emit('getdata', connectedClients)
  })

  socket.on(socketEvents.DRAW, (data) => {
    const client = connectedClients[socket.id];

    client.prev = client.curr || data;
    client.curr = data;

    // Emit to all connected clients (including the one who originally sent it)
    io.sockets.emit(socketEvents.DRAW, {
      prev: {
        x: client.prev.x,
        y: client.prev.y,
      },
      curr: {
        x: client.curr.x,
        y: client.curr.y,
      },
      boxstate:{
        x: client.curr.xnow,
        y: client.curr.ynow,
        w: client.curr.wnow,
        h: client.curr.hnow
      },
      color: client.curr.color,
      thickness: client.curr.thickness,
      start: client.curr.start,
      type:client.curr.type
    });
  });

  socket.on(socketEvents.DRAW_BEGIN_PATH, () => {
    connectedClients[socket.id].curr = null;
  });

  socket.on('drawing', function (canvasJson) {
    canvasData = canvasJson;
    socket.broadcast.emit('drawing', canvasData);
 });
});

// Start the server
const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
