class Expandable extends HTMLElement {
  connectedCallback() {
    this.toggle = this.querySelector('[data-toggle]');
    this.hiddenStuff = [...this.querySelectorAll('[data-hidden]')];

    this.toggle.addEventListener('click', () => {
      this.toggle.classList.add('hidden');
      this.hiddenStuff.forEach((el) => {
        el.classList.remove('hidden');
      });
    });
  }
}
customElements.define('expand-content', Expandable);
