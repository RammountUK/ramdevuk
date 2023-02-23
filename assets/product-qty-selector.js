class QtySelector extends HTMLElement {
  constructor() {
    super();

    this.decrement = this.querySelector('[data-decrement]');
    this.increment = this.querySelector('[data-increment]');
    this.quantity = this.querySelector('[data-qty]');
  }

  connectedCallback() {
    if (this.decrement && this.increment) {
      this.addListeners();
    }
  }

  addListeners() {
    this.decrement.addEventListener('click', () => this.changeQty(-1));
    this.increment.addEventListener('click', () => this.changeQty(1));
  }

  changeQty(value) {
    const newQty = Number(this.quantity.value) + Number(value);
    this.quantity.value = newQty > 0 ? newQty : 0;

  }
}

customElements.define('qty-selector', QtySelector);
