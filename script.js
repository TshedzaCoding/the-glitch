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

// Hovering Paper Article Modal
const modal = document.getElementById("article-modal");
const modalClose = document.getElementById("modal-close");
const headlineLinks = document.querySelectorAll(".headline-link");

let cachedArticles = null;

async function openArticleModal(articleId) {
  if (!cachedArticles) {
    const res = await fetch("articles.json");
    cachedArticles = await res.json();
  }

  const story = cachedArticles.find((a) => a.id === articleId);
  if (!story) return;

  document.getElementById("modal-tag").textContent = story.tag;
  document.getElementById("modal-title").textContent = story.title;
  document.getElementById("modal-deck").textContent = story.deck || "";
  document.getElementById("modal-byline").textContent = story.byline;
  document.getElementById("modal-img").src = story.image;

  const bodyContainer = document.getElementById("modal-body");
  bodyContainer.innerHTML = "";

  story.body.forEach((paragraph, index) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    if (index === 0) p.classList.add("drop-cap");
    bodyContainer.appendChild(p);

    // Insert concept pull-quote after the first paragraph
    if (index === 0 && story.pullQuote) {
      const quote = document.createElement("blockquote");
      quote.className = "modal-pullquote";
      quote.textContent = story.pullQuote;
      bodyContainer.appendChild(quote);
    }
  });

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeArticleModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

headlineLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const url = new URL(link.href);
    const id = url.searchParams.get("id");
    if (id) openArticleModal(id);
  });
});

modalClose.addEventListener("click", closeArticleModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeArticleModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) {
    closeArticleModal();
  }
});