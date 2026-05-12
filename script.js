const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");

  if (mobileMenu.classList.contains("hidden")) {
    menuBtn.textContent = "☰";
  } else {
    menuBtn.textContent = "×";
  }
});
}




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

if (heroIcon && heroTitle && heroText) {
setInterval(() => {
  heroIndex = (heroIndex + 1) % heroSlides.length;

  heroIcon.textContent = heroSlides[heroIndex].icon;
  heroTitle.innerHTML = heroSlides[heroIndex].title;
  heroText.textContent = heroSlides[heroIndex].text;
}, 1500);
}








const animatedItems = document.querySelectorAll(".scroll-animate");

if ("IntersectionObserver" in window) {
const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const item = entry.target;

      if (entry.isIntersecting) {
        item.classList.remove(
          "opacity-0",
          "-translate-y-12",
          "-translate-x-20",
          "translate-x-20",
          "translate-y-14"
        );

        item.classList.add("opacity-100", "translate-x-0", "translate-y-0");
      } else {
        item.classList.remove("opacity-100", "translate-x-0", "translate-y-0");
        item.classList.add("opacity-0");

        if (item.classList.contains("from-left")) {
          item.classList.add("-translate-x-20");
        }

        if (item.classList.contains("from-right")) {
          item.classList.add("translate-x-20");
        }

        if (item.classList.contains("from-down")) {
          item.classList.add("-translate-y-12");
        }

        if (item.classList.contains("from-up")) {
          item.classList.add("translate-y-14");
        }
      }
    });
  },
  {
    threshold: 0.25,
  }
);

animatedItems.forEach((item) => {
  scrollObserver.observe(item);
});
}







