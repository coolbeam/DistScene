const viewer = document.querySelector("#scene-viewer");
const status = document.querySelector("#viewer-status");
const previewURLs = {
  PIPR01_002_03b: "https://huggingface.co/coolbeam/DistScene-preview-assets/resolve/main/previews/PIPR01_002_03b/preview.glb",
};
if (!viewer || !status) throw new Error("Demo viewer markup is missing.");
viewer.addEventListener("load", () => {
  status.textContent = "PIPR01_002_03b · compressed preview loaded · drag to orbit · scroll to zoom";
});
viewer.addEventListener("error", (event) => {
  const detail = event.detail && (event.detail.message || event.detail.type);
  status.textContent = `Preview failed to load${detail ? `: ${detail}` : ". Check the Hugging Face asset URL and Draco decoder."}`;
  status.classList.add("viewer-error");
});
document.querySelectorAll(".scene-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".scene-button").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    const scene = button.dataset.scene;
    viewer.src = previewURLs[scene];
    status.textContent = `${scene} · drag to orbit · scroll to zoom`;
  });
});
