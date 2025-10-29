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
let currentIndex = 0;

function showQuestion(index) {
  if (questions.length === 0) return;
  currentIndex = Math.max(0, Math.min(index, questions.length - 1));
  questions.forEach((q, i) => {
    q.style.display = i === currentIndex ? "block" : "none";
  });
  // Atualiza estado dos botões
  if (prevBtn) prevBtn.disabled = currentIndex === 0;
  if (nextBtn) nextBtn.disabled = currentIndex === questions.length - 1;
}

// Inicializa exibição
showQuestion(0);

// Seleção de opção (escopo por pergunta)
document.querySelectorAll(".quiz-option").forEach((option) => {
  option.addEventListener("click", () => {
    const parentQuestion = option.closest(".quiz-question");
    if (!parentQuestion) return;
    parentQuestion.querySelectorAll(".quiz-option").forEach((opt) => opt.classList.remove("selected"));
    option.classList.add("selected");
  });
});

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
    const explanation = question.dataset.explanation;
    if (explanation) {
      feedback.innerHTML += `<div class="explanation">${explanation}</div>`;
    } else {
      feedback.innerHTML += `<div class="explanation">Sem explicação. Para adicionar, inclua <code>data-explanation="Sua explicação aqui"</code> na div <code>.quiz-question</code>.</div>`;
    }

    // marca como respondida e evita re-pontuar
    question.dataset.answered = "true";
    answeredCount++;

    // trava opções desta pergunta
    question.querySelectorAll(".quiz-option").forEach((opt) => opt.classList.add("locked"));

    // se todas respondidas, mostra resultado final
    if (answeredCount === questions.length) {
      const resultText = document.getElementById("result-text");
      if (resultText && quizResult) {
        resultText.textContent = `Você acertou ${totalScore} de ${questions.length} perguntas.`;
        quizResult.style.display = "block";
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
    if (quizResult) quizResult.style.display = "none";
    if (quizControls) quizControls.style.display = "flex";
    showQuestion(0);
    document.getElementById("quiz").scrollIntoView({ behavior: "smooth" });
  });
}
