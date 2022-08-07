const vidDiv = document.getElementById("vidDiv");
const socket = io("/");
const myPeer = new Peer({
  key: "peerjs",
  host: "https://video-call-eming.herokuapp.com/",
  port: "5001",
  //   secure: true,
});

const peers = {};
const video = document.createElement("video");
video.muted = true;

myPeer.on("open", (id) => {
  checkForRoomId(id);
});

socket.on("user-disconnect", (userId) => {
  if (peers[userId]) peers[userId].close();
});

const checkForRoomId = (id) => {
  const url = new URL(window.location.href);
  const roomId = url.searchParams.get("room");

  socket.emit("join-room", roomId, id);
};

const startVideo = async () => {
  const constraints = {
    audio: true,
    video: true,
  };

  if (navigator.mediaDevices) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      addVideoStream(video, stream);

      myPeer.on("call", (call) => {
        call.answer(stream);

        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
          addVideoStream(video, userVideoStream);
        });
      });

      socket.on("user-connected", (userId) => {
        connectToUsers(userId, stream);
      });
    } catch (error) {
      console.log(error);
      statusDiv.innerText = null;
    }
  }
};

startVideo();

const connectToUsers = (userId, stream) => {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => video.remove());

  peers[userId] = call;
};

const addVideoStream = (video, stream) => {
  if ("srcObject" in video) {
    video.srcObject = stream;
  } else {
    // for older browsers
    video.src = window.URL.createObjectURL(stream);
  }

  video.onloadedmetadata = () => {
    video.play();
  };

  vidDiv.append(video);
};

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
