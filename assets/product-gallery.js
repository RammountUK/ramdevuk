/* eslint-disable no-undef */
class ProductGallery extends HTMLElement {
  connectedCallback() {
    this.thumbnails = this.querySelector('[data-thumbnails]');
    this.container = document.querySelector('[data-variant-gallery-container]');
    window.addEventListener('load', () => {
      this.init();
      this.container.addEventListener('theme:gallery:reinit', (event) => {
            this.init();
      });
    });

    this.slides = [...this.querySelectorAll('.gallery-slide')];
    this.slides.forEach(el => el.addEventListener('click', (e) => {
        if(this.classList.contains('modal')){
          this.classList.toggle('zoom-in');
          if(this.classList.contains('zoom-in')){
            this.main.zoom.in(); 
          }else{
            this.main.zoom.out(); 
          }
          
        }else{
          this.classList.add('modal');
        }

    }));
    this.overlay = [...this.querySelectorAll('.product-gallery-overlay')];
    this.overlay.forEach(el => el.addEventListener('click', (e) => {
        this.classList.toggle('modal');
    }));

    this.thumbnails.querySelectorAll('.swiper-slide').forEach(el => el.addEventListener('click', (e) => {
      console.log(el.dataset.index)
      this.main.slideTo(Number(el.dataset.index) - 1);
    }));
  }

  init(){
      // this.thumbSlider = new Swiper('[data-thumbnails]', {
      //   slidesPerView: 5,
      //   spaceBetween: 0,
      //   grid: {
      //     rows: 2,
      //   },
      // });
      this.main = new Swiper('[data-main-gallery]',{
        spaceBetween: 10,
        navigation: false,
        zoom: true,
        allowTouchMove: true,
        navigation: {
            nextEl: '[data-swiper-button-next]',
            prevEl: '[data-swiper-button-prev]',
        }
       

      });
      if(this.thumbSlider.slides.length > 1){
          document.querySelector('[data-thumbnails]').classList.remove('opacity-0');
      }
  }
}
customElements.define('product-gallery', ProductGallery);
