# Guia / Quiz — Uso Responsável da Tecnologia

Uma aplicação estática (HTML/CSS/JS) para avaliar conhecimentos sobre o uso responsável de equipamentos e softwares corporativos. Este repositório contém um quiz interativo pensado para treinamento interno: o usuário responde uma pergunta por vez, recebe feedback imediato, pode ver explicações e, ao final, salvar seu resultado em um ranking (nome + setor) armazenado no navegador.

## Principais funcionalidades

- Exibição de 1 pergunta por vez com navegação Anterior / Próxima.

- Seleção de uma opção por pergunta (marcação visual `.selected`).

- Verificação por pergunta: ao clicar em "Verificar Respostas" a pergunta atual é avaliada, a alternativa correta é destacada e o usuário recebe feedback (correto/errado) e uma explicação.

- Pontuação: cada acerto vale 1 ponto; pontuação total exibida ao completar todas as questões.

- Ranking (leaderboard): ao finalizar o quiz o usuário pode gravar nome e setor e salvar a pontuação; os resultados são persistidos no `localStorage` e exibidos em um leaderboard (top 10).

- Reiniciar quiz: botão "Refazer Quiz" reseta o estado para jogar novamente.

## Onde editar perguntas e explicações


- `quiz.html` — cada pergunta está dentro de uma `<div class="quiz-question">` com as opções `.quiz-option`.

Para adicionar uma explicação visível quando a pergunta for verificada, inclua no elemento da pergunta o atributo `data-explanation`, por exemplo:

```html
<div class="quiz-question" data-explanation="Explicação breve sobre por que a alternativa X é correta.">
  <!-- conteúdo da pergunta -->
</div>
```

Se `data-explanation` não existir, o quiz mostrará uma mensagem orientando como adicionar a explicação.

## Arquivos principais

- `quiz.html` — marcação do quiz e controles.

- `styles.css` — estilos, incluindo classes para estados de opção (`.selected`, `.correct`, `.incorrect`, `.locked`), feedback e controle de layout.

- `script.js` — lógica do quiz: navegação por pergunta, seleção, verificação, feedback, pontuação, ranking e persistência (`localStorage`).

## Como executar localmente

1. Este é um site estático — basta abrir `quiz.html` no navegador (duplo clique no arquivo ou via menu do editor).

2. Recomendo usar uma extensão como "Live Server" no VS Code para servir o site (recomendado para desenvolvimento):

```powershell
# Com Live Server: abra a pasta no VS Code e clique em "Go Live" na barra de status.
```

## Teste rápido (fluxo esperado)

1. Abra `quiz.html`.

2. Responda a primeira pergunta clicando em uma opção.

3. Clique em "Verificar Respostas" — verá feedback e explicação; a alternativa correta será destacada.

4. Use "Próxima" para avançar; repita até o fim.

5. Ao responder todas as perguntas, será exibido o resultado total e a opção de salvar no ranking inserindo Nome e Setor.

## Como o ranking funciona (técnico)

- Os resultados são salvos no `localStorage` do navegador como um array de objetos: `{ name, sector, score, date }`.

- Ao salvar, o leaderboard é ordenado por pontuação decrescente e exibe os top 10.

- Os dados ficam no navegador do usuário; se quiser persistência centralizada, é preciso integrar uma API/servidor.

## Melhorias possíveis

- Integração com backend para persistência centralizada e autenticação.

- Temporizador por pergunta ou por quiz.

- Estatísticas por setor e exportação de resultados (CSV).

- Opção para revisar respostas erradas com comentários do instrutor.

## Contribuições

- Edite as perguntas em `quiz.html` ou abra uma issue/pull request com melhorias nas explicações, estilos ou comportamento.

## Suporte / Problemas

- Se alguma funcionalidade não aparecer (por exemplo, os botões de navegação), verifique o console do navegador (F12) para erros de JavaScript e confirme que `script.js` está sendo carregado corretamente.

## Licença

- Repositório sem licença especificada — adicione uma `LICENSE` se desejar torná-lo reutilizável por terceiros.

---

Feito com foco em usabilidade para treinamentos internos. Se quiser, posso:

- Preencher automaticamente explicações curtas para cada pergunta.

- Adicionar o formulário de nome/setor e a tela do leaderboard (GUI) se preferir que eu já crie.
