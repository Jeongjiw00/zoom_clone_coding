import express from "express";
import SocketIO from "socket.io";
import http from "http";
import { count } from "console";

const app = express();

//뷰 엔진 설정과 express에 template 지정
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
//public url 생성해서 유저에게 파일 공유
app.use("/public", express.static(__dirname + "/public"));
//home.pug를 render
app.get("/", (req, res) => res.render("home"));
//페이지 홈만 쓸거라서
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

// 서버 생성(http)
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

// public room
function publicRooms() {
  const sids = wsServer.sockets.adapter.sids;
  const rooms = wsServer.sockets.adapter.rooms;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}
// count room user
function countRoom(roomName) {
  // roomName을 찾지 않을 수도 있어서 ?
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

// 서버 연결
wsServer.on("connection", (socket) => {
  socket["nickname"] = "unknown";
  // onAny : middleware같은거, 어떤 event에서든지 console.log가능
  socket.onAny((event) => {
    console.log(wsServer.sockets.adapter);
    console.log(`Socket Event:${event}`);
  });
  //socket.on("message")사용안함. 우리가 원하는 이벤트로 사용가능
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    //showRoom()호출
    done();
    // 입장메시지 보내기(welcome이벤트를 나를 제외한 방의 모든 사람들에게 emit)
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName)); // 하나의 소켓에
    wsServer.sockets.emit("room_change", publicRooms()); // 모든 소켓에
  });
  // 연결 끊을때 - 모든 방에 bye 이벤트 보내기
  socket.on("disconnecting", () => {
    socket.rooms.forEach(
      (room) =>
        socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1) // 아직 확실하게 떠나기 전이라서
    );
  });
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

httpServer.listen(3000, handleListen);
