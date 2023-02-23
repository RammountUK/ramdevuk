class ModalForm extends HTMLElement {
  constructor() {
    super();
    this.id = this.dataset.addressId;
  }

  connectedCallback() {
    [...this.querySelectorAll('[data-modal-close]')].forEach((btn) => {
      btn.addEventListener('click', () => {
        this.close();
      });
    });

    window.addEventListener('load', () => {
      [...document.querySelectorAll(`[data-edit-form="${this.id}"]`)].forEach((btn) => {
        btn.addEventListener('click', () => {
          this.open();
        });
      });
    });
  }

  open() {
    this.classList.remove('hidden');
  }

  close() {
    this.classList.add('hidden');
  }
}

customElements.define('modal-form', ModalForm);
