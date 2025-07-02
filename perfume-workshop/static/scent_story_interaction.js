document.querySelectorAll('.ingredient-item img').forEach(img => {
  img.style.cursor = 'pointer';
  img.addEventListener('click', function(e) {
    const href = this.parentElement.getAttribute('data-href');
    if (href) window.location.href = href;
  });
}); 