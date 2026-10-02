const copyButton = document.querySelector('#copy-citation');
const citation = document.querySelector('#bibtex code');
const copyStatus = document.querySelector('#copy-status');

copyButton?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(citation.textContent);
    copyButton.innerHTML = 'Copied <span>✓</span>';
    copyStatus.textContent = 'BibTeX copied to your clipboard.';
    window.setTimeout(() => {
      copyButton.innerHTML = 'Copy BibTeX <span>⌘ C</span>';
      copyStatus.textContent = 'The citation block is a working placeholder while the paper metadata is finalized.';
    }, 2200);
  } catch {
    copyStatus.textContent = 'Select the BibTeX block above to copy it manually.';
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
