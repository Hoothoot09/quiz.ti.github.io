// Navegação por abas (se existir)
document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab-button").forEach((btn) => btn.classList.remove("active"));
    document.querySelectorAll(".content-section").forEach((section) => section.classList.remove("active"));
    button.classList.add("active");
    const tabId = button.getAttribute("data-tab");
    const target = document.getElementById(tabId);
    if (target) target.classList.add("active");
  });
});

// Botão Voltar ao Topo
const backToTopButton = document.getElementById("backToTop");
const icon = document.getElementById("icon");

window.addEventListener("scroll", () => {
  if (!backToTopButton || !icon) return;
  if (window.pageYOffset > 300) {
    backToTopButton.classList.add("visible");
    icon.classList.add("visible");
  } else {
    backToTopButton.classList.remove("visible");
    icon.classList.remove("visible");
  }
});

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// --- Quiz: uma questão por vez ---
const questions = Array.from(document.querySelectorAll(".quiz-question"));
const prevBtn = document.getElementById("prev-question");
const nextBtn = document.getElementById("next-question");
const checkBtn = document.getElementById("check-answers");
const quizResult = document.getElementById("quiz-result");
const quizControls = document.getElementById("quiz-controls");
const playerForm = document.getElementById("player-form");
const startBtn = document.getElementById("start-quiz");
const playerNameInput = document.getElementById("player-name");
const playerSectorInput = document.getElementById("player-sector");
const playerMsg = document.getElementById("player-msg");
const progressEl = document.getElementById("progress");
const leaderboardDiv = document.getElementById("leaderboard");
const leaderboardList = document.getElementById("leaderboard-list");
let currentIndex = 0;
let quizStarted = false;
let playerName = "";
let playerSector = "";

function showQuestion(index) {
  if (questions.length === 0) return;
  currentIndex = Math.max(0, Math.min(index, questions.length - 1));
  questions.forEach((q, i) => {
    q.style.display = i === currentIndex ? "block" : "none";
  });
  // Atualiza estado dos botões
  if (prevBtn) prevBtn.disabled = currentIndex === 0;
  if (nextBtn) nextBtn.disabled = currentIndex === questions.length - 1;
  // atualiza progresso
  if (progressEl) {
    progressEl.style.display = quizStarted ? "block" : "none";
    progressEl.textContent = `Pergunta ${currentIndex + 1} de ${questions.length}`;
  }
}

// Inicializa exibição
showQuestion(0);

// esconder controles até o usuário iniciar
if (quizControls) quizControls.style.display = "none";
if (progressEl) progressEl.style.display = "none";
if (leaderboardDiv) leaderboardDiv.style.display = "none";

// Seleção de opção (escopo por pergunta)
document.querySelectorAll(".quiz-option").forEach((option) => {
  option.addEventListener("click", () => {
    if (!quizStarted) {
      showPlayerMessage("Por favor, preencha seu nome e setor e clique em Começar antes de responder.");
      return;
    }
    const parentQuestion = option.closest(".quiz-question");
    if (!parentQuestion) return;
    parentQuestion.querySelectorAll(".quiz-option").forEach((opt) => opt.classList.remove("selected"));
    option.classList.add("selected");
  });
});

// Iniciar quiz após preencher nome/setor
function showPlayerMessage(text) {
  if (!playerMsg) {
    alert(text);
    return;
  }
  playerMsg.textContent = text;
  playerMsg.style.display = "block";
  setTimeout(() => {
    playerMsg.style.display = "";
  }, 3500);
}

if (startBtn) {
  startBtn.addEventListener("click", () => {
    const name = playerNameInput ? playerNameInput.value.trim() : "";
    const sector = playerSectorInput ? playerSectorInput.value.trim() : "";
    if (!name || !sector) {
      showPlayerMessage("Por favor, preencha seu nome e setor antes de começar.");
      return;
    }
    playerName = name;
    playerSector = sector;
    quizStarted = true;
    // esconder form e mostrar controles
    if (playerForm) playerForm.style.display = "none";
    if (quizControls) quizControls.style.display = "flex";
    if (progressEl) progressEl.style.display = "block";
    showQuestion(0);
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    showQuestion(currentIndex - 1);
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    showQuestion(currentIndex + 1);
  });
}

// Pontuação e verificação por pergunta
let totalScore = 0;
let answeredCount = 0;

