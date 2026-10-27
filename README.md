Link do Ecoconectan4 na hospedagem Railway:
https://ecoconectan4.up.railway.app/

## Publicar (GitHub → Railway)

1. Faça push deste repositório no GitHub (inclua `package.json`, `package-lock.json`, `server.js` e `railway.toml`).
2. No Railway, conecte o repositório; o start command é `npm start` (já definido em `railway.toml`).
3. Variáveis no painel do Railway (nunca no Git): `PORT` é definido pela plataforma; opcional `CHAVE_IA` só no servidor.
4. Healthcheck: `GET /health` deve responder `ok`.
5. Localmente: `npm install` e `npm start` → http://127.0.0.1:3000

O site usa só arquivos do repositório (`*.html`, `css/`, `img/`, `js/`). Sem CDN de framework e sem chave de API no front-end.

# U-UNICID-ADS-CC-ENG-FRONTEND-2260028-N4-2-2026-M-Econectan4

# Plano de contexto e escopo — EcoConecta

Briefing permanente do projeto para a equipe e para a IA.
Disciplina Desenvolvimento Front-end para Web · UNICID · 2026.2 · Prof. Paulo Fratta.
Organização e dados são fictícios, criados para fins acadêmicos.

## 1. Nome do projeto

EcoConecta

## 2. Visão geral

Site de uma ONG fictícia que conecta moradores, empresas e cooperativas de catadores à coleta seletiva. O resíduo reciclável deve virar renda digna, e não lixo no aterro. O tema dialoga com os ODS 11 e 12 e com a economia solidária.

A página inicial (`index.html`) e a folha `css/style.css` já existem. As demais páginas, o formulário validado e o assistente EcoBot entram nas entregas seguintes. Entrega final prevista: site completo e publicado.

## 3. Problema que o produto resolve

Materiais recicláveis seguem para aterros e rios, enquanto catadoras e catadores fazem um trabalho essencial sem reconhecimento, segurança ou renda justa. Falta um canal claro para moradores, escolas e empresas entregarem recicláveis às cooperativas e apoiarem esse trabalho.

## 4. Público-alvo

- Moradores de São Paulo que separam recicláveis em casa.
- Escolas e professores que pedem oficinas de consumo consciente.
- Empresas que podem doar equipamentos ou indicar parcerias.
- Pessoas com deficiência: o site precisa ser usável por teclado e leitores de tela.

## 5. Objetivos

- Informar, com linguagem simples, como separar e destinar recicláveis.
- Engajar voluntários, escolas e empresas.
- Ampliar a coleta seletiva feita por cooperativas de catadores.
- Mostrar impacto (mesmo com números fictícios) de forma honesta e acessível.

## 6. Funcionalidades principais

Dez páginas, com o mesmo cabeçalho, menu e rodapé do `index.html`:

| Página | Arquivo | Função |
| --- | --- | --- |
| Início | `index.html` | Causa, números, projetos, como participar e notícias |
| Sobre | `sobre.html` | História, missão e valores (inclusão, meio ambiente, educação) |
| Projetos | `projetos.html` | Ponto Verde no Bairro, Catador Cidadão e Recicla na Escola |
| Impacto | `impacto.html` | Tabelas e resultados da coleta |
| Acessibilidade | `acessibilidade.html` | Medidas de acesso do site e da reciclagem |
| Galeria | `galeria.html` | Imagens com `figure`, `figcaption` e texto alternativo |
| Mídia | `midia.html` | Vídeo ou áudio com transcrição ou legenda |
| Notícias | `noticias.html` | Notícias com data em `<time>` |
| Contato | `contato.html` | Formulário validado para voluntariado e parcerias |
| Orçamento | `orcamento_hospedagem.html` | Orçamento de hospedagem do site |

Projetos citados na home:

- **Ponto Verde no Bairro:** pontos de entrega em escolas e comércios, com coleta pelas cooperativas.
- **Catador Cidadão:** capacitação, equipamentos de proteção e apoio à formalização.
- **Recicla na Escola:** oficinas para crianças e jovens.

Também faz parte da entrega final o **EcoBot**: widget de perguntas frequentes ligado a uma rota de API no servidor, sem expor chave de IA no navegador.

Números de impacto já publicados na home (fictícios): 48 t de recicláveis por mês, 120 catadores com renda ampliada, 6 cooperativas parceiras e 35 escolas com oficinas.

## 7. Requisitos técnicos

- HTML5 e CSS3 puros, sem framework de CSS ou de interface.
- JavaScript apenas onde a página precisar (validação do formulário e widget do EcoBot).
- Um único arquivo de estilo: `css/style.css`, abordagem mobile-first.
- Servidor previsto para a publicação: Node.js com Express, pasta pública servida pelo `server.js`, deploy no Railway a partir do GitHub.
- Versionamento no Git, com uma branch por tarefa.

Estado atual do repositório: páginas na raiz, estilos em `css/` e imagens em `img/`. Quando o servidor entrar, as páginas podem ir para `public/`, mantendo os mesmos nomes de arquivo e as mesmas classes.

## 8. Requisitos não funcionais

- WCAG 2.2 nível AA: contraste, foco visível, rótulos e textos alternativos.
- Navegação por teclado, com link “Pular para o conteúdo principal”.
- Mobile-first, com ajustes a partir de 768px e 1024px.
- `prefers-reduced-motion: reduce` respeitado.
- Imagens leves (SVG ou arquivos otimizados) e `width`/`height` definidos.
- LGPD: nenhum dado pessoal real; e-mails, telefones e endereços de exemplo.
- Chaves de API só em variável de ambiente, nunca no Git.

## 9. Estrutura de pastas

```
EcoConecta/
├── index.html              # páginas HTML na raiz (hoje)
├── css/style.css
├── img/
├── docs/readme.md          # este plano de contexto
└── .cursor/rules/*.mdc     # regras que a IA segue ao editar o código
```

Estrutura prevista na publicação:

```
EcoConecta/
├── .cursor/rules/*.mdc
├── docs/readme.md
├── public/                 # as 10 páginas, css/, js/ e img/
├── lib/ia.js               # chamada à API de IA, só no servidor
├── server.js               # Express: estáticos + POST /api/assistente
├── package.json
├── .gitignore
└── .env                    # fora do Git
```

Responsabilidades:

- **Interface:** HTML semântico e CSS em `style.css`. Sem estilo inline.
- **Comportamento:** JavaScript em arquivo próprio, progressivo (a página funciona sem ele, exceto o envio que depende de validação).
- **Integração:** EcoBot só fala com `/api/assistente`. A chave fica no servidor.

## 10. Desejáveis

- Mapa dos Pontos Verdes.
- Modo de alto contraste.
- Exportação simples dos números de impacto.

## 11. Critérios de sucesso

- As 10 páginas publicadas, com menu, cabeçalho e rodapé iguais aos da home.
- Zero erros no validador de HTML do W3C.
- Acessibilidade no Lighthouse igual ou acima de 90.
- Formulário de contato valida os campos obrigatórios e mostra o erro junto ao campo.
- Site no ar (Railway) e histórico no GitHub com commits pequenos e mensagens claras.
- Nenhuma chave ou dado pessoal real no repositório.
