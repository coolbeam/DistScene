
const mainVideo = document.querySelector("#main-demo-video");
const mainVideoStatus = document.querySelector("#main-video-status");
if (mainVideo) {
  fetch("assets/demo-video/v6.mp4", { cache: "force-cache" })
    .then(response => {
      if (!response.ok) throw new Error(`video HTTP ${response.status}`);
      return response.blob();
    })
    .then(blob => {
      mainVideo.src = URL.createObjectURL(blob);
      mainVideo.load();
      mainVideo.addEventListener("canplaythrough", () => {
        if (mainVideoStatus) mainVideoStatus.textContent = "Ready · complete video buffered";
        mainVideo.play().catch(() => {});
      }, { once: true });
    })
    .catch(error => {
      if (mainVideoStatus) mainVideoStatus.textContent = `Unable to load demo video: ${error.message}`;
    });
}
const viewer = document.querySelector("#scene-viewer");
const status = document.querySelector("#viewer-status");
const strip = document.querySelector("#demo-strip");
const selectedInput = document.querySelector("#selected-input");
const selectedInputOpen = document.querySelector("#selected-input-open");
const demoSelection = document.querySelector("#demo-selection");
const viewerOpen = document.querySelector("#viewer-open");
const viewerClose = document.querySelector("#viewer-close");
let viewerVisible = false;
let modelViewerReady = null;
function loadModelViewer() {
  if (modelViewerReady) return modelViewerReady;
  modelViewerReady = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@google/model-viewer@4.1.0/dist/model-viewer.min.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return modelViewerReady;
}
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
  setStatus(viewerVisible ? "Loading preview from Hugging Face…" : "Preview is closed. Click Open 3D preview to load it.");
  if (viewerVisible) requestAnimationFrame(() => { viewer.src = scene.hfPreview; });
}

async function openViewer() {
  if (!active || viewerVisible) return;
  viewerVisible = true;
  demoSelection.hidden = false;
  viewerOpen.disabled = true;
  viewerClose.disabled = false;
  setStatus("Loading preview from Hugging Face…");
  try {
    await loadModelViewer();
    viewer.setAttribute("src", active.hfPreview);
    viewer.src = active.hfPreview;
  } catch {
    setStatus("Unable to load the 3D viewer.", true);
  }
}
function closeViewer() {
  viewerVisible = false;
  viewer.removeAttribute("src");
  demoSelection.hidden = true;
  viewerOpen.disabled = false;
  viewerClose.disabled = true;
  setStatus("Preview is closed. Click Open 3D preview to load it.");
}
viewerOpen?.addEventListener("click", openViewer);
viewerClose?.addEventListener("click", closeViewer);

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



const renderedStrip = document.querySelector("#rendered-strip");
const renderedInput = document.querySelector("#rendered-input");
const renderedInputOpen = document.querySelector("#rendered-input-open");
const renderedVideo = document.querySelector("#rendered-video");
const renderedVideoStatus = document.querySelector("#rendered-video-status");
const renderedVideoFrame = document.querySelector("#rendered-video-frame");
const renderedOpen = document.querySelector("#rendered-open");
const renderedClose = document.querySelector("#rendered-close");
let renderedActive = null;
let renderedVisible = false;
function setRenderedStatus(text, error = false) {
  if (!renderedVideoStatus) return;
  renderedVideoStatus.textContent = text;
  renderedVideoStatus.classList.toggle("viewer-error", error);
}
function selectRendered(item, button) {
  renderedActive = item;
  renderedStrip.querySelectorAll(".demo-thumb").forEach(node => node.classList.toggle("is-active", node === button));
  renderedInput.src = item.input;
  renderedInput.alt = `${item.case} input image`;
  if (renderedVisible) loadRenderedVideo();
  else setRenderedStatus("Video is hidden. Click Show video to load it.");
}

function loadRenderedVideo() {
  if (!renderedActive) return;
  renderedVideo.pause();
  renderedVideo.src = renderedActive.hfVideo;
  renderedVideo.load();
  renderedVideo.play().catch(() => {});
  setRenderedStatus("Loading rendered video from Hugging Face…");
}
function openRenderedVideo() {
  if (renderedVisible) return;
  renderedVisible = true;
  renderedVideoFrame.hidden = false;
  renderedOpen.disabled = true;
  renderedClose.disabled = false;
  loadRenderedVideo();
}
function closeRenderedVideo() {
  renderedVisible = false;
  renderedVideo.pause();
  renderedVideo.removeAttribute("src");
  renderedVideo.load();
  renderedVideoFrame.hidden = true;
  renderedOpen.disabled = false;
  renderedClose.disabled = true;
  setRenderedStatus("Video is hidden until you click Show video.");
}
renderedOpen?.addEventListener("click", openRenderedVideo);
renderedClose?.addEventListener("click", closeRenderedVideo);

renderedVideo?.addEventListener("loadedmetadata", () => {
  if (renderedActive) {
    setRenderedStatus(`Rendered video · ${(renderedActive.videoSize / 1048576).toFixed(1)} MiB · ${renderedVideo.videoWidth}×${renderedVideo.videoHeight}`);
    renderedVideo.play().catch(() => {});
  }
});
renderedVideo?.addEventListener("error", () => setRenderedStatus("Unable to load rendered video from Hugging Face. The file may still be uploading.", true));
renderedInputOpen?.addEventListener("click", () => {
  if (!renderedInput.src || !lightbox) return;
  lightboxImage.src = renderedInput.src;
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
});
fetch("rendered-selected.json?v=1").then(response => {
  if (!response.ok) throw new Error(`rendered manifest HTTP ${response.status}`);
  return response.json();
}).then(items => {
  renderedStrip.innerHTML = items.map(item => `<button class="demo-thumb" type="button" role="listitem"><img src="${item.input}" alt="${item.case} input image" loading="lazy"></button>`).join("");
  const buttons = [...renderedStrip.querySelectorAll(".demo-thumb")];
  buttons.forEach((button, index) => button.addEventListener("click", () => selectRendered(items[index], button)));
  if (buttons[0]) selectRendered(items[0], buttons[0]);
}).catch(error => setRenderedStatus(`Unable to load rendered manifest: ${error.message}`, true));
