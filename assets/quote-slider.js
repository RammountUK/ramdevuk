class Slider extends HTMLElement {
  connectedCallback() {
    window.addEventListener('load', () => {
      // eslint-disable-next-line no-undef
      this.swiper = new Swiper(this.querySelector('[data-swiper]'), {
        // Optional parameters
        effect: 'fade',
        fadeEffect: {
          crossFade: true,
        },
        autoplay: {
          delay: Number(this.dataset.speed),
          disableOnInteraction: false,
        },
        direction: 'horizontal',
        loop: true,
        slidesPerView: 'auto',
        speed: Number(this.dataset.speed),
      });
    });
  }
}
customElements.define('quotes-slider', Slider);
