/**
 * Biblioteca global do EcoConecta (progressiva).
 * Páginas funcionam sem este arquivo; com ele, filtros e lightbox ganham teclado (Esc) e foco.
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

  global.EcoConecta = EcoConecta;

  global.document.addEventListener("DOMContentLoaded", function () {
    if (global.document.querySelector(".galeria__painel")) {
      EcoConecta.iniciarGaleria();
    }
  });
})(typeof window !== "undefined" ? window : this);
