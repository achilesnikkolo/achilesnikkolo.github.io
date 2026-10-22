// ===== Part 1: Theme toggle =====
const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function getCurrentTheme() {
  if (root.dataset.theme) return root.dataset.theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  try {
    localStorage.setItem('theme', theme);
  } catch (error) {}
}

themeToggle.setAttribute('aria-pressed', String(getCurrentTheme() === 'dark'));

themeToggle.addEventListener('click', () => {
  const nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';

  if (!document.startViewTransition || reducedMotion.matches) {
    applyTheme(nextTheme);
    return;
  }

  const rect = themeToggle.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  const transition = document.startViewTransition(() => applyTheme(nextTheme));

  transition.ready.then(() => {
    root.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${radius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: 'ease-out',
        pseudoElement: '::view-transition-new(root)',
      },
    );
  });
});

// ===== Part 2: Spotlight =====
document.querySelectorAll('.tile').forEach((tile) => {
  tile.addEventListener('pointermove', (event) => {
    const rect = tile.getBoundingClientRect();
    tile.style.setProperty('--x', `${event.clientX - rect.left}px`);
    tile.style.setProperty('--y', `${event.clientY - rect.top}px`);
  });
});

// ===== Part 4: Copy email and footer year =====
const copyButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-email__status');

if (copyButton) {
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copyButton.dataset.email);
      copyStatus.textContent = 'Email copied!';
    } catch (error) {
      copyStatus.textContent = copyButton.dataset.email;
    }

    setTimeout(() => {
      copyStatus.textContent = '';
    }, 3000);
  });
}

const yearElement = document.getElementById('year');
if (yearElement) yearElement.textContent = new Date().getFullYear();
