// io는 자동적으로 backend의 socket.io와 연결해주는 funciton
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  //socket.send와 같은역할
  //전에는 object로 못보내서 string으로 변환하여 보냈는데, socketIO는 가능
  //event,보내고 싶은 데이터, 서버에서 호출하는 function
  socket.emit("enter_room", { payload: input.value }, () => {
    console.log("server is done!");
  });
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);
