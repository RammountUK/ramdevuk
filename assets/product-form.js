class ProductForm extends HTMLElement {
    connectedCallback() {

        this.addToCartButtons = [...this.querySelectorAll('[data-add-to-cart]')];
        this.quantity = '';
        this.cursor = document.getElementById('custom-cursor');
        this.optionSelects = [];
        this.minicart = document.querySelector('mini-cart');

        this.addToCartButtons.forEach(el => el.addEventListener('click', (e) => {
            this.addToCart(this.getIdToAdd(e));
        }));

        window.addEventListener('load', () => {
            // in case it wasn't loaded when the form was added
            this.minicart = document.querySelector('mini-cart');
            this.optionSelects = [...this.querySelectorAll('[data-real-select]')];
            this.quantity = this.querySelector('[data-qty]');
        });
    }

    async addToCart(variantId) {
        const qty = this.quantity?.value ? Number(this.quantity.value) : 1;

        let res;
        if (qty > 0) {
            const data = {
                id: variantId,
                quantity: qty,
                sections: ['minicart-items', 'cart-toggle-with-item-count'],
            };
            res = await fetch('/cart/add.js', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((response) => response.json())
                .then((parsedState) => {
                    this.minicart?.refresh(parsedState);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }

        return res;
    }

    getIdToAdd(e) {
        const { optionSelects } = this;

        const variant = e.target.dataset.variants;
        if(variant){
            return variant;
        }
        let idToAdd = Number(e.target.dataset.addToCart);
        if (idToAdd) {
            return idToAdd;
        }

        // // if variants, identify selected variant
        // if (optionSelects.length) {
        //     const selectedOptions = [];
        //
        //     optionSelects.forEach((option) => {
        //         selectedOptions.push(option.value);
        //     });
        //
        //     const selectedVariant = variants
        //         .find(({ options }) => selectedOptions.every((option) => options.includes(option)))?.id;
        //
        //     if (selectedVariant) {
        //         idToAdd = selectedVariant;
        //     }
        // }

        return;
    }
}

customElements.define('product-form', ProductForm);
