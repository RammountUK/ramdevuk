class HeaderDrawer extends HTMLElement {
  constructor() {
    super();
     this.mainDetailsToggles = this.querySelectorAll('details');
     this.navSubMenu = this.querySelector('.header__submenu');
     this.activeMenuClass = 'navmenu-link-parent-active';
   //   this.addEventListener('keyup', this.onKeyUp.bind(this));

    this.bindEvents();
  }
  onFocusOut(target) {
    const scope = this;
   setTimeout(() => {
      if (target.hasAttribute('open')) scope.closeMenuDrawer(scope, target);
   }, "200");
 }
 bindEvents() {
    this.mainDetailsToggles.forEach(detail => detail.addEventListener('focusout', this.onFocusOut.bind(this,detail)));
   //this.querySelectorAll('summary').forEach(summary => summary.addEventListener('click', this.onSummaryClick.bind(this)));
   // this.querySelectorAll('button').forEach(button => button.addEventListener('click', this.onCloseButtonClick.bind(this)));
   //
   //
   // this.querySelectorAll('.header__submenu .navmenu-link-parent').forEach(submenu => {
   //   submenu.addEventListener('click', this.toggleSubmenu.bind(this))
   //  });
   //  this.querySelectorAll('.header__submenu:not(.navmenu-meganav) .navmenu-item-parent').forEach(submenu => {
   //      const $target = submenu.querySelector('.navmenu-link-parent');
   //      submenu.addEventListener('mouseleave', this.closeSubmenu.bind(submenu,$target))
   //      submenu.addEventListener('mouseenter', this.openSubmenu.bind(submenu,$target))
   //      submenu.addEventListener('click', this.openSubmenu.bind(submenu,$target))
   //
   //   });
   //
   //  this.querySelectorAll('.navmenu-depth-1 > .navmenu-item-parent:not(.navmenu-meganav__item-parent)').forEach(menu => {
   //    //  menu.addEventListener('mouseenter', this.openMenu.bind(this))
   //      menu.addEventListener('mouseleave', this.closeMenu.bind(this))
   //      //menu.addEventListener('click', this.openMenu.bind(this))
   //      //submenu.addEventListener('mouseenter', this.openSubmenu.bind(submenu,$target))
   //   });

 }
 onKeyUp(event) {
    if(event.code.toUpperCase() !== 'ESCAPE') return;

    const openDetailsElement = event.target.closest('details[open]');
    if(!openDetailsElement) return;

    this.mainDetailsToggles.forEach(function(detail){

      openDetailsElement === detail ? this.closeMenuDrawer(event, detail.querySelector('summary')) : this.closeSubmenu(openDetailsElement);
    });

  }
  onSummaryClick(event) {
      const summaryElement = event.currentTarget;
      const detailsElement = summaryElement.parentNode;
      const isOpen = detailsElement.hasAttribute('open');
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const target = this;

      function addTrapFocus() {
        trapFocus(summaryElement.nextElementSibling, detailsElement.querySelector('button'));
        summaryElement.nextElementSibling.removeEventListener('transitionend', addTrapFocus);
      }

      this.mainDetailsToggles.forEach(function(detail) {
        if (detailsElement === detail) {
          if(isOpen) event.preventDefault();
          isOpen ? target.closeMenuDrawer(event, summaryElement) : target.openMenuDrawer(summaryElement);
        } else {
          setTimeout(() => {
            detailsElement.classList.add('menu-opening');
            summaryElement.setAttribute('aria-expanded', true);
            !reducedMotion || reducedMotion.matches ? addTrapFocus() : summaryElement.nextElementSibling.addEventListener('transitionend', addTrapFocus);
          }, 100);
        }
      });


    }
    openMenuDrawer(summaryElement) {

       // setTimeout(() => {
       //  summaryElement.parentNode.classList.add('menu-opening');
       // });
       // summaryElement.setAttribute('aria-expanded', true);
       // trapFocus(summaryElement.parentNode, summaryElement);
       // document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
    }
    openMenu(event) {
      const detailsElement = event.target.closest('details');
      const isOpen = detailsElement.hasAttribute('open');
      if(!isOpen) detailsElement.setAttribute('open', true);
      function addTrapFocus() {
        trapFocus(summaryElement.nextElementSibling, detailsElement.querySelector('button'));
        summaryElement.nextElementSibling.removeEventListener('transitionend', addTrapFocus);
      }
    }
    closeMenu(event) {
      const detailsElement = event.target.querySelector('details');;
      const isOpen = detailsElement.hasAttribute('open');
      if(isOpen) detailsElement.removeAttribute('open');
   }

  closeMenuDrawer(event, elementToFocus = false) {
    if (event === undefined) return;
    elementToFocus.parentNode.classList.remove('menu-opening');
    elementToFocus.parentNode.querySelectorAll('details').forEach(details =>  {
      details.removeAttribute('open');
      details.classList.remove('menu-opening');
    });
    removeTrapFocus(elementToFocus);
    this.closeAnimation(elementToFocus.parentNode);
  //  this.header.classList.remove('menu-open');
    this.navSubMenu.setAttribute('data-animation-state', 'closed');
  }
  onCloseButtonClick(event) {
    const detailsElement = event.currentTarget.closest('details');
    this.closeSubmenu(detailsElement);
  }
  toggleSubmenu(event){
    event.preventDefault();
    const $target = event.currentTarget;
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

  closeAnimation(detailsElement) {
    let animationStart;

    const handleAnimation = (time) => {
      if (animationStart === undefined) {
        animationStart = time;
      }

      const elapsedTime = time - animationStart;

      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation);
      } else {
        detailsElement.removeAttribute('open');
        if (detailsElement.closest('details[open]')) {
          trapFocus(detailsElement.closest('details[open]'), detailsElement.querySelector('summary'));
        }
      }
    }

    window.requestAnimationFrame(handleAnimation);
  }
}

customElements.define('header-drawer', HeaderDrawer);
