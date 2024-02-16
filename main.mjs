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

/**
 * @param {number} num
 * @param {number} min
 * @param {number} max
 */
//window.isBetween = function isBetween(num, min, max) {
//return num >= min && num <= max;
//};
