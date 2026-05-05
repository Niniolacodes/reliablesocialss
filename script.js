const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", function () {
  mobileMenu.classList.toggle("hidden");

  if (mobileMenu.classList.contains("hidden")) {
    menuBtn.textContent = "☰";
  } else {
    menuBtn.textContent = "✕";
  }
});

const heroItems = [
  {
    icon: "📶",
    title: 'Buy <span class="text-blue-600">Data</span>',
    text: "Stay Connected with Cheap Data.",
  },
  {
    icon: "🛡️",
    title: 'SMS <span class="text-blue-600">Verification</span>',
    text: "Temp Numbers for seamless OTP.",
  },
  {
    icon: "🚀",
    title: 'Social <span class="text-blue-600">Boost</span>',
    text: "Buy engagement for TikToks, Instagrams etc.",
  },
];

let currentItem = 0;

const switchIcon = document.getElementById("switchIcon");
const switchTitle = document.getElementById("switchTitle");
const switchText = document.getElementById("switchText");

setInterval(function () {
  currentItem = (currentItem + 1) % heroItems.length;

  switchIcon.textContent = heroItems[currentItem].icon;
  switchTitle.innerHTML = heroItems[currentItem].title;
  switchText.textContent = heroItems[currentItem].text;
}, 3000);

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
