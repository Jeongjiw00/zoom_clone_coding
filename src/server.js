import express from "express";
import SocketIO from "socket.io";
import http from "http";

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

// 서버 연결
wsServer.on("connection", (socket) => {
  //socket.on("message")사용안함. 우리가 원하는 이벤트로 사용가능
  socket.on("enter_room", (msg, done) => {
    console.log(msg);
    //done함수는 프론트(app.js)에서 보내주는것! wow!
    setTimeout(() => {
      done();
    }, 10000);
  });
});

httpServer.listen(3000, handleListen);
