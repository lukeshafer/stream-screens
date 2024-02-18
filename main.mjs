import "./elements/dvd-logo.mjs";
import "./elements/title-text.mjs";
import "./elements/countdown-timer.mjs";
import "./elements/corner-hit-counter.mjs";
import "./elements/the-blobs.mjs";

try {
  if (import.meta.env.MODE === "development") {
    document.title = "DEV MODE Intro";
  }
} catch { }

(function checkForFilters() {
  const url = new URL(window.location.href);
  const filters = url.searchParams.getAll("el");
  if (filters.length === 0) return;

  document.body.innerHTML = "";
  filters.forEach((f) => {
    try {
      const el = document.createElement(f);
      document.body.appendChild(el);
    } catch { }
  });
})();

window.addEventListener("load", () => {
  setTimeout(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "instant",
    });
    document.body.style.setProperty("opacity", "1");
  }, 50);
});
