const buttons = document.querySelectorAll(".filter-btn");
const wireItems = document.querySelectorAll(".wire-list li");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    // 1. Update active button styling
    buttons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // 2. Show or hide items based on category
    const filter = button.dataset.filter;

    wireItems.forEach((item) => {
      if (filter === "all" || item.dataset.category === filter) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
});

// Live Newspaper Date
const dateEl = document.getElementById("live-date");
if (dateEl) {
  const today = new Date();
  dateEl.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Paper Theme Switcher
const themeButtons = document.querySelectorAll(".theme-btn");
themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    themeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const theme = btn.dataset.theme;
    if (theme === "newsprint") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  });
});

// Top Navigation Filtering & Wire Jump
const navLinks = document.querySelectorAll(".main-nav a");
const allStories = document.querySelectorAll(".lead-story, .story-card");
const wireSection = document.querySelector(".breaking-wire");

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // Highlight active nav tab
    navLinks.forEach((l) => l.classList.remove("active-nav"));
    link.classList.add("active-nav");

    const section = link.dataset.nav;

    // If "The Wire" is clicked, scroll smoothly down to it
    if (section === "wire" && wireSection) {
      allStories.forEach((story) => (story.style.display = "block"));
      wireSection.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Filter front page stories by category
    allStories.forEach((story) => {
      if (section === "all" || story.dataset.category === section) {
        story.style.display = "block";
      } else {
        story.style.display = "none";
      }
    });
  });
});