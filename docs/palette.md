# Paleta baseada no Coren-BA

Cores extraídas e sugestões de uso, com contrast ratios vs branco e preto (WCAG).

| Nome | Hex | Uso sugerido | Contraste vs `#ffffff` | Contraste vs `#000000` |
|---|---:|---|---:|---:|
| `color-primary` | `#0078bf` | Uso: accents, links, botões primários | 4.73:1 | 4.44:1 |
| `color-primary-dark` | `#00588c` | Uso: hover, focus, states | 7.57:1 | 2.77:1 |
| `color-primary-light` | `#0693e3` | Uso: highlights, badges | 3.34:1 | 6.29:1 |
| `color-success` | `#5cb85c` | Uso: sucesso, indicadores positivos | 2.48:1 | 8.47:1 |
| `color-warning` | `#f0ad4e` | Uso: avisos, badges | 1.95:1 | 10.79:1 |
| `color-danger` | `#d9534f` | Uso: erros/alertas | 3.96:1 | 5.30:1 |
| `color-info` | `#f4972a` | Uso: CTAs secundários, info | 2.26:1 | 9.31:1 |
| `color-dark` | `#3a3939` | Uso: texto principal | 11.51:1 | 1.82:1 |
| `color-muted` | `#626262` | Uso: texto secundário | 6.10:1 | 3.44:1 |
| `color-bg` | `#ffffff` | Fundo claro padrão | 1.00:1 | 21.00:1 |


**Notas**:

- Para texto pequeno (<= 18px regular), o mínimo recomendado é 4.5:1 (WCAG AA).
- Para texto grande (>= 18pt / 24px) ou bold, o mínimo recomendado é 3:1.
- Cores que não atingem contraste suficiente contra branco devem ser usadas sobre fundos escuros ou com elementos adicionais (borda, sombra, fundo sólido).

Se quiser, aplico variações (e.g., `--color-primary-700`) ou ajusto tons até atingir contraste desejado.
