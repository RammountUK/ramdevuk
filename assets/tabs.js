class Tabs extends HTMLElement {
  constructor() {
    super();
    this.toggles = [...this.querySelectorAll('[data-toggle]')];
    this.collapsibles = [...this.querySelectorAll('[data-content]')];
    this.collapsiblesMobile = [...this.querySelectorAll('[data-tab-menu]')];
    this.togglesMobile = [...this.querySelectorAll('[data-tab-selector]')];
    this.titleOption = [...this.querySelectorAll('[data-title-option]')];
  }

  connectedCallback() {

    this.toggles?.forEach((btn) => {
      const id = btn.dataset.toggle;
      const collapsible = this.collapsibles.find(({ dataset }) => dataset.content === id);
      btn.addEventListener('click', () => {
        this.toggles.forEach((tab)=>{
            tab.classList.remove('active');
        })
        btn.classList.add('active');
        this.titleOption?.forEach((t) => {
          t.innerHTML = btn.text;
        })
        this.collapsiblesMobile.map(( item ) => {
          this.toggleMenu(item);
        });

        // btn.addEventListener('click', () => {
        //   this.toggleMenu(collapsible);
        // });
        this.collapsibles.filter(({ dataset }) => dataset.content !== id)
          .forEach((inactiveCollapsible) => {
            // eslint-disable-next-line no-param-reassign
            inactiveCollapsible.classList.add('hidden');
          });
          collapsible.classList.remove('hidden');
      });

    });

    this.togglesMobile?.forEach((mobileBtn) => {
      const id = mobileBtn.dataset.tabSelector;
      mobileBtn.dataset.tabSelector;
      const collapsible = this.collapsiblesMobile.find(({ dataset }) => dataset.tabMenu === id);

      mobileBtn.addEventListener('click', () => {
        this.toggleMenu(collapsible);
      });
    });

    //DEEP LINK
    let url = window.location.href;
    if (url.indexOf("#") > 0){

      const activeTab = url.substring(url.indexOf("#") + 1);
      const activecollapsible = this.toggles.find(({ dataset }) => dataset.toggle === activeTab.toLowerCase());

      if(activecollapsible){
        activecollapsible.click();
      }
    }
  }
  toggleMenu(collapsible){
    if(this.togglesMobile.length > 0){
      collapsible.style.transition = 'height .5s';
      collapsible.style.height = collapsible.offsetHeight === 0 ? `${collapsible.scrollHeight}px` : '0px';
    }
  }
}
customElements.define('tab-content', Tabs);
