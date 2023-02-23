
window.theme = window.theme || {};

window.Shopify = window.Shopify || {};
window.Shopify.theme = window.Shopify.theme || {};
window.Shopify.theme.sections = window.Shopify.theme.sections || {};

window.Shopify.theme.sections.registered = window.Shopify.theme.sections.registered || {};
window.Shopify.theme.sections.instances = window.Shopify.theme.sections.instances || [];
const registered = window.Shopify.theme.sections.registered;
const instances = window.Shopify.theme.sections.instances;

const selectors$N = {
  id: 'data-section-id',
  type: 'data-section-type',
};

class Registration {
  constructor(type = null, components = []) {
    this.type = type;
    this.components = validateComponentsArray(components);
    this.callStack = {
      onLoad: [],
      onUnload: [],
      onSelect: [],
      onDeselect: [],
      onBlockSelect: [],
      onBlockDeselect: [],
      onReorder: [],
    };
    components.forEach((comp) => {
      for (const [key, value] of Object.entries(comp)) {
        const arr = this.callStack[key];
        if (Array.isArray(arr) && typeof value === 'function') {
          arr.push(value);
        } else {
          console.warn(`Unregisted function: '${key}' in component: '${this.type}'`);
          console.warn(value);
        }
      }
    });
  }

  getStack() {
    return this.callStack;
  }
}

class Section {
  constructor(container, registration) {
    this.container = validateContainerElement(container);
    this.id = container.getAttribute(selectors$N.id);
    this.type = registration.type;
    this.callStack = registration.getStack();

    try {
      this.onLoad();
    } catch (e) {
      console.warn(`Error in section: ${this.id}`);
      console.warn(this);
      console.warn(e);
    }
  }

  callFunctions(key, e = null) {
    this.callStack[key].forEach((func) => {
      const props = {
        id: this.id,
        type: this.type,
        container: this.container,
      };
      if (e) {
        func.call(props, e);
      } else {
        func.call(props);
      }
    });
  }

  onLoad() {
    this.callFunctions('onLoad');
  }

  onUnload() {
    this.callFunctions('onUnload');
  }

  onSelect(e) {
    this.callFunctions('onSelect', e);
  }

  onDeselect(e) {
    this.callFunctions('onDeselect', e);
  }

  onBlockSelect(e) {
    this.callFunctions('onBlockSelect', e);
  }

  onBlockDeselect(e) {
    this.callFunctions('onBlockDeselect', e);
  }

  onReorder(e) {
    this.callFunctions('onReorder', e);
  }
}

function validateContainerElement(container) {
  if (!(container instanceof Element)) {
    throw new TypeError('Theme Sections: Attempted to load section. The section container provided is not a DOM element.');
  }
  if (container.getAttribute(selectors$N.id) === null) {
    throw new Error('Theme Sections: The section container provided does not have an id assigned to the ' + selectors$N.id + ' attribute.');
  }

  return container;
}

function validateComponentsArray(value) {
  if ((typeof value !== 'undefined' && typeof value !== 'object') || value === null) {
    throw new TypeError('Theme Sections: The components object provided is not a valid');
  }

  return value;
}

/*
 * @shopify/theme-sections
 * -----------------------------------------------------------------------------
 *
 * A framework to provide structure to your Shopify sections and a load and unload
 * lifecycle. The lifecycle is automatically connected to theme editor events so
 * that your sections load and unload as the editor changes the content and
 * settings of your sections.
 */

function register(type, components) {
  if (typeof type !== 'string') {
    throw new TypeError('Theme Sections: The first argument for .register must be a string that specifies the type of the section being registered');
  }

  if (typeof registered[type] !== 'undefined') {
    throw new Error('Theme Sections: A section of type "' + type + '" has already been registered. You cannot register the same section type twice');
  }

  if (!Array.isArray(components)) {
    components = [components];
  }

  const section = new Registration(type, components);
  registered[type] = section;
  return registered;
}

function load(types, containers) {
  types = normalizeType(types);

  if (typeof containers === 'undefined') {
    containers = document.querySelectorAll('[' + selectors$N.type + ']');
  }

  containers = normalizeContainers(containers);

  types.forEach(function (type) {
    const registration = registered[type];

    if (typeof registration === 'undefined') {
      return;
    }

    containers = containers.filter(function (container) {
      // Filter from list of containers because container already has an instance loaded
      if (isInstance(container)) {
        return false;
      }

      // Filter from list of containers because container doesn't have data-section-type attribute
      if (container.getAttribute(selectors$N.type) === null) {
        return false;
      }

      // Keep in list of containers because current type doesn't match
      if (container.getAttribute(selectors$N.type) !== type) {
        return true;
      }

      instances.push(new Section(container, registration));

      // Filter from list of containers because container now has an instance loaded
      return false;
    });
  });
}

