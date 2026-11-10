// Opens student works (images and videos marked with a `pop-up` attribute) in a
// fullscreen overlay. Close with the cross, a click outside the media, or Escape.
// Styles for `.custom-popup-*` live in the page's own <style> block.
const overlay = document.createElement("div");
overlay.className = "custom-popup-overlay";
overlay.setAttribute("role", "dialog");
overlay.setAttribute("aria-modal", "true");
overlay.setAttribute("aria-label", "Перегляд роботи");

const closeBtn = document.createElement("button");
closeBtn.type = "button";
closeBtn.className = "custom-popup-close";
closeBtn.setAttribute("aria-label", "Закрити");
closeBtn.style.cssText = "background:none;border:0;padding:0;";

const content = document.createElement("div");
content.className = "custom-popup-content";

overlay.append(closeBtn, content);
document.body.appendChild(overlay);

let lastFocus: Element | null = null;
let clearTimer: number | undefined;

function mediaFor(trigger: HTMLElement): HTMLElement | null {
  const img = trigger instanceof HTMLImageElement ? trigger : trigger.querySelector("img");
  const video = trigger instanceof HTMLVideoElement ? trigger : trigger.querySelector("video");
  if (video) {
    // Videos are lazy-loaded: `src` stays empty until they scroll into view.
    const src =
      video.currentSrc ||
      video.getAttribute("src") ||
      video.dataset.src ||
      video.querySelector("source")?.getAttribute("src") ||
      "";
    if (!src) return null;
    const el = document.createElement("video");
    el.src = src;
    if (video.poster) el.poster = video.poster;
    el.controls = true;
    el.autoplay = true;
    el.playsInline = true;
    return el;
  }
  if (img) {
    const el = document.createElement("img");
    el.src = img.currentSrc || img.src;
    el.alt = img.alt;
    return el;
  }
  return null;
}

function open(trigger: HTMLElement) {
  const media = mediaFor(trigger);
  if (!media) return;
  window.clearTimeout(clearTimer);
  content.replaceChildren(media);
  lastFocus = document.activeElement;
  overlay.classList.add("is-active");
  document.documentElement.style.overflow = "hidden";
  closeBtn.focus({ preventScroll: true });
}

function close() {
  if (!overlay.classList.contains("is-active")) return;
  overlay.classList.remove("is-active");
  document.documentElement.style.overflow = "";
  content.querySelector("video")?.pause();
  clearTimer = window.setTimeout(() => content.replaceChildren(), 300);
  if (lastFocus instanceof HTMLElement) lastFocus.focus({ preventScroll: true });
}

document.addEventListener("click", (e) => {
  const trigger = (e.target as Element | null)?.closest<HTMLElement>("[pop-up]");
  if (!trigger || overlay.contains(trigger)) return;
  e.preventDefault();
  open(trigger);
});
closeBtn.addEventListener("click", close);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) close();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") close();
});
