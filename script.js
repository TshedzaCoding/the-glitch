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