function unload(selector) {
  var instancesToUnload = getInstances(selector);

  instancesToUnload.forEach(function (instance) {
    var index = instances
      .map(function (e) {
        return e.id;
      })
      .indexOf(instance.id);
    instances.splice(index, 1);
    instance.onUnload();
  });
}

function getInstances(selector) {
  var filteredInstances = [];

  // Fetch first element if its an array
  if (NodeList.prototype.isPrototypeOf(selector) || Array.isArray(selector)) {
    var firstElement = selector[0];
  }

  // If selector element is DOM element
  if (selector instanceof Element || firstElement instanceof Element) {
    var containers = normalizeContainers(selector);

    containers.forEach(function (container) {
      filteredInstances = filteredInstances.concat(
        instances.filter(function (instance) {
          return instance.container === container;
        })
      );
    });

    // If select is type string
  } else if (typeof selector === 'string' || typeof firstElement === 'string') {
    var types = normalizeType(selector);

    types.forEach(function (type) {
      filteredInstances = filteredInstances.concat(
        instances.filter(function (instance) {
          return instance.type === type;
        })
      );
    });
  }

  return filteredInstances;
}

function getInstanceById(id) {
  var instance;

  for (var i = 0; i < instances.length; i++) {
    if (instances[i].id === id) {
      instance = instances[i];
      break;
    }
  }
  return instance;
}

function isInstance(selector) {
  return getInstances(selector).length > 0;
}

function normalizeType(types) {
  // If '*' then fetch all registered section types
  if (types === '*') {
    types = Object.keys(registered);

    // If a single section type string is passed, put it in an array
  } else if (typeof types === 'string') {
    types = [types];

    // If single section constructor is passed, transform to array with section
    // type string
  } else if (types.constructor === Section) {
    types = [types.prototype.type];

    // If array of typed section constructors is passed, transform the array to
    // type strings
  } else if (Array.isArray(types) && types[0].constructor === Section) {
    types = types.map(function (Section) {
      return Section.type;
    });
  }

  types = types.map(function (type) {
    return type.toLowerCase();
  });

  return types;
}

function normalizeContainers(containers) {
  // Nodelist with entries
  if (NodeList.prototype.isPrototypeOf(containers) && containers.length > 0) {
    containers = Array.prototype.slice.call(containers);

    // Empty Nodelist
  } else if (NodeList.prototype.isPrototypeOf(containers) && containers.length === 0) {
    containers = [];

    // Handle null (document.querySelector() returns null with no match)
  } else if (containers === null) {
    containers = [];

    // Single DOM element
  } else if (!Array.isArray(containers) && containers instanceof Element) {
    containers = [containers];
  }

  return containers;
}

if (window.Shopify.designMode) {
  document.addEventListener('shopify:section:load', function (event) {
    var id = event.detail.sectionId;
    var container = event.target.querySelector('[' + selectors$N.id + '="' + id + '"]');

    if (container !== null) {
      load(container.getAttribute(selectors$N.type), container);
    }
  });

  document.addEventListener('shopify:section:reorder', function (event) {
    var id = event.detail.sectionId;
    var container = event.target.querySelector('[' + selectors$N.id + '="' + id + '"]');
    var instance = getInstances(container)[0];

    if (typeof instance === 'object') {
      unload(container);
    }

    if (container !== null) {
      load(container.getAttribute(selectors$N.type), container);
    }
  });

  document.addEventListener('shopify:section:unload', function (event) {
    var id = event.detail.sectionId;
    var container = event.target.querySelector('[' + selectors$N.id + '="' + id + '"]');
    var instance = getInstances(container)[0];

    if (typeof instance === 'object') {
      unload(container);
    }
  });

  document.addEventListener('shopify:section:select', function (event) {
    var instance = getInstanceById(event.detail.sectionId);

    if (typeof instance === 'object') {
      instance.onSelect(event);
    }
  });

  document.addEventListener('shopify:section:deselect', function (event) {
    var instance = getInstanceById(event.detail.sectionId);

    if (typeof instance === 'object') {
      instance.onDeselect(event);
    }
  });

  document.addEventListener('shopify:block:select', function (event) {
    var instance = getInstanceById(event.detail.sectionId);

    if (typeof instance === 'object') {
      instance.onBlockSelect(event);
    }
  });

  document.addEventListener('shopify:block:deselect', function (event) {
    var instance = getInstanceById(event.detail.sectionId);

    if (typeof instance === 'object') {
      instance.onBlockDeselect(event);
    }
  });
}
let sections$5 = {};
class ChangeVariantData {
  constructor(section) {
    this.container = section.container;
    this.productContainer = document.querySelector('#MainContent');
    this.productContainer.addEventListener('theme:variant:change', (event) => {
      this.updateProduct(event);
    });
  }

