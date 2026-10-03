# DistScene project page

Static project page for **DistScene: Object-to-Scene Distillation for 3D Scene Generation**.

## Local preview

```bash
python -m http.server 4173
```

Open <http://127.0.0.1:4173>.

The resource buttons intentionally link back to this project page until the arXiv, code, checkpoint, and dataset URLs are ready. The video and demo areas are placeholders.

## Method figure sources

Use the DistScene manuscript at `../latex/paper_overleaf/iclr2027/main.tex`, which defines `\ourname` as DistScene and includes `sections/method_dk.tex`.

- Figure 2 (`fig:data_curation`): `figures/method_overview_data.pdf`, referenced at `sections/method_dk.tex:22`.
- Figure 3 (`fig:inference`): `figures/method_structure.pdf`, referenced at `sections/method_dk.tex:52`.

The website PNGs are rendered from these original PDFs with Poppler (`-cropbox -scale-to 2400 -png -singlefile`). Captions follow the same LaTeX source. Do not use figures from `km_3dscene_nips2026`: that directory contains the separate HoloRoom paper.

## Local 3D preview

Three local-only preview models are currently available under `assets/demo-scenes/`:

- `PIPR01_002_03b`: 27 MB
- `DistScene_v18`: 60 MB
- `EXT002_p90`: 41 MB

The previews were generated on the scene server by simplifying the geometry to roughly 8% of the original face count and assigning per-object average material colors. This keeps the files interactive in a browser while avoiding a 350 MB+ textured download. The original textured GLBs were not modified. The preview GLBs are ignored by Git and should move to object storage/CDN when the project page is published.
