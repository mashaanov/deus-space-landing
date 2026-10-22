// Apply the saved theme before the application and styles are painted.
(() => {
  let theme = 'light';
  try {
    const saved = localStorage.getItem('novicovs-theme');
    if (saved === 'dark' || saved === 'light') theme = saved;
  } catch { /* Storage is optional. */ }
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();