  updateProduct(event){
    const container = this.productContainer.querySelector('[data-variant-overview-container]');
    const resource = this.productContainer.querySelector('[data-variant-resource-container]');
    const gallery = this.productContainer.querySelector('[data-variant-gallery-container]');
    const productInfo = this.productContainer.querySelector('[data-variant-info-container]');
    const features = this.container.querySelector('[data-variant-features-container]');
     const variant = event.detail.variant;
     const handle = event.detail.product_handle
    if (productInfo && variant) {
      fetch(`${window.routes.root_url}variants/${variant.id}/?section_id=api-variant-info`)
        .then((response) => response.text())
        .then((text) => {
          const featuresHTML = new DOMParser().parseFromString(text, 'text/html').querySelector('[data-api-content]').innerHTML;
          productInfo.innerHTML = featuresHTML;
        })
        .catch((e) => {
          console.error(e);
        });
    }
    if (container && variant) {
      fetch(`${window.routes.root_url}variants/${variant.id}/?section_id=api-variant-overview`)
        .then((response) => response.text())
        .then((text) => {
          const featuresHTML = new DOMParser().parseFromString(text, 'text/html').querySelector('[data-api-content]').innerHTML;
          container.innerHTML = featuresHTML;
        })
        .catch((e) => {
          console.error(e);
        });
    }
    if (resource && variant) {
      fetch(`${window.routes.root_url}variants/${variant.id}/?section_id=api-variant-resources`)
        .then((response) => response.text())
        .then((text) => {
          const featuresHTML = new DOMParser().parseFromString(text, 'text/html').querySelector('[data-api-content]').innerHTML;
          resource.innerHTML = featuresHTML;
        })
        .catch((e) => {
          console.error(e);
        });
    }
    if (gallery && variant) {
        fetch(`${window.routes.root_url}variants/${variant.id}/?section_id=api-product-gallery&product_handle=${handle}&cache=false`)
          .then((response) => response.text())
          .then((text) => {
            const featuresHTML = new DOMParser().parseFromString(text, 'text/html').querySelector('[data-api-content]').innerHTML;
            gallery.innerHTML = featuresHTML;
            gallery.dispatchEvent(
               new CustomEvent('theme:gallery:reinit', {
                 detail: {
                   variant: variant
                 }
               })
             );
          })
          .catch((e) => {
            console.error(e);
          });

    }
    if (features && variant) {
      fetch(`${window.routes.root_url}variants/${variant.id}/?section_id=api-variant-features`)
        .then((response) => response.text())
        .then((text) => {
          const featuresHTML = new DOMParser().parseFromString(text, 'text/html').querySelector('[data-api-content]').innerHTML;
          features.innerHTML = featuresHTML;
        })
        .catch((e) => {
          console.error(e);
        });
    }
    //UPDATE URL
    let updateURL =  window.location.origin + '/products/' + handle + '/' + variant.id;
    //let updateURL = "http://127.0.0.1:9292" + '/products/' + handle + '/' + variant.id;
    UpdateProductPage("variant title", updateURL)
  }
}
function UpdateProductPage(title, urlPath){

     window.history.pushState({"pageTitle":title},"", urlPath);
 }

const changeVariant = {
    onLoad() {
      sections$5[this.id] = new ChangeVariantData(this);
    },
};

register('product', [changeVariant]);

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
document.addEventListener('DOMContentLoaded', function () {
  // Load all registered sections on the page.
  load('*');
  //delay(1000).then(() => document.body.innerHTML =  document.body.innerHTML.replace(/[®]/g, '<sup>$&</sup>'));
});

// superscript all register marks
// document.body.innerHTML =  document.body.innerHTML.replace(/[®]/g, '<sup>$&</sup>');

let print = document.querySelector('.print-btn');
if(print){
  print.addEventListener('click', (e) => {
    e.preventDefault();
    var newWin = window.open(window.location.pathname + '/print-friendly', 'Print Details', 'height=600,width=800');
    newWin.addEventListener('load', function() {
      newWin.print();
      newWin.onfocus = function() {
        newWin.close();
      };
    }, true);
  });
}
