class Accordion extends HTMLElement {
  constructor() {
    super();
    this.toggles = [...this.querySelectorAll('[data-toggle]')];
    this.collapsibles = [...this.querySelectorAll('[data-content]')];
    this.icon = this.querySelector('[data-icon]');
  }

  connectedCallback() {
    this.toggles?.forEach((btn) => {
      const id = btn.dataset.toggle;
      const collapsible = this.collapsibles.find(({ dataset }) => dataset.content === id);
      const icon = btn.querySelector('[data-icon]');

      btn.addEventListener('click', () => {
        collapsible.style.transition = 'height .5s';
        collapsible.style.height = collapsible.offsetHeight === 0 ? `${collapsible.scrollHeight}px` : '0px';
        icon.querySelector('span').classList.toggle('rotate-90');
        this.collapsibles.filter(({ dataset }) => dataset.content !== id)
          .forEach((inactiveCollapsible) => {
            // eslint-disable-next-line no-param-reassign
            inactiveCollapsible.style.height = '0px';
            inactiveCollapsible.parentNode.querySelector('[data-icon] span').classList.add('rotate-90');
          });
      });
    });
  }
}

customElements.define('content-accordion', Accordion);
