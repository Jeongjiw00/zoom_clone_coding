import express from "express";
import http from "http";
import WebSocket from "ws";

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
const server = http.createServer(app);
// websocket 서버 생성(http서버를 이용한) => http/ws 둘 다 사용가능
// websocket.server는 객체를 전달인자로 받아주는데
// {server, port}에서 포트를 생략해주면 http와 같은 port를 사용함!
const wss = new WebSocket.Server({ server });

function onSocketClose() {
  console.log("Disonnected from the Browser ❌");
}

// function onSocketMessage(message) {
//   //스트링으로 변환 안해주면 이상한 코드가 나옴
//   console.log(message.toString("utf8"));
// }

//fake db
const sockets = [];

// websocket작동
// wss는 서버전체, socket은 브라우저 하나대상
wss.on("connection", (socket) => {
  //연결되는 socket을 db에 저장
  sockets.push(socket);
  console.log("Connected to Browser");
  //브라우저가 닫혔을때
  socket.on("close", onSocketClose);
  // 브라우저가 서버에 메세지 보냈을때 다시 그 값을 브라우저에 보내주기
  socket.on("message", (message) => {
    const messageString = message.toString("utf8");
    sockets.forEach((aSocket) => aSocket.send(messageString));
  });
});

server.listen(3000, handleListen);
