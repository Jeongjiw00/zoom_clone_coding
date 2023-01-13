// io는 자동적으로 backend의 socket.io와 연결해주는 funciton
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function backendDone(msg) {
  console.log(`the backend says: `, msg);
}
function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  //socket.send와 같은 역할
  socket.emit("enter_room", input.value, backendDone);
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);
