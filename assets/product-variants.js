class Variants extends HTMLElement {
  constructor() {
    super();
    let p = document.querySelector('[id="ProductJSON"]');
    this.product = new window.Shopify.Product(JSON.parse(p.textContent));
    this.realSelect = this.querySelector('[data-real-select]');
    this.fakeOptions = [...this.querySelectorAll('[data-option]')];
    this.allSelectors = document.querySelectorAll('[data-real-select]');
    this.addToCart = document.querySelector('.add-to-cart-container');
    this.notify = document.querySelector('.notify-container');
    this.container = document.querySelector('#MainContent');
  }

  connectedCallback() {
    this.fakeOptions.forEach((radio) => {
      radio.addEventListener('click', () => {
        const { value } = radio;
        this.realSelect.value = value;
      });
    });

    this.realSelect.addEventListener('change', () => {
        this.variantChange();
    });

  }
  variantChange(){
    var variant = this.product.getVariant(this.selectedValues());
    if(variant){
        this.toggleAddButton(false, 'Add to cart', false);
        if(!variant.available){
            this.addToCart.classList.add('hidden');
            this.notify.classList.remove('hidden');
        }else{
          this.addToCart.classList.remove('hidden');
          this.notify.classList.add('hidden');
        }
        this.container.dispatchEvent(
           new CustomEvent('theme:variant:change', {
             detail: {
               variant: variant,
               product_handle : this.product.handle
             }
           })
         );
    }else{
      //let options = this.selectedValues();
      this.setUnavailable();

    }

  }
  updateOptions() {
    this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
  }
  toggleAddButton(disable = true, text, modifyClass = true) {
   const addButton = document.querySelector('[data-add-to-cart]');
   if (!addButton) return;

   if (disable) {
     addButton.setAttribute('disabled', 'disabled');
     if (text) addButton.textContent = text;
   } else {
     addButton.removeAttribute('disabled');
     addButton.textContent = text;
   }

   if (!modifyClass) return;
 }
  setUnavailable() {
    const addButton = document.querySelector('[data-add-to-cart]');
    if (!addButton) return;
    addButton.textContent = window.variantStrings.unavailable;
    addButton.disabled = true;
  }
  selectedValues() {
      var _this2 = this;
      var selected = [];
      this.allSelectors.forEach(function (select) {
        if (select) {
          selected.push(select.options[select.selectedIndex].value);
        }
      });

      return selected;
  }
}

customElements.define('product-variants', Variants);
