const cartUpdateQty = (id, quantity) => {
  const data = { id, quantity, sections: ['cart'] };
  const cartContents = fetch('/cart/change.js', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });

  return cartContents;
};

class Cart extends HTMLElement {
  constructor() {
    super();
    this.cart = {};
    this.discount = this.querySelector("[data-discount]");
  }

  connectedCallback() {
    this.addListeners();

  }

  updateVariants(prevVariantId, qty, newVariantId) {
    this.cartAddNewItem(newVariantId, qty).then(() => {
      cartUpdateQty(prevVariantId, 0)
        .then((data) => {
          this.cart = data;
        })
        .finally(() => {
          this.renderCartItems();
          this.addListeners();
        });
    });
  }

  addListeners() {
    [...this.querySelectorAll('[data-continue-shopping]')].forEach((btn) => {
      btn.addEventListener('click', () => this.close());
    });

    this.discount.addEventListener('click', (e) => {
      const discount = this.querySelector('[name="discount"]');
      if(discount.value){
        window.location.href = `https://rammount.com/discount/${discount.value}?redirect=/checkout`;
      }

    });

    [...this.querySelectorAll('[data-delete]')].forEach((el) => {
      el.addEventListener('click', () => {
        cartUpdateQty(el.dataset.delete, 0)
          .then((data) => {
            this.cart = data;
          })
          .finally(() => {
            this.renderCartItems();
            this.addListeners();
          });
      });
    });

    [...this.querySelectorAll('[data-update]')].forEach((el) => {
      el.addEventListener('click', () => {

         cartUpdateQty(el.dataset.update, el.dataset.qty)
          .then((data) => {
            this.cart = data;
          })
          .finally(() => {
            this.renderCartItems(el.dataset.update);
            this.addListeners();
          });
      });
    });

    [...this.querySelectorAll('[data-keyqty]')].forEach((el) => {
      el.addEventListener('change', (event) => {
        cartUpdateQty(event.target.dataset.key, event.target.value)
            .then((data) => {
              this.cart = data;
            })
            .finally(() => {
              this.renderCartItems(event.target.dataset.key);
              this.addListeners();
        });
      });
    });

  }

  async renderCartItems(key) {

    if (this.cart?.sections?.cart) {
      this.innerHTML = this.cart.sections.cart;
    }
    //UPDATE HEADER COUNT
    [...document.querySelectorAll('[data-items-count]')].forEach((item) => {
      item.innerHTML = this.cart.item_count;
    });

  }

  refresh(data) {
    this.cart = data;
    this.renderCartItems();
    this.addListeners();
  }
}

customElements.define('custom-cart', Cart);