if (checkBtn) {
  checkBtn.addEventListener("click", () => {
    if (!quizStarted) {
      showPlayerMessage("Você precisa começar o quiz antes de verificar respostas.");
      return;
    }
    const question = questions[currentIndex];
    if (!question) return;

    // se já verificada, apenas rola para o feedback
    if (question.dataset.answered === "true") {
      const fb = question.querySelector(".feedback");
      if (fb) fb.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const selected = question.querySelector(".quiz-option.selected");
    let feedback = question.querySelector(".feedback");
    if (!feedback) {
      feedback = document.createElement("div");
      feedback.className = "feedback";
      question.appendChild(feedback);
    }

    if (!selected) {
      feedback.innerHTML = '<p class="warning">Por favor, selecione uma opção antes de verificar.</p>';
      feedback.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const isCorrect = selected.getAttribute("data-correct") === "true";

    if (isCorrect) {
      totalScore++;
      selected.classList.add("correct");
      feedback.innerHTML = '<p class="correct-msg">Correto! Você ganhou 1 ponto.</p>';
    } else {
      selected.classList.add("incorrect");
      const correctOpt = question.querySelector('.quiz-option[data-correct="true"]');
      if (correctOpt) {
        correctOpt.classList.add("correct");
        // extrai letra e texto da opção correta
        const strong = correctOpt.querySelector("strong");
        const letter = strong ? strong.textContent.trim() : ""
        const text = correctOpt.textContent.replace(letter, "").trim();
        feedback.innerHTML = `<p class="incorrect-msg">Errado. A resposta correta é <strong>${letter}</strong> ${text}.</p>`;
      } else {
        feedback.innerHTML = '<p class="incorrect-msg">Errado.</p>';
      }
    }

    // explicação (se existir data-explanation na pergunta)
      let explanation = question.dataset.explanation;
      if (explanation) {
        // se o texto iniciar com "Explicação:" (case-insensitive), transforma essa palavra em negrito
        // ex: "Explicação: Texto..." -> "<strong>Explicação:</strong> Texto..."
        const replaced = explanation.replace(/^(\s*Explicação:\s*)/i, '<strong>Explicação:</strong> ');
        feedback.innerHTML += `<div class="explanation">${replaced}</div>`;
      } else {
        feedback.innerHTML += `<div class="explanation">Sem explicação. Para adicionar, inclua <code>data-explanation="Sua explicação aqui"</code> na div <code>.quiz-question</code>.</div>`;
      }

    // marca como respondida e evita re-pontuar
    question.dataset.answered = "true";
    answeredCount++;

    // trava opções desta pergunta
    question.querySelectorAll(".quiz-option").forEach((opt) => opt.classList.add("locked"));

    // se todas respondidas, mostra resultado final e salva no ranking
    if (answeredCount === questions.length) {
      const resultText = document.getElementById("result-text");
      if (resultText && quizResult) {
        resultText.textContent = `Você acertou ${totalScore} de ${questions.length} perguntas.`;
        quizResult.style.display = "block";
        // salvar entrada no leaderboard usando nome/setor fornecidos
        if (playerName && playerSector) {
          saveScoreToLeaderboard(playerName, playerSector, totalScore);
        }
        renderLeaderboard();
        quizResult.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
}

// Reiniciar quiz
const restartBtn = document.getElementById("restart-quiz");
if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    // reset visual e estado
    document.querySelectorAll(".quiz-option").forEach((opt) => opt.classList.remove("selected", "correct", "incorrect", "locked"));
    document.querySelectorAll(".quiz-question").forEach((q) => {
      delete q.dataset.answered;
      const fb = q.querySelector('.feedback');
      if (fb) fb.remove();
    });
    totalScore = 0;
    answeredCount = 0;
    // esconder resultado e leaderboard, voltar ao formulário
    if (quizResult) quizResult.style.display = "none";
    if (leaderboardDiv) leaderboardDiv.style.display = "none";
    if (quizControls) quizControls.style.display = "none";
    if (playerForm) playerForm.style.display = "flex";
    if (playerNameInput) playerNameInput.value = "";
    if (playerSectorInput) playerSectorInput.value = "";
    playerName = "";
    playerSector = "";
    quizStarted = false;
    showQuestion(0);
    if (progressEl) progressEl.style.display = "none";
    document.getElementById("quiz").scrollIntoView({ behavior: "smooth" });
  });
}

// --- Leaderboard / Persistência (localStorage) ---
function getLeaderboard() {
  try {
    const raw = localStorage.getItem("quiz_leaderboard");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Erro ao ler leaderboard:", e);
    return [];
  }
}

function saveScoreToLeaderboard(name, sector, score) {
  if (!name || !sector) return getLeaderboard();
  const board = getLeaderboard();
  board.push({ name: name.trim(), sector: sector.trim(), score: Number(score), date: new Date().toISOString() });
  // ordenar desc por score, empates por data (mais recente primeiro)
  board.sort((a, b) => b.score - a.score || new Date(b.date) - new Date(a.date));
  try {
    localStorage.setItem("quiz_leaderboard", JSON.stringify(board));
  } catch (e) {
    console.error("Erro ao salvar leaderboard:", e);
  }
  return board;
}

function renderLeaderboard(list) {
  if (!leaderboardList || !leaderboardDiv) return;
  leaderboardList.innerHTML = "";
  const top = (list || getLeaderboard()).slice(0, 10);
  if (top.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Nenhuma pontuação registrada ainda.";
    leaderboardList.appendChild(li);
  } else {
    top.forEach((entry, idx) => {
      const li = document.createElement("li");
      const date = new Date(entry.date);
      li.innerHTML = `<strong>#${idx + 1} ${entry.name}</strong> (${entry.sector}) — ${entry.score} pts <span style="color:#6b7280; font-size:0.9rem;"> — ${date.toLocaleDateString()} ${date.toLocaleTimeString()}</span>`;
      leaderboardList.appendChild(li);
    });
  }
  leaderboardDiv.style.display = "block";
}
