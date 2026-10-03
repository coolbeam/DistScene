const viewer = document.querySelector("#scene-viewer");
const status = document.querySelector("#viewer-status");
document.querySelectorAll(".scene-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".scene-button").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    const scene = button.dataset.scene;
    viewer.src = `assets/demo-scenes/${scene}/preview.glb`;
    status.textContent = `${scene} · drag to orbit · scroll to zoom`;
  });
});
