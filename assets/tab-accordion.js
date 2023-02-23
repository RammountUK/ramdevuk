class TabAccordion extends HTMLElement {
  constructor() {
    super();
    this.toggles = [...this.querySelectorAll('[data-accordion]')];
    this.collapsibles = [...this.querySelectorAll('[data-accordion-content]')];
    this.icon = this.querySelector('[data-icon]');
  }

  connectedCallback() {
    this.toggles?.forEach((btn) => {
      const id = btn.dataset.accordion;
      const collapsible = this.collapsibles.find(({ dataset }) => dataset.accordionContent === id);
      const icon = btn.querySelector('[data-icon]');
      btn.addEventListener('click', () => {
        collapsible.style.transition = 'height .5s';
        collapsible.style.height = collapsible.offsetHeight === 0 ? `${collapsible.scrollHeight}px` : '0px';
        icon.querySelector('span').classList.toggle('rotate-180');
        this.collapsibles.filter(({ dataset }) => dataset.accordionContent !== id)
          .forEach((inactiveCollapsible) => {
            // eslint-disable-next-line no-param-reassign
            //inactiveCollapsible.style.height = '0px';
            //inactiveCollapsible.parentNode.querySelector('[data-icon] span').classList.add('-rotate-180');
          });
      });
    });
  }
}

customElements.define('tab-accordion', TabAccordion);
