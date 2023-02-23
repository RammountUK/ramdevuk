class ScrollAnimation extends HTMLElement {
  constructor() {
    super();
    this.observer = null;
    // arrayify the nodelist so we can use array methods safely
    this.childElements = [...this.children];
    // remove whitespace, newlines, etc from the inputted classes
    this.startClasses = this.dataset.startClasses?.replace(/\s+/g, '').split(',') ?? [];
    this.endClasses = this.dataset.endClasses?.replace(/\s+/g, '').split(',') ?? [];

    this.intersectionRatio = this.dataset.intersectionRatio
      ? parseFloat(this.dataset.intersectionRatio) : 1;
  }

  connectedCallback() {
    this.createObserver();
    // in case we forgot to apply default classes, do it now
    this.childElements.forEach((el) => { el.classList.add(...this.startClasses); });
  }

  createObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    this.observer = new IntersectionObserver((entries) => {
      // when element is fully visible
      if (entries[0].intersectionRatio >= this.intersectionRatio) {
        this.animate();
      }
    }, options);

    this.observer.observe(this);
  }

  animate() {
    this.childElements.forEach((el) => {
      el.classList.remove(...this.startClasses);
      el.classList.add(...this.endClasses);
    });
  }
}

customElements.define('scroll-animation', ScrollAnimation);
