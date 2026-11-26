// Apply saved theme from the front page
const savedTheme = localStorage.getItem("glitch-theme");
if (savedTheme && savedTheme !== "newsprint") {
  document.documentElement.setAttribute("data-theme", savedTheme);
}

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
  if (index === 0) p.classList.add("drop-cap");
  bodyContainer.appendChild(p);

  // Insert the pull quote right after the first paragraph
  if (index === 0 && story.pullQuote) {
    const quote = document.createElement("blockquote");
    quote.className = "pull-quote";
    quote.textContent = story.pullQuote;
    bodyContainer.appendChild(quote);
  }
});
  });

 