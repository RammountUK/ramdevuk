class Modal extends HTMLElement {
  constructor() {
    super();
    this.openBtn = this.querySelector('[data-modal-open]');
    this.closeBtn = this.querySelector('[data-modal-close]');
    this.content = this.querySelector('[data-modal-content]');
    this.innerContent = this.querySelector('[data-inner-content]');
    this.delay = this.dataset.delay ? parseInt(this.dataset.delay, 10) : 200;
  }

  connectedCallback() {
    this.openBtn.addEventListener('click', () => {
      this.content.classList.replace('hidden', 'flex');
      setTimeout(() => {
        this.content.classList.remove('opacity-0');
      }, 10);

      window.addEventListener('click', (e) => {
        this.handleBodyClick(e);
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.close();
        }
      });
    });

    this.closeBtn.addEventListener('click', () => {
      this.close();
    });
  }

  close() {
    this.content.classList.add('opacity-0');
    setTimeout(() => {
      this.content.classList.replace('flex', 'hidden');
    }, this.delay);

    window.removeEventListener('click', (e) => {
      this.handleBodyClick(e);
    });
    window.removeEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  handleBodyClick(e) {
    const { target } = e;
    if (target !== this.innerContent && !target.closest('[data-inner-content]') && !target.closest('[data-modal-open]')) {
      this.close();
    }
  }
}

customElements.define('custom-modal', Modal);
