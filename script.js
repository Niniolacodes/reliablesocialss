const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");

  if (mobileMenu.classList.contains("hidden")) {
    menuBtn.textContent = "☰";
  } else {
    menuBtn.textContent = "×";
  }
});




const heroSlides = [
  {
    icon: "📶",
    title: 'Buy <span class="text-blue-600">Data</span>',
    text: "Stay Connected with Cheap Data.",
  },
  {
    icon: "🛡️",
    title: 'SMS <span class="text-blue-600">Verification</span>',
    text: "Temp numbers for seamless OTP.",
  },
  {
    icon: "🚀",
    title: 'Social <span class="text-blue-600">Boost</span>',
    text: "Buy engagements for TikToks, Instagrams, etc.",
  },
];

let heroIndex = 0;

const heroIcon = document.getElementById("heroIcon");
const heroTitle = document.getElementById("heroTitle");
const heroText = document.getElementById("heroText");

setInterval(() => {
  heroIndex = (heroIndex + 1) % heroSlides.length;

  heroIcon.textContent = heroSlides[heroIndex].icon;
  heroTitle.innerHTML = heroSlides[heroIndex].title;
  heroText.textContent = heroSlides[heroIndex].text;
}, 1500);







