// 1. Live Newspaper Date
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

// 2. Paper Theme Switcher + localStorage Persistence
const themeButtons = document.querySelectorAll(".theme-btn");

function applyTheme(theme) {
  if (theme === "newsprint") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }

  themeButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.theme === theme);
  });

  localStorage.setItem("glitch-theme", theme);
}

const savedTheme = localStorage.getItem("glitch-theme") || "newsprint";
applyTheme(savedTheme);

themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    applyTheme(btn.dataset.theme);
  });
});

// 3. Front Page, Category Tabs & Search
const leadContainer = document.getElementById("lead-story-container");
const secondaryContainer = document.getElementById("secondary-stories-container");
const navLinks = document.querySelectorAll(".main-nav a");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

const FRONT_PAGE_LIMIT = 5; // Max hot stories shown below the Lead Story
let allArticles = [];

function createCardHTML(story) {
  return `
    <article class="story-card" data-category="${story.category}">
      <span class="tag">${story.tag}</span>
      <a href="article.html?id=${story.id}" class="headline-link">
        <h3>${story.title}</h3>
      </a>
      <p class="excerpt">${story.excerpt || story.body[0]}</p>
    </article>
  `;
}

function renderFrontPage() {
  const leadStory = allArticles.find((a) => a.featured) || allArticles[0];
  const hotStories = allArticles
    .filter((a) => a.frontPage && (!leadStory || a.id !== leadStory.id))
    .slice(0, FRONT_PAGE_LIMIT);

  if (leadStory) {
    leadContainer.innerHTML = `
      <article class="lead-story" data-category="${leadStory.category}">
        <span class="tag">${leadStory.tag}</span>
        <div class="glitch-art">
          <img src="${leadStory.image}" alt="${leadStory.title}" class="article-img" />
        </div>
        <a href="article.html?id=${leadStory.id}" class="headline-link">
          <h2>${leadStory.title}</h2>
        </a>
        <p class="byline">${leadStory.byline}</p>
        <p class="excerpt">${leadStory.excerpt || leadStory.body[0]}</p>
      </article>
    `;
  }

  secondaryContainer.innerHTML = hotStories.map(createCardHTML).join("");
}

function renderCategory(category) {
  leadContainer.innerHTML = "";
  const matches = allArticles.filter((a) => a.category === category);

  secondaryContainer.innerHTML = matches.length
    ? matches.map(createCardHTML).join("")
    : `<p class="excerpt">No stories in this section yet.</p>`;
}

function renderSearch(query) {
  const term = query.trim().toLowerCase();
  if (!term) {
    renderFrontPage();
    return;
  }

  leadContainer.innerHTML = "";
  navLinks.forEach((l) => l.classList.remove("active-nav"));

  const matches = allArticles.filter((a) => {
    const text = `${a.title} ${a.excerpt || ""} ${a.tag} ${a.body.join(" ")}`.toLowerCase();
    return text.includes(term);
  });

  secondaryContainer.innerHTML = matches.length
    ? matches.map(createCardHTML).join("")
    : `<p class="excerpt">No stories found for "${query}".</p>`;
}

// Initial Fetch
async function initStories() {
  if (!leadContainer || !secondaryContainer) return;
  const res = await fetch("articles.json");
  allArticles = await res.json();
  renderFrontPage();
}

initStories();

// Nav Click Events
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    if (searchInput) searchInput.value = "";
    navLinks.forEach((l) => l.classList.remove("active-nav"));
    link.classList.add("active-nav");

    const section = link.dataset.nav;
    if (section === "all") {
      renderFrontPage();
    } else {
      renderCategory(section);
    }
  });
});

// Search Submit Event
if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    renderSearch(searchInput.value);
  });
}

// Toggle Search Bar from Magnifying Glass
const searchToggle = document.getElementById("search-toggle");

if (searchToggle && searchForm) {
  searchToggle.addEventListener("click", () => {
    const isOpen = searchForm.classList.toggle("open");
    searchToggle.classList.toggle("active", isOpen);

    if (isOpen && searchInput) {
      searchInput.focus();
    } else if (searchInput) {
      searchInput.value = "";
      renderFrontPage();
    }
  });
}