const viewer = document.querySelector("#scene-viewer");
const status = document.querySelector("#viewer-status");
viewer.addEventListener("load", () => {
  status.textContent = "PIPR01_002_03b · loaded · drag to orbit · scroll to zoom";
});
viewer.addEventListener("error", (event) => {
  const detail = event.detail && (event.detail.message || event.detail.type);
  status.textContent = `Preview failed to load${detail ? `: ${detail}` : ". Check that preview.glb and assets/draco_decoder/ are committed."}`;
  status.classList.add("viewer-error");
});
document.querySelectorAll(".scene-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".scene-button").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    const scene = button.dataset.scene;
    viewer.src = `./assets/demo-scenes/${scene}/preview.glb`;
    status.textContent = `${scene} · drag to orbit · scroll to zoom`;
  });
});
