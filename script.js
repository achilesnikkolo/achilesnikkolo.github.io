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

const quizQuestions = [
  {
    question: 'How do you take your kape?',
    options: [
      { label: 'Black and strong, like lola makes it', points: { barako: 3 } },
      { label: 'Black, but smooth and light', points: { benguet: 3 } },
      { label: 'Sweet, with condensed milk', points: { spanishLatte: 3 } },
      {
        label: 'Creamy, with something special',
        points: { ube: 2, spanishLatte: 1 },
      },
    ],
  },
  {
    question: 'Which flavors do you enjoy most?',
    options: [
      { label: 'Bold and earthy', points: { barako: 2 } },
      { label: 'Bright and fruity', points: { benguet: 2 } },
      { label: 'Sweet and milky', points: { spanishLatte: 2, ube: 1 } },
      { label: 'Nutty and vanilla-like, like ube halaya', points: { ube: 2 } },
    ],
  },
  {
    question: 'When do you usually have your coffee?',
    options: [
      {
        label: 'Early morning, with pandesal',
        points: { barako: 2, benguet: 1 },
      },
      { label: 'A slow weekend morning, Baguio style', points: { benguet: 2 } },
      { label: 'Merienda time', points: { ube: 2, spanishLatte: 1 } },
      { label: 'At a café with friends', points: { spanishLatte: 2, ube: 1 } },
    ],
  },
];

const quizProducts = {
  barako: {
    emoji: '☕',
    name: 'Kapeng Barako',
    description:
      'Bold, earthy Liberica coffee from Batangas. Strong enough to wake up the whole barangay, and perfect with pandesal.',
  },
  benguet: {
    emoji: '⛰️',
    name: 'Benguet Arabica',
    description:
      'Grown in the cool highlands of the Cordillera. Bright and smooth, best brewed slowly as a pour-over.',
  },
  spanishLatte: {
    emoji: '🥛',
    name: 'Spanish Latte',
    description:
      'Espresso sweetened with condensed milk. Rich, creamy, and a favorite at Filipino cafés.',
  },
  ube: {
    emoji: '💜',
    name: 'Ube Latte',
    description:
      'A creamy latte with ube, the purple yam behind your favorite Filipino desserts. Sweet, nutty, and made for merienda.',
  },
};

const quizContainer = document.getElementById('quiz');
let currentQuestion = 0;
let scores = {};

function startQuiz(moveFocus = false) {
  currentQuestion = 0;
  scores = {};
  renderQuestion(moveFocus);
}

function renderQuestion(moveFocus) {
  const { question, options } = quizQuestions[currentQuestion];
  quizContainer.replaceChildren();

  // New: visual progress bar
  const track = document.createElement('div');
  track.className = 'quiz__track';
  track.setAttribute('aria-hidden', 'true');
  const fill = document.createElement('div');
  fill.className = 'quiz__fill';
  fill.style.width = `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;
  track.append(fill);

  const progress = document.createElement('p');
  progress.className = 'quiz__progress';
  progress.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;

  const heading = document.createElement('p');
  heading.className = 'quiz__question';
  heading.textContent = question;
  heading.tabIndex = -1;

  const optionList = document.createElement('div');
  optionList.className = 'quiz__options';

  options.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quiz__option';
    button.textContent = option.label;
    button.addEventListener('click', () => handleAnswer(option));
    optionList.append(button);
  });

  quizContainer.append(track, progress, heading, optionList);
  if (moveFocus) heading.focus();
}

function handleAnswer(option) {
  for (const [product, points] of Object.entries(option.points)) {
    scores[product] = (scores[product] || 0) + points;
  }

  currentQuestion++;

  if (currentQuestion < quizQuestions.length) {
    renderQuestion(true);
  } else {
    showResult();
  }
}

function showResult() {
  const winner = Object.keys(quizProducts).reduce((best, key) =>
    (scores[key] || 0) > (scores[best] || 0) ? key : best,
  );
  const product = quizProducts[winner];

  quizContainer.replaceChildren();

  const card = document.createElement('div');
  card.className = 'quiz__result';

  const emoji = document.createElement('p');
  emoji.className = 'quiz__result-emoji';
  emoji.textContent = product.emoji;
  emoji.setAttribute('aria-hidden', 'true');

  const label = document.createElement('p');
  label.className = 'quiz__progress';
  label.textContent = 'Your perfect kape';

  const name = document.createElement('p');
  name.className = 'quiz__result-name';
  name.textContent = product.name;
  name.tabIndex = -1;

  const description = document.createElement('p');
  description.className = 'quiz__result-description';
  description.textContent = product.description;

  const restart = document.createElement('button');
  restart.type = 'button';
  restart.className = 'button button--secondary';
  restart.textContent = 'Take the quiz again';
  restart.addEventListener('click', () => startQuiz(true));

  card.append(emoji, label, name, description, restart);
  quizContainer.append(card);
  name.focus();
}

if (quizContainer) startQuiz();
