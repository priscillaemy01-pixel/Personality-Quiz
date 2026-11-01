const questions = [
  
  {
    prompt: "Where would you like to go on your next big adventure?",
    answers: [
      { text: "Nether.", type: "fighter" },
      { text: "Caves.", type: "miner" },
      { text: "I don't know yet.", type: "builder" },
      { text: "Village.", type: "farmer" },
    ],
  },
  
  {
    prompt: "Which Minecraft treasure would make your day?",
    answers: [
      { text: "A powerful enchanted sword.", type: "fighter" },
      { text: "A pocket full of diamonds.", type: "miner" },
      { text: "A dream build.", type: "builder" },
      { text: "A happy farm.", type: "farmer" },
    ],
  },
  {
    prompt: "Your friends need help preparing for a long trip. You…",
    answers: [
      { text: "Offer to lead the way and protect everyone.", type: "fighter" },
      { text: "Collect useful ores and make better tools.", type: "miner" },
      { text: "Build a safe place to rest along the route.", type: "builder" },
      { text: "Pack food for the road.", type: "farmer" },
    ],
  },
  {
    prompt: "Pick the job you'd enjoy most in a village.",
    answers: [
      { text: "Guarding the village from monsters.", type: "fighter" },
      { text: "Exploring the mines for valuable resources.", type: "miner" },
      { text: "Designing houses, bridges, and town squares.", type: "builder" },
      { text: "Growing crops and caring for the animals.", type: "farmer" },
    ],
  },
  
  
];

const results = {
  fighter: {
    title: "The Fighter",
    symbol: "⚔",
    color: "fighter",
    description:
      "Brave, quick-thinking, and always ready for a challenge, you protect your friends and face every mob head-on. The Overworld is safer with you around.",
    strengths: "Courage · quick reflexes · loyalty",
    reminder: "Even the bravest adventurer needs a safe place to rest.",
  },
  miner: {
    title: "The Miner",
    symbol: "◆",
    color: "miner",
    description:
      "Curious and resourceful, you know the best treasures are found by exploring. You keep your torches close, your pickaxe ready, and your eyes open for what lies below.",
    strengths: "Curiosity · patience · resourcefulness",
    reminder: "Take a torch, watch your step, and enjoy the discovery.",
  },
  builder: {
    title: "The Builder",
    symbol: "▦",
    color: "builder",
    description:
      "You can look at an empty patch of land and picture something wonderful. With creativity and a good stash of blocks, you make the world feel more like home.",
    strengths: "Creativity · imagination · attention to detail",
    reminder: "Your next great idea can start with just one block.",
  },
  farmer: {
    title: "The Farmer",
    symbol: "✿",
    color: "farmer",
    description:
      "Patient, caring, and happiest when things are growing, you keep everyone well fed. Your crops, animals, and generous spirit make any world a better place.",
    strengths: "Kindness · patience · a green thumb",
    reminder: "All good things take time to grow—including you.",
  },
};

const welcomeScreen = document.querySelector("#welcome-screen");
const quizScreen = document.querySelector("#quiz-screen");
const resultScreen = document.querySelector("#result-screen");
const questionCount = document.querySelector("#question-count");
const questionContent = document.querySelector("#question-content");
const progressTrack = document.querySelector("#progress-track");
const progressFill = document.querySelector("#progress-fill");
const resultContent = document.querySelector("#result-content");
const backButton = document.querySelector("#back-button");
const startButton = document.querySelector("#start-button");
const restartButton = document.querySelector("#restart-button");

let currentQuestion = 0;
const answers = [];

startButton.addEventListener("click", () => {
  currentQuestion = 0;
  answers.length = 0;
  showScreen(quizScreen);
  renderQuestion();
});

backButton.addEventListener("click", () => {
  if (currentQuestion === 0) {
    showScreen(welcomeScreen);
    return;
  }
  currentQuestion -= 1;
  answers.pop();
  renderQuestion();
});

restartButton.addEventListener("click", () => {
  currentQuestion = 0;
  answers.length = 0;
  showScreen(welcomeScreen);
  startButton.focus();
});

function showScreen(screenToShow) {
  [welcomeScreen, quizScreen, resultScreen].forEach((screen) => {
    screen.hidden = screen !== screenToShow;
  });
}

function renderQuestion() {
  const question = questions[currentQuestion];
  questionCount.textContent = `${String(currentQuestion + 1).padStart(2, "0")} / ${questions.length}`;
  progressTrack.setAttribute("aria-valuenow", String(currentQuestion + 1));
  progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  backButton.setAttribute(
    "aria-label",
    currentQuestion === 0 ? "Back to welcome screen" : "Go to previous question",
  );

  const heading = document.createElement("h2");
  heading.className = "question-title";
  heading.id = "question-title";
  heading.tabIndex = -1;
  heading.textContent = question.prompt;

  const answerList = document.createElement("div");
  answerList.className = "answer-list";
  answerList.setAttribute("role", "group");
  answerList.setAttribute("aria-labelledby", heading.id);

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.type = "button";
    button.innerHTML = `<span class="answer-letter">${String.fromCharCode(65 + index)}</span><span>${answer.text}</span><span class="answer-arrow" aria-hidden="true">→</span>`;
    button.addEventListener("click", () => selectAnswer(answer.type));
    answerList.append(button);
  });

  questionContent.replaceChildren(heading, answerList);
  heading.focus();
}

function selectAnswer(type) {
  answers[currentQuestion] = type;
  if (currentQuestion < questions.length - 1) {
    currentQuestion += 1;
    renderQuestion();
    return;
  }
  renderResult();
}

function renderResult() {
  const scores = Object.fromEntries(Object.keys(results).map((type) => [type, 0]));
  answers.forEach((type) => {
    scores[type] += 1;
  });

  const winningType = Object.keys(results).reduce((winner, type) =>
    scores[type] > scores[winner] ? type : winner,
  );
  const result = results[winningType];

  resultContent.className = `result-copy result-${result.color}`;

  const symbol = document.createElement("div");
  symbol.className = "result-symbol";
  symbol.setAttribute("aria-hidden", "true");
  symbol.textContent = result.symbol;

  const kicker = document.createElement("p");
  kicker.className = "result-kicker";
  kicker.textContent = "Your Minecraft role is";

  const title = document.createElement("h1");
  title.className = "result-title";
  title.textContent = result.title;

  const description = document.createElement("p");
  description.className = "result-description";
  description.textContent = result.description;

  const strengths = document.createElement("div");
  strengths.className = "result-strengths";
  const strengthLabel = document.createElement("span");
  strengthLabel.className = "strength-label";
  strengthLabel.textContent = "Your strengths";
  const strengthText = document.createElement("p");
  strengthText.textContent = result.strengths;
  strengths.append(strengthLabel, strengthText);

  const reminder = document.createElement("p");
  reminder.className = "result-reminder";
  const reminderLabel = document.createElement("span");
  reminderLabel.textContent = "A little reminder";
  const reminderText = document.createElement("em");
  reminderText.textContent = result.reminder;
  reminder.append(reminderLabel, document.createElement("br"), reminderText);

  resultContent.replaceChildren(symbol, kicker, title, description, strengths, reminder);
  showScreen(resultScreen);
  restartButton.focus();
}
