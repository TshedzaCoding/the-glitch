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

// Paper Theme Switcher + localStorage Persistence
const themeButtons = document.querySelectorAll(".theme-btn");

function applyTheme(theme) {
  // 1. Apply the CSS theme attribute
  if (theme === "newsprint") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }

  // 2. Highlight the matching button
  themeButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.theme === theme);
  });

  // 3. Save the choice in the browser
  localStorage.setItem("glitch-theme", theme);
}

// Load any saved theme when the front page opens
const savedTheme = localStorage.getItem("glitch-theme") || "newsprint";
applyTheme(savedTheme);

// Update and save whenever a button is clicked
themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    applyTheme(btn.dataset.theme);
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