const registerBtn = document.querySelector(".primary-btn");
const loginBtn = document.querySelector(".login-btn");
const downloadBtn = document.querySelector(".secondary-btn");

registerBtn.addEventListener("click", function (event) {
  event.preventDefault();
  alert("Register page coming soon");
});

loginBtn.addEventListener("click", function (event) {
  event.preventDefault();
  alert("Login page coming soon");
});

downloadBtn.addEventListener("click", function (event) {
  event.preventDefault();
  alert("App download coming soon");
});
