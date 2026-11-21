// 1. Read the ?id= value from the URL
const params = new URLSearchParams(window.location.search);
const articleId = params.get("id");

// 2. Fetch articles.json and find the matching story
fetch("articles.json")
  .then((res) => res.json())
  .then((articles) => {
    const story = articles.find((a) => a.id === articleId);

    if (!story) {
      document.getElementById("art-title").textContent = "404 — Story Not Found";
      return;
    }

    // 3. Inject the story into the HTML
    document.title = `${story.title} — THE GLITCH`;
    document.getElementById("art-tag").textContent = story.tag;
    document.getElementById("art-title").textContent = story.title;
    document.getElementById("art-byline").textContent = story.byline;
    document.getElementById("art-img").src = story.image;

    const bodyContainer = document.getElementById("art-body");
    story.body.forEach((paragraph, index) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      if (index === 0) p.classList.add("drop-cap"); // Drop cap on first paragraph
      bodyContainer.appendChild(p);
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
  document.getElementById("modal-byline").textContent = story.byline;
  document.getElementById("modal-img").src = story.image;

  const bodyContainer = document.getElementById("modal-body");
  bodyContainer.innerHTML = "";
  story.body.forEach((paragraph, index) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    if (index === 0) p.classList.add("drop-cap");
    bodyContainer.appendChild(p);
  });

  modal.classList.add("open");
  document.body.style.overflow = "hidden"; // Lock background scroll
}

function closeArticleModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

headlineLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); // Stay on the front page
    const url = new URL(link.href);
    const id = url.searchParams.get("id");
    if (id) openArticleModal(id);
  });
});

modalClose.addEventListener("click", closeArticleModal);

// Close when clicking the dark backdrop outside the paper
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeArticleModal();
});

// Close with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) {
    closeArticleModal();
  }
});