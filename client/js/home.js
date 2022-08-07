const startVideoBtn = document.getElementById("startVideo");
const btnDiv = document.getElementById("btnDiv");

const start = () => {
  window.location.href = `/video.html?room=${uuid()}`;
};

startVideoBtn.addEventListener("click", start);

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
