// io는 자동적으로 backend의 socket.io와 연결해주는 funciton
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

// 방에 입장 전엔 숨겨주기
room.hidden = true;
// 입장 전엔 roomName empty
let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}
function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}
function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  // 방 이름 보여주기
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  //
  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
}
function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  //socket.send와 같은 역할
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
  // 나를 제외한 모든 이에게
  addMessage("Someone Joined!");
});

socket.on("bye", () => {
  addMessage("Someone Left ㅠㅠ");
});

socket.on("new_message", addMessage);
