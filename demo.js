const viewer = document.querySelector("#scene-viewer");
const status = document.querySelector("#viewer-status");
const strip = document.querySelector("#demo-strip");
const selectedInput = document.querySelector("#selected-input");
const selectedInputOpen = document.querySelector("#selected-input-open");
const lightbox = document.querySelector("#image-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxClose = document.querySelector("#lightbox-close");
if (!viewer || !status || !strip || !selectedInput) throw new Error("Demo viewer markup is missing.");
const fmt = n => n == null ? "" : `${(n / 1048576).toFixed(1)} MiB`;
let scenes = [];
let active = null;
function setStatus(text, error = false) { status.textContent = text; status.classList.toggle("viewer-error", error); }
function selectScene(scene, button) {
  active = scene;
  document.querySelectorAll(".demo-thumb").forEach(item => item.classList.toggle("is-active", item === button));
  selectedInput.src = scene.input;
  selectedInput.alt = "Selected input image";
  viewer.removeAttribute("src");
  setStatus("Loading preview from Hugging Face…");
  requestAnimationFrame(() => { viewer.src = scene.hfPreview; });
}
viewer.addEventListener("load", () => {
  if (active) setStatus(`Preview file · ${fmt(active.previewSize)} · drag to orbit · scroll to zoom`);
});
viewer.addEventListener("error", event => {
  const detail = event.detail && (event.detail.message || event.detail.type);
  setStatus(`Unable to load preview from Hugging Face${detail ? `: ${detail}` : ". The asset may not be uploaded yet."}`, true);
});
function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
}
selectedInputOpen?.addEventListener("click", () => {
  if (!selectedInput.src || !lightbox) return;
  lightboxImage.src = selectedInput.src;
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
});
lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeLightbox(); });
fetch("demo-selected.json?v=4").then(response => {
  if (!response.ok) throw new Error(`manifest HTTP ${response.status}`);
  return response.json();
}).then(items => {
  scenes = items;
  strip.innerHTML = scenes.map(scene => `<button class="demo-thumb" type="button" role="listitem" data-case="${scene.case}"><img src="${scene.input}" alt="${scene.case} input image" loading="lazy"></button>`).join("");
  const buttons = [...strip.querySelectorAll(".demo-thumb")];
  buttons.forEach((button, index) => button.addEventListener("click", () => selectScene(scenes[index], button)));
  if (buttons[0]) selectScene(scenes[0], buttons[0]);
}).catch(error => setStatus(`Unable to load demo manifest: ${error.message}`, true));

