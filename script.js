// Navegação por abas
document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    // Remove a classe active de todos os botões e seções
    document.querySelectorAll(".tab-button").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.remove("active");
    });

    // Adiciona a classe active ao botão clicado
    button.classList.add("active");

    // Mostra a seção correspondente
    const tabId = button.getAttribute("data-tab");
    document.getElementById(tabId).classList.add("active");
  });
});

// Botão Voltar ao Topo
const backToTopButton = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    backToTopButton.classList.add("visible");
  } else {
    backToTopButton.classList.remove("visible");
  }
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Quiz Interativo
document.querySelectorAll(".quiz-option").forEach((option) => {
  option.addEventListener("click", () => {
    // Remove a seleção de outras opções na mesma pergunta
    const parentQuestion = option.parentElement;
    parentQuestion.querySelectorAll(".quiz-option").forEach((opt) => {
      opt.classList.remove("selected");
    });

    // Seleciona a opção clicada
    option.classList.add("selected");
  });
});

document.getElementById("check-answers").addEventListener("click", () => {
  let score = 0;
  let totalQuestions = document.querySelectorAll(".quiz-question").length;

  document.querySelectorAll(".quiz-question").forEach((question) => {
    const selectedOption = question.querySelector(".quiz-option.selected");
    if (
      selectedOption &&
      selectedOption.getAttribute("data-correct") === "true"
    ) {
      score++;
    }
  });

  const resultText = document.getElementById("result-text");
  const quizResult = document.getElementById("quiz-result");

  if (score === totalQuestions) {
    resultText.textContent = `Parabéns! Você acertou todas as ${totalQuestions} perguntas! Você demonstra excelente conhecimento sobre o uso responsável da tecnologia.`;
  } else if (score >= totalQuestions / 2) {
    resultText.textContent = `Você acertou ${score} de ${totalQuestions} perguntas. Seu conhecimento é bom, mas há espaço para melhorias. Revise o manual para aprimorar suas práticas.`;
  } else {
    resultText.textContent = `Você acertou ${score} de ${totalQuestions} perguntas. Recomendamos que você revise cuidadosamente o manual de uso responsável da tecnologia.`;
  }

  quizResult.style.display = "block";
  quizResult.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("restart-quiz").addEventListener("click", () => {
  // Remove seleções
  document.querySelectorAll(".quiz-option").forEach((option) => {
    option.classList.remove("selected");
  });

  // Esconde resultado
  document.getElementById("quiz-result").style.display = "none";

  // Rola para o topo do quiz
  document.getElementById("quiz").scrollIntoView({ behavior: "smooth" });
});
