// ==========================================
// 1. NAVIGAZIONE RESPONSIVE E POPOVER
// ==========================================

// Per il desktop troviamo gli elementi e leggiamo la larghezza
const navigationButton = document.querySelector('.navigation-toggle');
const navigationLabel = document.querySelector('.navigation-label');
const navigationPanel = document.querySelector('.navigation-panel');
const desktopMedia = window.matchMedia('(min-width: 1000px)');
const supportsNavigation = 'popover' in HTMLElement.prototype &&
  CSS.supports('top', 'anchor(bottom)') &&
  CSS.supports('width', 'anchor-size(width)');

// Scegliamo la modalità di navigazione al caricamento (il popover funziona già in HTML)
function updateNavigationLabel() {
  const text = navigationPanel.matches(':popover-open') ? 'Chiudi menu' : 'Apri menu';
  navigationButton.setAttribute('aria-label', text);
  navigationLabel.textContent = text;
}

function updateNavigationLayout() {
  if (desktopMedia.matches) { // Siamo su desktop, disattiva il popover!
    navigationButton.removeAttribute('popovertarget');
    navigationPanel.removeAttribute('popover');
    navigationButton.hidden = true;
  } else { // Non siamo su desktop, riattiva il popover!
    navigationPanel.setAttribute('popover', 'auto');
    navigationButton.setAttribute('popovertarget', navigationPanel.id);
    navigationButton.hidden = false;
  }
  updateNavigationLabel();
}

if (supportsNavigation) {
  navigationPanel.addEventListener('toggle', updateNavigationLabel);
  updateNavigationLayout();
} else {
  // Qui si può eventualmente inserire un ripiego per i browser privi delle funzionalità richieste.
  navigationButton.removeAttribute('popovertarget');
  navigationPanel.removeAttribute('popover');
  navigationButton.hidden = true;
}

// Chiudiamo il popover se clicchiamo fuori (ad eccezione di alcuni casi) e lasciamo al link HTML la navigazione al capitolo
navigationPanel.addEventListener('click', function (event) {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const target = document.getElementById(link.hash.slice(1));
  if (!target) return;
  if (supportsNavigation && navigationPanel.matches(':popover-open')) navigationPanel.hidePopover();
  // Il link continua ad aggiornare il frammento e a scorrere con il comportamento HTML.
});

const skipLink = document.querySelector('.skip-link');
if (skipLink) {
  skipLink.addEventListener('click', function () {
    const topElement = document.querySelector('#top');
    if (topElement) topElement.focus();
  });
}

// Bonus accessibilità: se cambia il breakpoint, manteniamo il focus dove serve
desktopMedia.addEventListener('change', function () {
  if (!supportsNavigation) return;
  const focused = document.activeElement;
  const focusInNavigation = navigationPanel.contains(focused);
  const focusOnButton = focused === navigationButton;
  updateNavigationLayout();
  if (desktopMedia.matches && focusInNavigation) focused.focus();
  else if (desktopMedia.matches && focusOnButton) navigationPanel.querySelector('a')?.focus();
  else if (!desktopMedia.matches && focusInNavigation) navigationButton.focus();
});


// ==========================================
// 2. SEZIONE CASE STUDY (BREAKOUT TABS / ACCORDION)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.breakdownTabs-trigger');
  const items = document.querySelectorAll('.breakdownTabs-item');
  const mainImage = document.getElementById('breakdown-image');

  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const parentItem = tab.closest('.breakdownTabs-item');
      const targetPanelId = tab.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetPanelId);
      const newImageSrc = tab.getAttribute('data-image');

      // 1. Aggiorna l'immagine della preview
      if (mainImage && newImageSrc) {
        mainImage.setAttribute('src', newImageSrc);
      }

      // 2. Resetta lo stato di tutti gli item/schede
      items.forEach((item) => item.classList.remove('is-active'));
      tabs.forEach((t) => {
        t.setAttribute('aria-expanded', 'false');
        const pId = t.getAttribute('aria-controls');
        const pEl = document.getElementById(pId);
        if (pEl) pEl.setAttribute('hidden', '');
      });

      // 3. Attiva la scheda/accordion cliccata
      if (parentItem) parentItem.classList.add('is-active');
      tab.setAttribute('aria-expanded', 'true');
      if (targetPanel) {
        targetPanel.removeAttribute('hidden');
      }
    });
  });
});