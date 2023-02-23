class TagFilter extends HTMLElement {
  connectedCallback() {
    this.tags = [...this.querySelectorAll('[data-tag]')];
    this.base = this.dataset.baseUrl;
    this.productGrid = document.querySelector('[data-product-grid]');

    window.addEventListener('load', () => {
      this.init();
    });
  }

  init() {
    this.tags.forEach((tag) => {
      if (window.location.pathname.includes(tag.dataset.tag)) {
        tag.setAttribute('checked', true);
      }
      tag.addEventListener('click', () => {
        this.applyTags();
      });
    });
  }

  applyTags() {
    const tagUrlSegment = this.tags.filter(({ checked }) => checked)
      .map((tag) => tag.dataset.tag).join('+');
    const newUrl = `${this.base}/${tagUrlSegment.length > 1 ? tagUrlSegment : ''}${window.location.search}`;
    this.updateFilters(newUrl);
  }

  updateFilters(newUrl) {
    window.history.pushState({ collection: `${newUrl}` }, 'collection', newUrl, window.location);

    fetch(`${window.location.search ? `${window.location.search}&` : '?'}sections=collection-product-grid`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.text())
      .then((parsedState) => {
        this.renderSections(JSON.parse(parsedState));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  renderSections(json) {
    let productHTML = document.createElement('div');
    productHTML.innerHTML = json['collection-product-grid'];
    productHTML = productHTML.querySelector('#shopify-section-collection-product-grid').innerHTML;

    this.productGrid.innerHTML = productHTML;
  }
}

customElements.define('tag-filter', TagFilter);
