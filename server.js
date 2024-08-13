import { Server } from "socket.io";
import express from "express";
import * as http from "http";
import ViteExpress from "vite-express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on('connection', (client) => {
  const connectedClientUsername = client.handshake.query.username;
  
  console.log(`사용자가 들어왔습니다! ${connectedClientUsername}`);

  client.broadcast.emit('new message', { username: "관리자", message: `[${connectedClientUsername}님이 방에 들어왔습니다.]`});

  client.on('new message', (msg) => {
    console.log(`----${connectedClientUsername}님의 메시지----`);
    console.log(msg);
    console.log(`------------`);
    io.emit('new message', { username: connectedClientUsername, message: msg.message });
  })
  
  client.on('disconnect', () => {
    console.log(`사용자가 나갔습니다 ${connectedClientUsername}`);
    io.emit('new message', { username: "관리자", message: `[${connectedClientUsername}님이 방에서 나갔습니다.]`});
  })
});

server.listen(3000, () => {
  console.log('서버에서 듣고 있습니다.. 3000번 포트');
});

app.get("/message", (_, res) => res.send("Hello from express!"));

ViteExpress.bind(app, server);