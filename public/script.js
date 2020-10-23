const socket = io("/");

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const messageHolder = document.getElementsByClassName("messages")[0];

myVideo.muted = true;

var peer = new Peer();

let myVideoStream;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: false,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);
    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("create-message", (message) => {
      const newMessage = document.createElement("li");
      newMessage.innerHTML = `<li class="message"><b>user</b><br/>${message}</li>`;

      messageHolder.append(newMessage);
    });
  });

peer.on("open", (id) => {
  socket.emit("join-room", ROOMID, id);
});

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  videoGrid.append(video);
};

let msg = document.getElementById("chat_message");

msg.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && msg.value.length !== 0) {
    socket.emit("message", msg.value);
    msg.value = "";
  }
});
