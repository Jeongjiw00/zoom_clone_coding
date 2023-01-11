import express from "express";

const app = express();

//뷰 엔진 설정과 express에 template 지정
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
//public url 생성해서 유저에게 파일 공유
app.use("/public", express.static(__dirname + "/public"));
//home.pug를 render
app.get("/", (req, res) => res.render("home"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

app.listen(3000, handleListen);
