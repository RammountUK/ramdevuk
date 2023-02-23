class QuickShop extends HTMLElement {
  constructor() {
    super();
    this.sizes = [...this.querySelectorAll('[data-options]')];
    this.menu = this.querySelector('[data-menu]');
  }

  connectedCallback() {
    this.addEventListener('click', () => {
      this.open();
    });

    this.addEventListener('mouseleave', () => {
      this.close();
      this.sizes.forEach((size) => {
        size.classList.remove('border');
      });
    });

    this.sizes.forEach((size) => {
      size.addEventListener('click', () => {
        this.sizes.forEach((x) => {
          x.classList.remove('border');
        });
        size.classList.add('border');
      });
    });
  }

  open() {
    if(this.menu){
    this.menu.style.height = `${this.menu.scrollHeight}px`;
    this.menu.style.transition = 'height .5s';
    }
  }

  close() {
    if(this.menu){
      this.menu.style.height = '0px';
    }
  }
}

customElements.define('quick-buy', QuickShop);
