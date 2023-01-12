const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

//front에서 back으로 연결할때
const socket = new WebSocket(`ws://${window.location.host}`);

//소켓이 연결되었으면 프론트의 console에
socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});
// 소켓에 메세지가 들어오면
socket.addEventListener("message", (message) => {
  console.log("New message:", message.data);
});
// 연결이 끊겼을때
socket.addEventListener("close", () => {
  console.log("Disonnected from Server ❌");
});

// // 서버에 메세지 보내주기
// setTimeout(() => {
//   socket.send("hello from the browser");
// }, 10000);

//프론트엔드에서 백엔드 그러니까 서버로 값을 보내주기
function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(input.value);
  // 보내줬으니까 비워주기
  input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
