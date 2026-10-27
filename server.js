/**
 * Servidor Express do EcoConecta — compatível com GitHub + Railway.
 * Serve só páginas e pastas públicas (css/, img/, js/), sem expor
 * node_modules, .env, package.json nem arquivos de configuração.
 */
const path = require("path");
const express = require("express");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const raiz = __dirname;

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));

app.get("/health", (req, res) => {
  res.status(200).type("text").send("ok");
});

["css", "img", "js"].forEach((pasta) => {
  app.use(`/${pasta}`, express.static(path.join(raiz, pasta), {
    index: false,
    fallthrough: true,
  }));
});

const paginas = [
  "index.html",
  "sobre.html",
  "projetos.html",
  "impacto.html",
  "acessibilidade.html",
  "galeria.html",
  "midia.html",
  "noticias.html",
  "contato.html",
  "orcamento_hospedagem.html",
];

paginas.forEach((arquivo) => {
  const enviar = (req, res) => {
    res.sendFile(path.join(raiz, arquivo), (erro) => {
      if (erro) {
        res.status(404).type("html").send(paginaNaoEncontrada());
      }
    });
  };

  app.get(`/${arquivo}`, enviar);
  if (arquivo === "index.html") {
    app.get("/", enviar);
  }
});

/**
 * EcoBot — rota do plano (docs/readme.md).
 * Chave só em variável de ambiente no Railway (CHAVE_IA), nunca no Git.
 */
app.post("/api/assistente", (req, res) => {
  const pergunta = typeof req.body?.pergunta === "string" ? req.body.pergunta.trim() : "";

  if (!pergunta) {
    return res.status(400).json({
      erro: "Envie uma pergunta no campo pergunta.",
    });
  }

  if (!process.env.CHAVE_IA) {
    return res.status(503).json({
      resposta:
        "O EcoBot ainda está em configuração no servidor. Enquanto isso, veja Projetos, Impacto ou Contato.",
    });
  }

  return res.status(501).json({
    resposta: "Integração com a IA ainda não está ligada neste ambiente.",
  });
});

app.use((req, res) => {
  res.status(404).type("html").send(paginaNaoEncontrada());
});

app.listen(PORT, HOST, () => {
  console.log(`EcoConecta ouvindo em http://${HOST}:${PORT}`);
});

function paginaNaoEncontrada() {
  return (
    "<!DOCTYPE html><html lang=\"pt-BR\"><head><meta charset=\"UTF-8\">" +
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
    "<title>EcoConecta | Não encontrado</title></head><body>" +
    "<h1>Página não encontrada</h1><p><a href=\"/\">Voltar ao início</a></p>" +
    "</body></html>"
  );
}
