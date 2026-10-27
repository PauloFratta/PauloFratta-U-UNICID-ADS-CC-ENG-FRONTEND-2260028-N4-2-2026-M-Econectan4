/**
 * Biblioteca global do EcoConecta (progressiva).
 * Sem este arquivo, as páginas continuam legíveis.
 * Com ele: galeria (Esc e filtros), contraste, texto maior e leitura em voz alta.
 */
(function (global) {
  "use strict";

  var EcoConecta = global.EcoConecta || {};

  EcoConecta.prefereMenosMovimento = function () {
    return Boolean(
      global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  };

  /**
   * Fecha lightboxes abertos via hash (#ampliar-*) ao pressionar Escape.
   * @param {string} [ancoraFechar="#galeria-conteudo"]
   */
  EcoConecta.ativarFecharLightboxComEsc = function (ancoraFechar) {
    var destino = ancoraFechar || "#galeria-conteudo";

    global.addEventListener("keydown", function (evento) {
      if (evento.key !== "Escape") {
        return;
      }
      if (!/^#ampliar-/.test(global.location.hash || "")) {
        return;
      }
      evento.preventDefault();
      global.location.hash = destino;
    });
  };

  /**
   * Ao abrir um lightbox (:target), move o foco para o botão Fechar.
   */
  EcoConecta.ativarFocoNoLightbox = function () {
    function focarFechar() {
      var hash = global.location.hash || "";
      if (!/^#ampliar-/.test(hash)) {
        return;
      }
      var painel = global.document.getElementById(hash.slice(1));
      if (!painel) {
        return;
      }
      var fechar = painel.querySelector(".galeria__lightbox-fechar");
      if (fechar && typeof fechar.focus === "function") {
        fechar.focus();
      }
    }

    global.addEventListener("hashchange", focarFechar);
    focarFechar();
  };

  /**
   * Melhora o anúncio do filtro ativo para leitores de tela.
   * @param {string} [seletorPainel=".galeria__painel"]
   */
  EcoConecta.ativarAnuncioFiltroGaleria = function (seletorPainel) {
    var painel = global.document.querySelector(seletorPainel || ".galeria__painel");
    if (!painel) {
      return;
    }

    var vivo = global.document.createElement("p");
    vivo.className = "sr-only";
    vivo.setAttribute("aria-live", "polite");
    vivo.setAttribute("aria-atomic", "true");
    painel.insertBefore(vivo, painel.firstChild);

    function atualizar() {
      var marcado = painel.querySelector(".galeria__estado:checked");
      var itens = painel.querySelectorAll(".galeria__item");
      var visiveis = 0;
      var i;

      for (i = 0; i < itens.length; i += 1) {
        if (global.getComputedStyle(itens[i]).display !== "none") {
          visiveis += 1;
        }
      }

      var tema = marcado && marcado.parentElement
        ? marcado.parentElement.textContent.replace(/\s+/g, " ").trim()
        : "Todos";

      vivo.textContent = "Filtro " + tema + ": " + visiveis + " imagem(ns) visível(is).";
    }

    painel.addEventListener("change", atualizar);
    atualizar();
  };

  EcoConecta.iniciarGaleria = function () {
    EcoConecta.ativarFecharLightboxComEsc("#galeria-conteudo");
    EcoConecta.ativarFocoNoLightbox();
    EcoConecta.ativarAnuncioFiltroGaleria(".galeria__painel");
  };

  EcoConecta.lerPreferencia = function (chave) {
    try {
      return global.localStorage && global.localStorage.getItem(chave) === "1";
    } catch (erro) {
      return false;
    }
  };

  EcoConecta.gravarPreferencia = function (chave, ligado) {
    try {
      if (global.localStorage) {
        global.localStorage.setItem(chave, ligado ? "1" : "0");
      }
    } catch (erro) {
      /* navegador pode bloquear armazenamento; o ajuste vale só nesta visita */
    }
  };

  var leituraInterrompida = false;
  var leituraAtiva = false;
  var leituraGeracao = 0;

  EcoConecta.botoesRecurso = function (recurso) {
    return global.document.querySelectorAll('[data-recurso="' + recurso + '"]');
  };

  EcoConecta.anunciarAcesso = function (mensagem) {
    var avisos = global.document.querySelectorAll("[data-acesso-aviso]");
    var i;

    for (i = 0; i < avisos.length; i += 1) {
      avisos[i].textContent = mensagem;
    }
  };

  EcoConecta.definirPressionado = function (recurso, ligado) {
    var lista = EcoConecta.botoesRecurso(recurso);
    var i;
    var botao;
    var nome;
    var nomeLigado;
    var nomeDesligado;
    var rotuloLigado;
    var rotuloDesligado;

    for (i = 0; i < lista.length; i += 1) {
      botao = lista[i];
      botao.setAttribute("aria-pressed", ligado ? "true" : "false");
      nome = botao.querySelector(".acesso__nome");
      nomeLigado = botao.getAttribute("data-nome-ligado");
      nomeDesligado = botao.getAttribute("data-nome-desligado");
      if (nome && nomeLigado && nomeDesligado) {
        nome.textContent = ligado ? nomeLigado : nomeDesligado;
      }
      rotuloLigado = botao.getAttribute("data-rotulo-ligado");
      rotuloDesligado = botao.getAttribute("data-rotulo-desligado");
      if (rotuloLigado && rotuloDesligado) {
        botao.setAttribute("aria-label", ligado ? rotuloLigado : rotuloDesligado);
      }
    }
  };

  EcoConecta.aplicarPreferenciasAcesso = function () {
    var raiz = global.document.documentElement;
    var contraste = EcoConecta.lerPreferencia("ecoconecta-contraste");
    var texto = EcoConecta.lerPreferencia("ecoconecta-texto");

    raiz.classList.toggle("contraste-alto", contraste);
    raiz.classList.toggle("texto-maior", texto);
    EcoConecta.definirPressionado("contraste", contraste);
    EcoConecta.definirPressionado("texto", texto);
  };

  EcoConecta.alternarClasseAcesso = function (recurso, classe, chave, ligadoTexto, desligadoTexto) {
    var raiz = global.document.documentElement;
    var ligado = !raiz.classList.contains(classe);

    raiz.classList.toggle(classe, ligado);
    EcoConecta.gravarPreferencia(chave, ligado);
    EcoConecta.definirPressionado(recurso, ligado);
    EcoConecta.anunciarAcesso(ligado ? ligadoTexto : desligadoTexto);
  };

  EcoConecta.pararLeitura = function (mensagem) {
    leituraGeracao += 1;
    leituraAtiva = false;
    leituraInterrompida = true;
    if (global.speechSynthesis) {
      global.speechSynthesis.cancel();
    }
    EcoConecta.definirPressionado("ouvir", false);
    if (mensagem) {
      EcoConecta.anunciarAcesso(mensagem);
    }
  };

  EcoConecta.escolherVozPortugues = function (sintetizador) {
    var vozes = sintetizador.getVoices ? sintetizador.getVoices() : [];
    var i;
    var idioma;

    for (i = 0; i < vozes.length; i += 1) {
      idioma = (vozes[i].lang || "").toLowerCase();
      if (idioma.indexOf("pt-br") === 0) {
        return vozes[i];
      }
    }

    for (i = 0; i < vozes.length; i += 1) {
      idioma = (vozes[i].lang || "").toLowerCase();
      if (idioma.indexOf("pt") === 0) {
        return vozes[i];
      }
    }

    return null;
  };

  EcoConecta.alternarLeitura = function () {
    var sintetizador = global.speechSynthesis;
    var principal;
    var texto;
    var fala;
    var voz;
    var geracao;

    if (!sintetizador || typeof global.SpeechSynthesisUtterance !== "function") {
      EcoConecta.anunciarAcesso("A leitura em voz alta não está disponível neste navegador.");
      return;
    }

    if (leituraAtiva || sintetizador.speaking || sintetizador.pending) {
      EcoConecta.pararLeitura("Leitura em voz alta interrompida.");
      return;
    }

    principal = global.document.getElementById("conteudo");
    texto = principal ? principal.innerText.replace(/\s+/g, " ").trim() : "";
    if (!texto) {
      EcoConecta.anunciarAcesso("Não há texto para ler nesta página.");
      return;
    }

    fala = new global.SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    fala.rate = 1;
    voz = EcoConecta.escolherVozPortugues(sintetizador);
    if (voz) {
      fala.voice = voz;
    }

    fala.onend = function () {
      if (leituraInterrompida || geracao !== leituraGeracao) {
        leituraInterrompida = false;
        return;
      }
      leituraAtiva = false;
      EcoConecta.definirPressionado("ouvir", false);
      EcoConecta.anunciarAcesso("Leitura em voz alta concluída.");
    };

    fala.onerror = function (evento) {
      if (leituraInterrompida || geracao !== leituraGeracao || (evento && evento.error === "interrupted")) {
        leituraInterrompida = false;
        return;
      }
      leituraAtiva = false;
      EcoConecta.definirPressionado("ouvir", false);
      EcoConecta.anunciarAcesso("Não foi possível ler a página em voz alta.");
    };

    leituraGeracao += 1;
    geracao = leituraGeracao;
    leituraAtiva = true;
    leituraInterrompida = false;
    EcoConecta.definirPressionado("ouvir", true);
    EcoConecta.anunciarAcesso("Lendo o conteúdo principal.");
    sintetizador.cancel();
    global.setTimeout(function () {
      if (geracao !== leituraGeracao) {
        return;
      }
      sintetizador.speak(fala);
    }, 60);
  };

  EcoConecta.ativarRecursosAcesso = function () {
    var contraste = EcoConecta.botoesRecurso("contraste");
    var texto = EcoConecta.botoesRecurso("texto");
    var ouvir = EcoConecta.botoesRecurso("ouvir");
    var i;

    function aoClicar(lista, acao) {
      for (i = 0; i < lista.length; i += 1) {
        lista[i].addEventListener("click", acao);
      }
    }

    EcoConecta.aplicarPreferenciasAcesso();
    aoClicar(contraste, function () {
      EcoConecta.alternarClasseAcesso(
        "contraste",
        "contraste-alto",
        "ecoconecta-contraste",
        "Alto contraste ligado.",
        "Alto contraste desligado."
      );
    });
    aoClicar(texto, function () {
      EcoConecta.alternarClasseAcesso(
        "texto",
        "texto-maior",
        "ecoconecta-texto",
        "Texto maior ligado.",
        "Texto maior desligado."
      );
    });
    aoClicar(ouvir, function () {
      EcoConecta.alternarLeitura();
    });

    global.addEventListener("keydown", function (evento) {
      if (evento.key !== "Escape") {
        return;
      }
      if (!global.speechSynthesis) {
        return;
      }
      if (!leituraAtiva && !global.speechSynthesis.speaking && !global.speechSynthesis.pending) {
        return;
      }
      EcoConecta.pararLeitura("Leitura em voz alta interrompida.");
    });

    global.addEventListener("pagehide", function () {
      if (global.speechSynthesis) {
        leituraInterrompida = true;
        global.speechSynthesis.cancel();
      }
    });
  };

  global.EcoConecta = EcoConecta;

  global.document.addEventListener("DOMContentLoaded", function () {
    EcoConecta.ativarRecursosAcesso();
    if (global.document.querySelector(".galeria__painel")) {
      EcoConecta.iniciarGaleria();
    }
  });
})(typeof window !== "undefined" ? window : this);
