# DistScene project page

Static project page for **DistScene: Object-to-Scene Distillation for 3D Scene Generation**.

## Local preview

```bash
python -m http.server 4173
```

Open <http://127.0.0.1:4173>.

The resource buttons intentionally link to the future GitHub project page until the arXiv, code, checkpoint, and dataset URLs are ready. The page includes the local demonstration video without a section title. The interactive Demo section is being developed separately in `../DistScene-demo-lab/` and is not included in this page build yet.

## Method figure sources

Use the DistScene manuscript at `../latex/paper_overleaf/iclr2027/main.tex`, which defines `\ourname` as DistScene and includes `sections/method_dk.tex`.

- Figure 2 (`fig:data_curation`): `figures/method_overview_data.pdf`, referenced at `sections/method_dk.tex:22`.
- Figure 3 (`fig:inference`): `figures/method_structure.pdf`, referenced at `sections/method_dk.tex:52`.

The website PNGs are rendered from these original PDFs with Poppler (`-cropbox -scale-to 2400 -png -singlefile`). Captions follow the same LaTeX source. Do not use figures from `km_3dscene_nips2026`: that directory contains the separate HoloRoom paper.

## Local 3D preview

Interactive preview assets are kept in the separate local `../DistScene-demo-lab/` workspace while the main page is prepared for GitHub Pages.
The current local files are the reviewed `geom25_tex1024_auto_q92` candidates:
they retain the original mesh/material layout and UV references, resize embedded
textures to 1024 px, and apply conservative per-mesh geometry reduction. Each
was checked against the untouched source with a fixed-camera side-by-side page
and in the real local `model-viewer` page. Original textured GLBs remain
read-only on the scene server and are never copied into Git or uploaded by this
page; historical website files are preserved in the rebuild workspace.

All rebuild scripts, source manifests, metrics, and browser QA notes are kept in
`../work/distscene_preview_rebuild_20261003/`.

The Demo lab currently exposes one compact PIPR01_002_03b preview. Its local GLB uses Draco geometry compression and 512 px JPEG textures and is approximately 25.9 MiB; larger scene assets remain available there for debugging.


