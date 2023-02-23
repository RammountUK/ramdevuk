class FilterCollection extends HTMLElement {
  connectedCallback() {
    this.filterDisplay = this.querySelector('[data-filter-display]');
    this.productGrid = this.querySelector('[data-product-grid]');
    this.sortBy = this.querySelector('[data-sort-by]');
    this.sidebar = this.querySelector('[data-sidebar]');
    this.sidebarToggles = [...this.querySelectorAll('[data-filter-toggle]')];

    window.addEventListener('load', () => {
      this.tagFilters = [...document.querySelectorAll('tag-filter')];
    });

    this.sidebarToggles.forEach((toggle) => {
      toggle.addEventListener('click', () => {
        if (window.innerWidth < 767) {
          this.sidebar.classList.toggle('-translate-x-full');
        }
      });
    });
    this.init();
  }

  init() {
    this.filterDisplay.querySelectorAll('input').forEach((input) => {
      input.addEventListener('change', () => {
        this.updateFilters(input.dataset.newUrl);
      });
    });

    this.sortBy.addEventListener('change', (e) => {
      const newUrl = new URL(`${window.location}`);
      const params = new URLSearchParams(newUrl.search);
      params.set('sort_by', e.target.value);
      this.updateFilters(`${window.location.pathname}?${params.toString()}`);
    });
  }

  updateFilters(newUrl) {
    window.history.pushState({ collection: `${newUrl}` }, 'collection', newUrl, window.location);

    fetch(`${window.location.search ? `${window.location.search}&` : '?'}sections=collection-filters,collection-product-grid`, {
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
      .finally(() => {
        this.tagFilters.forEach((filter) => {
          filter.applyTags();
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  renderSections(json) {
    let filterHTML = document.createElement('div');
    filterHTML.innerHTML = json['collection-filters'];
    filterHTML = filterHTML.querySelector('#shopify-section-collection-filters').innerHTML;

    this.filterDisplay.innerHTML = filterHTML;

    let productHTML = document.createElement('div');
    productHTML.innerHTML = json['collection-product-grid'];
    productHTML = productHTML.querySelector('#shopify-section-collection-product-grid').innerHTML;

    this.productGrid.innerHTML = productHTML;
    this.init();
  }
}

customElements.define('filter-collection', FilterCollection);
