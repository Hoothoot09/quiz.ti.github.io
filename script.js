// Navegação por abas (se existir)
document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-button")
      .forEach((btn) => btn.classList.remove("active"));
    document
      .querySelectorAll(".content-section")
      .forEach((section) => section.classList.remove("active"));
    button.classList.add("active");
    const tabId = button.getAttribute("data-tab");
    const target = document.getElementById(tabId);
    if (target) target.classList.add("active");
  });
});

// Botão Voltar ao Topo
const backToTopButton = document.getElementById("backToTop");
const icon = document.getElementById("icon-seta");

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
// A URL da API pode ser configurada de 3 formas (ordem de prioridade):
// 1) meta tag no HTML: <meta name="quiz-api-url" content="https://meu-servidor.com">
// 2) objeto global: window.QUIZ_CONFIG = { apiUrl: 'https://meu-servidor.com' }
// 3) variável global simples: window.API_URL = 'https://meu-servidor.com'
// Se nenhuma for fornecida, fica vazia e o código usa localStorage como fallback.
const API_URL = (function () {
  try {
    const meta = document.querySelector('meta[name="quiz-api-url"]');
    if (meta && meta.content) return meta.content.trim();
  } catch (e) {
    // ignore
  }
  try {
    if (window && window.QUIZ_CONFIG && window.QUIZ_CONFIG.apiUrl)
      return window.QUIZ_CONFIG.apiUrl;
  } catch (e) {}
  try {
    if (window && window.API_URL) return window.API_URL;
  } catch (e) {}
  return "";
})();
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
  if (prevBtn) {
    prevBtn.disabled = currentIndex === 0;
    // aplica classe visual quando habilitado
    prevBtn.classList.toggle("btn-enabled", !prevBtn.disabled);
  }
  if (nextBtn) {
    // Próxima só habilitado se a pergunta atual já foi verificada
    const currentAnswered = questions[currentIndex].dataset.answered === "true";
    const disableNext =
      currentIndex === questions.length - 1 || !currentAnswered;
    nextBtn.disabled = disableNext;
    nextBtn.classList.toggle("btn-enabled", !nextBtn.disabled);
  }
  // atualiza progresso
  if (progressEl) {
    progressEl.style.display = quizStarted ? "block" : "none";
    progressEl.textContent = `Pergunta ${currentIndex + 1} de ${
      questions.length
    }`;
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
      showPlayerMessage(
        "Por favor, preencha seu nome e setor e clique em Começar antes de responder."
      );
      return;
    }
    const parentQuestion = option.closest(".quiz-question");
    if (!parentQuestion) return;
    parentQuestion
      .querySelectorAll(".quiz-option")
      .forEach((opt) => opt.classList.remove("selected"));
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
      showPlayerMessage(
        "Por favor, preencha seu nome e setor antes de começar."
      );
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
  checkBtn.addEventListener("click", async () => {
    if (!quizStarted) {
      showPlayerMessage(
        "Você precisa começar o quiz antes de verificar respostas."
      );
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
      feedback.innerHTML =
        '<p class="warning">Por favor, selecione uma opção antes de verificar.</p>';
      feedback.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const isCorrect = selected.getAttribute("data-correct") === "true";

    if (isCorrect) {
      totalScore++;
      selected.classList.add("correct");
      feedback.innerHTML =
        '<p class="correct-msg">Correto! Você ganhou 1 ponto.</p>';
    } else {
      selected.classList.add("incorrect");
      const correctOpt = question.querySelector(
        '.quiz-option[data-correct="true"]'
      );
      if (correctOpt) {
        correctOpt.classList.add("correct");
        // extrai letra e texto da opção correta
        const strong = correctOpt.querySelector("strong");
        const letter = strong ? strong.textContent.trim() : "";
        const text = correctOpt.textContent.replace(letter, "").trim();
        feedback.innerHTML = `<p class="incorrect-msg">Errado. A resposta correta é <strong>${letter}</strong> ${text}.</p>`;
      } else {
        feedback.innerHTML = '<p class="incorrect-msg">Errado.</p>';
      }
    }

    // explicação (se existir data-explanation na pergunta)
    let explanation = question.dataset.explanation;
    const source = question.dataset.source || question.dataset.fonte;
    if (explanation) {
      // se o texto iniciar com "Explicação:" (case-insensitive), transforma essa palavra em negrito
      // ex: "Explicação: Texto..." -> "<strong>Explicação:</strong> Texto..."
      const replaced = explanation.replace(
        /^(\s*Explicação:\s*)/i,
        "<strong>Explicação:</strong> "
      );
      feedback.innerHTML += `<div class="explanation">${replaced}`;
      // se tiver fonte (data-source ou data-fonte), adiciona abaixo em itálico e menor
      if (source) {
        // evita duplicar o prefixo Fonte:, adiciona conforme fornecido
        feedback.innerHTML += `<div class="source"><em>${source}</em></div>`;
      }
      feedback.innerHTML += `</div>`;
    } else {
      feedback.innerHTML += `<div class="explanation">Sem explicação. Para adicionar, inclua <code>data-explanation="Sua explicação aqui"</code> na div <code>.quiz-question</code>.</div>`;
    }

    // marca como respondida e evita re-pontuar
    question.dataset.answered = "true";
    answeredCount++;

    // após verificar, habilita o botão Próxima (se não for a última pergunta)
    if (nextBtn) {
      if (currentIndex !== questions.length - 1) {
        nextBtn.disabled = false;
        nextBtn.classList.add("btn-enabled");
      } else {
        // última pergunta: mantém Próxima desabilitada
        nextBtn.disabled = true;
        nextBtn.classList.remove("btn-enabled");
      }
    }

    // trava opções desta pergunta
    question
      .querySelectorAll(".quiz-option")
      .forEach((opt) => opt.classList.add("locked"));

    // se todas respondidas, mostra resultado final e salva no ranking
    if (answeredCount === questions.length) {
      const resultText = document.getElementById("result-text");
      if (resultText && quizResult) {
        resultText.textContent = `Você acertou ${totalScore} de ${questions.length} perguntas.`;
        // mostrar resultado
        quizResult.style.display = "block";
        // salvar entrada no leaderboard usando nome/setor fornecidos (tenta servidor, senão localStorage)
        let savedList = null;
        if (playerName && playerSector) {
          savedList = await saveScoreToLeaderboard(playerName, playerSector, totalScore);
        }
        // tentar obter versão mais atualizada do servidor quando disponível
        let latest = null;
        if (API_URL) {
          latest = await fetchLeaderboardFromServer();
        }
        // renderiza leaderboard: preferir latest (servidor), depois savedList (retorno da função), depois local
        if (latest && Array.isArray(latest)) {
          renderLeaderboard(latest);
        } else if (savedList && Array.isArray(savedList)) {
          renderLeaderboard(savedList);
        } else {
          renderLeaderboard();
        }
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
    document
      .querySelectorAll(".quiz-option")
      .forEach((opt) =>
        opt.classList.remove("selected", "correct", "incorrect", "locked")
      );
    document.querySelectorAll(".quiz-question").forEach((q) => {
      delete q.dataset.answered;
      const fb = q.querySelector(".feedback");
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

async function fetchLeaderboardFromServer() {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL.replace(/\/$/, "")}/leaderboard`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const list = await res.json();
    // clear previous error flag
    try { delete window.LAST_LEADERBOARD_ERROR; } catch (e) {}
    return list;
  } catch (e) {
    console.warn("Não foi possível buscar leaderboard do servidor:", e);
    try { window.LAST_LEADERBOARD_ERROR = e.message || String(e); } catch (err) {}
    return null;
  }
}

async function saveScoreToServer(entry) {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL.replace(/\/$/, "")}/leaderboard`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const list = await res.json();
    try { delete window.LAST_LEADERBOARD_ERROR; } catch (e) {}
    return list;
  } catch (e) {
    console.warn("Erro ao salvar no servidor:", e);
    try { window.LAST_LEADERBOARD_ERROR = e.message || String(e); } catch (err) {}
    return null;
  }
}

// salva no servidor se API_URL configurada, caso contrário usa localStorage
async function saveScoreToLeaderboard(name, sector, score) {
  if (!name || !sector) return getLeaderboard();
  const entry = { name: name.trim(), sector: sector.trim(), score: Number(score), date: new Date().toISOString() };

  if (API_URL) {
    const serverList = await saveScoreToServer(entry);
    if (serverList) {
      // armazena também localmente para fallback/offline
      try {
        localStorage.setItem("quiz_leaderboard", JSON.stringify(serverList));
      } catch (e) {
        console.warn("Não foi possível salvar cópia local do leaderboard:", e);
      }
      return serverList;
    }
    // se falhou no servidor, cai para local
  }

  // fallback: localStorage
  const board = getLeaderboard();
  board.push(entry);
  board.sort((a, b) => b.score - a.score || new Date(b.date) - new Date(a.date));
  try {
    localStorage.setItem("quiz_leaderboard", JSON.stringify(board));
  } catch (e) {
    console.error("Erro ao salvar leaderboard local:", e);
  }
  return board;
}

function renderLeaderboard(list) {
  if (!leaderboardList || !leaderboardDiv) return;
  console.log('renderLeaderboard called. items passed:', Array.isArray(list) ? list.length : 'null');
  leaderboardList.innerHTML = "";
  const top = (list || getLeaderboard()).slice(0, 10);
  // remove existing header if present to avoid duplicates
  const parent = leaderboardList.parentNode;
  if (parent) {
    const existingHeader = parent.querySelector('.leaderboard-header');
    if (existingHeader) existingHeader.remove();
  }
  // header
  const header = document.createElement('div');
  header.className = 'leaderboard-header';
  const title = document.createElement('div');
  title.className = 'leaderboard-title';
  title.textContent = 'Ranking — Top 10';
  const sub = document.createElement('div');
  sub.className = 'leaderboard-sub';
  sub.textContent = `${top.length} registro${top.length !== 1 ? 's' : ''}`;
  header.appendChild(title);
  header.appendChild(sub);
  // ensure header is shown above the list
  if (parent) parent.insertBefore(header, leaderboardList);

  // if there was an error fetching from server, show message
  try {
    if (window.LAST_LEADERBOARD_ERROR) {
      const errEl = parent.querySelector('.leaderboard-error');
      if (errEl) errEl.remove();
      const err = document.createElement('div');
      err.className = 'leaderboard-error';
      err.textContent = 'Não foi possível carregar o ranking do servidor. Exibindo dados locais.';
      parent.insertBefore(err, header.nextSibling);
      console.warn('Leaderboard error flag:', window.LAST_LEADERBOARD_ERROR);
    } else {
      const oldErr = parent.querySelector('.leaderboard-error');
      if (oldErr) oldErr.remove();
    }
  } catch (e) {
    console.warn('Erro ao processar mensagem de erro do leaderboard', e);
  }

  if (top.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Nenhuma pontuação registrada ainda.';
    leaderboardList.appendChild(li);
  } else {
    top.forEach((entry, idx) => {
      const li = document.createElement('li');
      li.className = 'leaderboard-item';

      const left = document.createElement('div');
      left.className = 'leader-left';
      const rank = document.createElement('div');
      rank.className = 'rank-badge';
      rank.textContent = `#${idx + 1}`;
      if (idx === 0) rank.classList.add('top1');
      else if (idx === 1) rank.classList.add('top2');
      else if (idx === 2) rank.classList.add('top3');

      const meta = document.createElement('div');
      meta.className = 'leader-meta';
      const nameEl = document.createElement('div');
      nameEl.className = 'name';
      nameEl.textContent = entry.name;
      const sectorEl = document.createElement('div');
      sectorEl.className = 'sector';
      sectorEl.textContent = entry.sector || '';
      meta.appendChild(nameEl);
      meta.appendChild(sectorEl);

      left.appendChild(rank);
      left.appendChild(meta);

      const right = document.createElement('div');
      right.className = 'leader-right';
      const score = document.createElement('div');
      score.className = 'score-badge';
      score.textContent = `${entry.score} pts`;
      const date = document.createElement('div');
      date.className = 'leader-date';
      date.textContent = new Date(entry.date).toLocaleString();
      right.appendChild(score);
      right.appendChild(date);

      li.appendChild(left);
      li.appendChild(right);
      leaderboardList.appendChild(li);
    });
  }
  leaderboardDiv.style.display = 'block';
}
