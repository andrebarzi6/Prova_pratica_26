// ==========================================
// 1. NAVIGAZIONE RESPONSIVE E POPOVER
// ==========================================

const navigationButton = document.querySelector('.navigation-toggle');
const navigationLabel = document.querySelector('.navigation-label');
const navigationPanel = document.querySelector('.navigation-panel');
const desktopMedia = window.matchMedia('(min-width: 63.25rem)');
const supportsNavigation = 'popover' in HTMLElement.prototype &&
  CSS.supports('top', 'anchor(bottom)') &&
  CSS.supports('width', 'anchor-size(width)');

function updateNavigationLabel() {
  const text = navigationPanel.matches(':popover-open') ? 'Chiudi menu' : 'Apri menu';
  navigationButton.setAttribute('aria-label', text);
  navigationLabel.textContent = text;
}

function updateNavigationLayout() {
  if (desktopMedia.matches) {
    navigationButton.removeAttribute('popovertarget');
    navigationPanel.removeAttribute('popover');
    navigationButton.hidden = true;
  } else {
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
  navigationButton.removeAttribute('popovertarget');
  navigationPanel.removeAttribute('popover');
  navigationButton.hidden = true;
}

navigationPanel.addEventListener('click', function (event) {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const target = document.getElementById(link.hash.slice(1));
  if (!target) return;
  if (supportsNavigation && navigationPanel.matches(':popover-open')) navigationPanel.hidePopover();
});

const skipLink = document.querySelector('.skip-link');
if (skipLink) {
  skipLink.addEventListener('click', function () {
    const topElement = document.querySelector('#top');
    if (topElement) topElement.focus();
  });
}

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
// 2. BREAKOUT TABS / ACCORDION MODULE
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

      if (mainImage && newImageSrc) {
        mainImage.setAttribute('src', newImageSrc);
      }

      items.forEach((item) => item.classList.remove('is-active'));
      tabs.forEach((t) => {
        t.setAttribute('aria-expanded', 'false');
        const pId = t.getAttribute('aria-controls');
        const pEl = document.getElementById(pId);
        if (pEl) pEl.setAttribute('hidden', '');
      });

      if (parentItem) parentItem.classList.add('is-active');
      tab.setAttribute('aria-expanded', 'true');
      if (targetPanel) {
        targetPanel.removeAttribute('hidden');
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.case-study .tab');
  const images = document.querySelectorAll('.case-study .tabs-image');

  tabs.forEach((tab, index) => {
    const button = tab.querySelector('.tab-button');
    if (!button) return;

    button.addEventListener('click', () => {
      // Disattiva tutte le tab e nascondi le immagini
      tabs.forEach((t) => t.classList.remove('is-selected'));
      images.forEach((img) => img.classList.remove('is-visible'));

      // Attiva la tab e l'immagine corrispondente
      tab.classList.add('is-selected');
      if (images[index]) {
        images[index].classList.add('is-visible');
      }
    });
  });
});