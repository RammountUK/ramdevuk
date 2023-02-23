class MenuDrawer extends HTMLElement {
  constructor() {
    super();
    // open and close drawer
    this.drawerToggles = [...document.querySelectorAll('[data-drawer-toggle]')];

    // open and close drawer
    this.searchToggle = document.querySelector('[data-search-toggle]');

    this.searchForm = document.querySelector('[data-search-form]');

    this.closeForm = document.querySelector('[data-search-close]');

    // menu animations
    this.menus = [...this.querySelectorAll('[data-menu]')];
    //this.menuSelectionButtons = [...this.querySelectorAll('[data-menu-selector]')];
    // default to the first menu being open
    //this.activeMenu = this.menuSelectionButtons[0].dataset.id;
    this.menuWrap = this.querySelector('[data-menu-wrap]');
  }

  connectedCallback() {
    this.drawerToggles.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (this.dataset.isOpen) {
          this.close();
        } else {
          this.open();
        }
      });
    });


    this.searchToggle.addEventListener('click', () => {
      this.searchForm.classList.remove("invisible");
      this.searchForm.classList.add("visible");
      this.searchForm.classList.add("animate-fade");
      
    });

    this.closeForm.addEventListener('click', () => {
      this.searchForm.classList.remove("visible");
      this.searchForm.classList.add("invisible");
      
    });

    // this.menuSelectionButtons.forEach((btn) => {
    //   btn.addEventListener('click', () => {
    //     this.activeMenu = btn.dataset.id;
    //     this.animateMenus();
    //   });
    // });
    // this.animateMenus();


    this.querySelectorAll('.header__submenu:not(.navmenu-meganav) .navmenu-link-parent').forEach(submenu => {
        submenu.addEventListener('click', this.toggleSubmenu.bind(this))

     });

    if (document.readyState === 'complete') {
      this.setOffset();
    } else {
      window.addEventListener('load', () => {
        this.setOffset();
      });
    }
  }
  toggleSubmenu(event){
    event.preventDefault();

    const $target= event.currentTarget;
    const $menu = $target.nextElementSibling;;

    if($menu.getAttribute('data-animation-state') == 'open'){
      this.closeSubmenu($target);
    }else{
      this.openSubmenu($target);
    }
  }
  openSubmenu($target) {
   const $menu = $target.nextElementSibling;;
   $menu.setAttribute('data-animation-state', 'open');
 }
 closeSubmenu($target) {
   const $menu = $target.nextElementSibling;;
   $menu.setAttribute('data-animation-state', 'closed');
 }
  setOffset() {
    const headerHeight = document.querySelector('[data-header]')?.scrollHeight ?? 0;
    const announcementHeight = document.querySelector('[data-announcement-bar]')?.scrollHeight ?? 0;
    const offset = headerHeight + announcementHeight;

    this.style.top = `${offset}px`;
  }

  open() {
    this.setAttribute('data-is-open', true);
    this.classList.remove('-translate-x-full');

    // this swaps the burger button with the close button
    this.drawerToggles.forEach((btn) => {
      [...btn.children][0]?.classList.add('hidden');
      [...btn.children][1]?.classList.remove('hidden');
    });

    window.addEventListener('click', (e) => {
      this.handleBodyClick(e);
    });
  }

  close() {
    this.removeAttribute('data-is-open', true);
    this.classList.add('-translate-x-full');


    // setTimeout(() => {
    //   this.animateMenus();
    // }, 500);

    // this swaps the close button with the burger button
    this.drawerToggles.forEach((btn) => {
      [...btn.children][1]?.classList.add('hidden');
      [...btn.children][0]?.classList.remove('hidden');
    });
    window.removeEventListener('click', (e) => {
      this.handleBodyClick(e);
    });
  }

  animateMenus() {
    // this regex just removes any non-digit characters from the string
    const activeIndex = parseInt(this.activeMenu.replace(/\D/g, ''), 10);
    this.menus.forEach((menu) => {
      const currentIndex = parseInt(menu.dataset.id.replace(/\D/g, ''), 10);
      if (currentIndex === activeIndex) {
        menu.classList.remove('opacity-0', 'translate-x-full', '-translate-x-full');
        this.menuWrap.style.height = `${menu.scrollHeight}px`;
      } else if (currentIndex > activeIndex) {
        menu.classList.remove('-translate-x-full');
        menu.classList.add('opacity-0', 'translate-x-full');
      } else {
        menu.classList.remove('translate-x-full');
        menu.classList.add('opacity-0', '-translate-x-full');
      }
    });

    this.menuSelectionButtons.forEach((btn) => {
      const currentIndex = parseInt(btn.dataset.id.replace(/\D/g, ''), 10);
      if (currentIndex === activeIndex) {
        btn.classList.add('btn-dark');
      } else {
        btn.classList.remove('btn-dark');
      }
    });
  }

  handleBodyClick(e) {
    const { target } = e;
    if (target !== this && !target.closest('menu-drawer') && !target.closest('[data-drawer-toggle]')) {
      this.close();
    }
  }
}

customElements.define('menu-drawer', MenuDrawer);
