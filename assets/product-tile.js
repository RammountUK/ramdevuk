class ProductTile extends HTMLElement {
  constructor() {
    super();
    this.section = document.createElement('div');
    this.siblingSwatches = [...this.querySelectorAll('[data-product-url]')];
    this.quickViewBtn = this.querySelector('.quickview-btn')
  }

  connectedCallback() {
    this.siblingSwatches.forEach((swatch) => {
      swatch.addEventListener('click', () => {
        this.fetchTile(swatch.dataset.productUrl);
      });
    });
    if(this.quickViewBtn){
      this.quickViewBtn.addEventListener('click', (el) => {
        el.preventDefault();
        console.log('click')
       this.fetchQuickView(this.quickViewBtn.dataset.href)
      });
    }
   
  }

  reInit() {
    this.section = document.createElement('div');
    this.siblingSwatches = [...this.querySelectorAll('[data-product-url]')];
    this.siblingSwatches.forEach((swatch) => {
      swatch.addEventListener('click', () => {
        this.fetchTile(swatch.dataset.productUrl);
      });
    });
  }

  fetchQuickView(productUrl){
    fetch(`${window.location.origin}${productUrl}`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.text())
      .then((text) => {
        const quickviewHTML = new DOMParser().parseFromString(text, 'text/html').querySelector('.boost-pfs-quickview-wrapper').innerHTML;
        this.querySelector('[data-quickview]').innerHTML += `<div class="boost-pfs-modal-backdrop"><div class="boost-pfs-modal-container">
        <div class="boost-pfs-modal-content"><div class="boost-pfs-quickview-wrapper">${quickviewHTML}</div></div></div></div>`
        this.querySelector('.boost-pfs-quickview-close').addEventListener('click', (el) => {
          this.querySelector('.boost-pfs-modal-backdrop').remove()
         });
         this.initImageSlider();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  initImageSlider(){
    let modal = this.querySelector('.boost-pfs-modal-backdrop')
    var t = modal.querySelector(".boost-pfs-quickview-featured-image-wrapper"),
        e = modal.querySelectorAll(".boost-pfs-quickview-featured-image"),
        n = modal.querySelector(".boost-pfs-quickview-slider-prev"),
        i = modal.querySelector(".boost-pfs-quickview-slider-next"),
        o = modal.querySelectorAll(".boost-pfs-quickview-slider-dot");
   
    let imageSlider = {
            $itemsWrapper: t,
            $prev: n,
            $next: i,
            $dots: o,
            posX1: 0,
            posX2: 0,
            posInitial: 0,
            posFinal: 0,
            threshold: 50,
            slidesLength: e.length,
            slideSize: e[0].offsetWidth,
            index: 0,
            allowShift: !0,
            isDragging: !1,
            slides: e
        }
        //imageSlider.$itemsWrapper.style.left("0px");
        imageSlider.$dots[0].classList.add("active");
        imageSlider.$prev.addEventListener("click", () =>{
          imageSlider.index = ((imageSlider.index - 1) > -1) ? imageSlider.index - 1 : imageSlider.slidesLength - 1;
          imageSlider.$dots.forEach((item) => {
            item.classList.remove("active");
          })
          imageSlider.slides.forEach((slide) => {
            slide.classList.add("hidden");
          })
          imageSlider.slides[imageSlider.index].classList.remove("hidden")
          imageSlider.$dots[imageSlider.index].classList.add("active")
        });
       
        imageSlider.$next.addEventListener("click", () =>{
          imageSlider.index = ((imageSlider.index + 1) < imageSlider.slidesLength) ? imageSlider.index + 1 : 0;
          imageSlider.$dots.forEach((item) => {
            item.classList.remove("active");
          })
          imageSlider.slides.forEach((slide) => {
            slide.classList.add("hidden");
          })
          imageSlider.slides[imageSlider.index].classList.remove("hidden")
          imageSlider.$dots[imageSlider.index].classList.add("active")
          
        })
       
  }
  fetchTile(productUrl) {
    fetch(`${window.location.pathname}${productUrl}?sections=product_tile`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.text())
      .then((parsedState) => {
        const json = JSON.parse(parsedState);
        this.section.innerHTML = json.product_tile;
      })
      .finally(() => {
        if (this.section.querySelector('product-tile')) {
          this.innerHTML = this.section.querySelector('product-tile').innerHTML;
          this.reInit();
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}
customElements.define('product-tile', ProductTile);
