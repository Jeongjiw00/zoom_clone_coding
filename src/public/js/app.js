const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");

//front에서 back으로 연결할때
const socket = new WebSocket(`ws://${window.location.host}`);

//받은 메세지를 객체로 만들고 string화
function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

//소켓이 연결되었으면 프론트의 console에
socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});
// 소켓에 메세지가 들어오면
socket.addEventListener("message", (message) => {
  // console.log("New message:", message.data);
  // console창말고 프론트에 메세지 띄워주기
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
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
  //preventDefault 를 해주지 않으면 submit 됨과 동시에 창이 다시 실행됨.
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  const li = document.createElement("li");
  li.innerText = `You: ${input.value}`;
  messageList.append(li);
  input.value = "";
}
//닉네임
function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
  input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
