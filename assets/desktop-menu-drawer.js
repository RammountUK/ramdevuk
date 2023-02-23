// /* eslint-disable no-param-reassign */
// class DesktopMenuDrawer extends HTMLElement {
//   constructor() {
//     super();
//     this.activeMenuId = null;
//     this.activeChildMenuId = null;
//     this.parentMenuToggles = null;
//     this.closeButton = this.querySelector('[data-close');
//     this.backdrop = this.querySelector('[data-backdrop]');
//     this.childMenus = [...this.querySelectorAll('[data-child-menu]')];
//     this.childMenuToggles = [...this.querySelectorAll('[data-child-link-id]')];
//     this.grandchildMenus = [...this.querySelectorAll('[data-grandchild-menu]')];
//   }
//
//   connectedCallback() {
//     if (document.readyState === 'complete') {
//       this.init();
//     } else {
//       window.addEventListener('load', () => {
//         this.init();
//       });
//     }
//   }
//
//   init() {
//     this.parentMenuToggles = [...document.querySelectorAll('[data-link-id]')];
//
//     this.addListeners();
//     setTimeout(() => {
//       this.setOffset();
//     }, 500);
//   }
//
//   setOffset() {
//     const headerHeight = document.querySelector('[data-header]')?.scrollHeight ?? 0;
//     const announcementHeight = document.querySelector('[data-announcement-bar]')?.scrollHeight ?? 0;
//     const offset = headerHeight + announcementHeight;
//
//     this.closeButton.style.transform = `translateY(-${headerHeight}px)`;
//     this.backdrop.style.top = `${offset}px`;
//     this.childMenus.forEach((menu) => {
//       menu.style.top = `${offset}px`;
//     });
//     this.grandchildMenus.forEach((menu) => {
//       menu.style.top = `${offset}px`;
//     });
//   }
//
//   animateChildren() {
//     this.childMenus.forEach((menu) => {
//       if (menu.dataset.childMenu === this.activeMenuId) {
//         menu.style.width = `${100 / 3}%`;
//         menu.classList.remove('opacity-0', '-translate-x-screen-1/3');
//       } else {
//         menu.style.width = 0;
//         menu.classList.add('opacity-0', '-translate-x-screen-1/3');
//       }
//     });
//     this.parentMenuToggles?.forEach((toggle) => {
//       if (this.activeMenuId === toggle.dataset.linkId) {
//         toggle.classList.replace('border-transparent', 'border-current');
//       } else {
//         toggle.classList.replace('border-current', 'border-transparent');
//       }
//     });
//   }
//
//   animateGrandchildren() {
//     this.grandchildMenus.forEach((menu) => {
//       if (menu.dataset.grandchildMenu === this.activeChildMenuId) {
//         menu.classList.remove('hidden');
//         menu.classList.add('delay-200');
//         menu.classList.replace('transition-short', 'transition-long');
//         setTimeout(() => {
//           menu.classList.remove('opacity-0');
//         }, 250);
//       } else {
//         menu.classList.replace('transition-long', 'transition-short');
//         menu.classList.add('opacity-0');
//         menu.classList.remove('delay-200');
//         setTimeout(() => {
//           menu.classList.add('hidden');
//         }, 500);
//       }
//     });
//     this.childMenuToggles?.forEach((toggle) => {
//       if (this.activeChildMenuId === toggle.dataset.childLinkId) {
//         toggle.classList.add('font-bold');
//       } else {
//         toggle.classList.remove('font-bold');
//       }
//     });
//   }
//
//   addListeners() {
//     this.closeButton.addEventListener('click', () => {
//       this.close();
//     });
//
//     this.parentMenuToggles?.forEach((toggle) => {
//       toggle.addEventListener('click', () => {
//         this.activeMenuId = toggle.dataset.linkId;
//         this.openChildMenuDisplay();
//         this.animateChildren();
//       });
//     });
//
//     this.childMenuToggles?.forEach((toggle) => {
//       toggle.addEventListener('click', () => {
//         this.activeChildMenuId = toggle.dataset.childLinkId;
//         this.openGrandchildMenuDisplay();
//         this.animateGrandchildren();
//       });
//     });
//   }
//
//   openChildMenuDisplay() {
//     if (this.activeChildMenuId) {
//       this.close();
//       this.backdrop.classList.add('-translate-x-1/2');
//     }
//     this.backdrop.classList.replace('-translate-x-full', '-translate-x-1/2');
//     this.addWindowEventListeners();
//   }
//
//   openGrandchildMenuDisplay() {
//     this.childMenus.forEach((menu) => {
//       menu.classList.replace('right-0', 'right-1/3');
//     });
//     this.backdrop.classList.remove('-translate-x-1/2');
//   }
//
//   close() {
//     if (this.activeChildMenuId) {
//       this.activeChildMenuId = null;
//       this.animateGrandchildren();
//       this.childMenus.forEach((menu) => {
//         menu.classList.replace('right-1/3', 'right-0');
//       });
//       this.backdrop.classList.add('-translate-x-1/2');
//     } else if (this.activeMenuId) {
//       this.activeMenuId = null;
//       this.animateChildren();
//       this.backdrop.classList.replace('-translate-x-1/2', '-translate-x-full');
//       this.removeWindowEventListeners();
//     } else {
//       this.animateGrandchildren();
//       this.animateChildren();
//       this.backdrop.classList.remove('-translate-x-1/2');
//       this.backdrop.classList.add('-translate-x-full');
//       this.removeWindowEventListeners();
//     }
//   }
//
//   addWindowEventListeners() {
//     window.addEventListener('click', (e) => {
//       this.handleBodyClick(e);
//     });
//     window.addEventListener('keydown', (e) => {
//       if (e.key === 'Escape') {
//         this.close();
//       }
//     });
//   }
//
//   removeWindowEventListeners() {
//     window.removeEventListener('click', (e) => {
//       this.handleBodyClick(e);
//     });
//     window.removeEventListener('keydown', (e) => {
//       if (e.key === 'Escape') {
//         this.close();
//       }
//     });
//   }
//
//   handleBodyClick(e) {
//     const { target } = e;
//     if (target !== this && !target.closest('desktop-menu-drawer') && !target.closest('[data-desktop-drawer-selectors]')) {
//       this.activeChildMenuId = null;
//       this.activeMenuId = null;
//       this.close();
//     }
//   }
// }
//
// customElements.define('desktop-menu-drawer', DesktopMenuDrawer);
