const socket = io("/");

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");

myVideo.muted = true;

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3030",
});

let myVideoStream;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);
  });

peer.on("open", (id) => {
  socket.emit("join-room", ROOMID, id);
});

socket.on("user-connected", (userId) => {
  connectToNewUser(userId);
});

const connectToNewUser = (userId) => {
  console.log("new user", userId);
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  videoGrid.append(video);
};
