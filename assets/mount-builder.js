class MountBuilder extends HTMLElement {
  constructor() {
    super();
    this.container = this.querySelector('[data-builder-content]');
    this.context = null;
    this.back = this.querySelector('#back-btn');
    this.minicart = document.querySelector('mini-cart');
    this.startOver = this.querySelector('[data-start-over]');
    this.disableHeading = false;
  }

  connectedCallback() {
    this.start();
    this.back.addEventListener('click', (e) => {
        this.goBack(e);
    });
    this.startOver.addEventListener('click', (e) => {
        this.start(e);
    });
    this.back.classList.add('hidden');
  }
  async sendRequest(body){
    if(!this.disableHeading && (body != "START_BUILDER")){
      this.querySelector("#steps-banner").classList.add('hidden');
      this.disableHeading = true;
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(body)
    };
    let results = null;
    await fetch("https://conx-staging.rammount.com/mntbuilder?key=gNz!W%232Pyeu8RdKGzA4%25SWrr", requestOptions)
    .then(response => response.json())
    .then(result => {
      results = result
     })
    .catch(error => console.log('error', error));
    this.context = results;
    return;

  }

  async start(){
    await this.sendRequest("START_BUILDER")
    if(this.context){
      gtag("event", "mount_builder_started", {
          value: this.context
        });
      this.buildStep();
    }
  }
  async goBack(){
    if(this.context.accessories_active){
      this.context.accessories_active = false;
      if(this.context){
        this.buildStep();
      }
    }else{
      this.context.context.go_back = 1;
      await this.sendRequest(this.context.context)
      if(this.context){
        
        this.buildStep();
      }
    }

  }
  buildStep(){
    var steps = JSON.stringify(this.context.context);
    steps = steps.slice(1, -1);
      if('device' in this.context.context ){
        this.back.classList.remove('hidden');
      }else{
        this.back.classList.add('hidden');
      }
      switch(this.context.page_type) {
        case "image_list":
          gtag("event", "builder_step_completed", {
          steps
        });
          console.log(this.context.context);
          this.buildImageList(this.context)
          break;
        case "dropdowns":
          this.buildDropDown(this.context)
          break;
        case "results":
          this.buildResults(this.context)
        default:
          break;
      }
  }
  async nextStep(item){
    if(item.tagName.toLowerCase() == 'select'){
        const key = item.dataset.type;
        const value = item.value;
        let updated = false;
        let ymm = false;
        if(Object.keys(this.context.dropdowns[0]).length > 2){
          ymm = true;
        }
        this.context.context[key] = value;
        if(Array.isArray(this.context.dropdowns[0][key])){
          //First Item
          for (const k in this.context.dropdowns[0]) {
              if(k != key ){
                //CLEAR ANY PAST VALUE
                this.context.context[k] = "";
                const newArray = this.context.dropdowns[0][k][item.value]
                if(Array.isArray(newArray)){
                  let selectNode = this.container.querySelector(`[data-type=${k}]`)
                  let multiNode = this.container.querySelector(`[data-selector=${k}]`)
                  ///Add Remove Options
                  let i, L = selectNode.options.length - 1;
                  for(i = L; i >= 0; i--) {
                      if(i != 0){
                        selectNode.remove(i);
                      }
                  }
                  ///Add NEW Options
                  newArray.map((op) => {
                    const option = document.createElement("option");
                    option.text = op;
                    option.value = op;
                    selectNode.add(option);
                  })
                  multiNode.removeAttribute("data-disabled");
                  updated = true;
                  let customClass = `select-${k}`;
                  
                 
                  selectNode.classList.add(customClass)
                 
                  break;
                }
              }
          }

        }else{
          //Final DD
          let pass = true;
          let selectEl = null;
          this.container.querySelectorAll('select').forEach(el => {
              if(el.value == ""){
                pass = false;
                selectEl = el;
              }
          });
          if(pass){
            this.context.context[key] = value;
            await this.sendRequest(this.context.context);
            this.buildStep();
          }else{
            if(selectEl){
              let keys = [];
              for (const k in this.context.dropdowns[0]) {
                  if(k != selectEl.dataset.type){
                    keys.push(this.context.context[k])
                  }
              }
              this.context.context[selectEl.dataset.type] = "";
              const newArray = this.context.dropdowns[0][selectEl.dataset.type][keys.join('_')]
              if(Array.isArray(newArray)){
                  let selectNode = this.container.querySelector(`[data-type=${selectEl.dataset.type}]`)
                  let multiNode = this.container.querySelector(`[data-selector=${selectEl.dataset.type}]`)
                  ///Add Remove Options
                  let i, L = selectNode.options.length - 1;
                  for(i = L; i >= 0; i--) {
                      if(i != 0){
                        selectNode.remove(i);
                      }
                  }
                  ///Add NEW Options
                  newArray.map((op) => {
                    const option = document.createElement("option");
                    option.text = op;
                    option.value = op;
                    selectNode.add(option);
                  })
                  multiNode.removeAttribute("data-disabled");
                  let customClass = 'select-' + Math.floor(Math.random() * 10000);
                  selectNode.classList.add(customClass)
                 
            }
          }
        }
      }
    }else{
       const field = item.dataset.type;
       this.context.context[this.context.field] = field;
       await this.sendRequest(this.context.context);
       this.buildStep();

    }
  }
  async loadProductTile(options, selector){
    let productTiles = "";
    if(options.length == 1){
      productTiles = "<div></div>"; 
    }
    if(options && options.length > 0){
      for (let i = 0; i < options.length; i++) {
        await fetch(`${window.routes.root_url}products/${options[i]}/?section_id=api-product-tile`)
        .then((response) => response.text())
        .then((text) => {
            productTiles += new DOMParser().parseFromString(text, 'text/html').querySelector('[data-api-content]').innerHTML;

            return;
        })
        .catch((e) => {
          console.error(e);
        });
      }
      this.container.querySelector(selector).innerHTML =  productTiles;
    }
  }
  async buildResults(data){
    await fetch(`${window.routes.root_url}?section_id=api-mb-results`)
      .then((response) => response.text())
      .then((text) => {
        const listHTML = new DOMParser().parseFromString(text, 'text/html').querySelector('[data-api-content]').innerHTML;
        this.container.innerHTML = "";
        this.container.innerHTML = listHTML;
        this.container.querySelector('[data-heading]').innerText = data.header_question;
      })
      .catch((e) => {
        console.error(e);
      });
      if(data.parts && data.parts.length > 0){
          this.loadProductTile(data.parts, '#tabs-option-1 [data-inner-content]');
      }
      if(data.option_2 && data.option_2.length > 0){
          this.loadProductTile(data.option_2, '#tabs-option-2 [data-inner-content]');
      }else{
          this.container.querySelector('.mobile-toggle').classList.add('hidden');
      }
      if(data.option_3 && data.option_3.length > 0){
          this.loadProductTile(data.option_3, '#tabs-option-3 [data-inner-content]');
      }else{
        this.container.querySelector('.mobile-toggle ul li:last-child').classList.add('hidden');
      }
      //SETUP CART BUTTONS
      const addToCartButtons = [...this.container.querySelectorAll('[data-add-bundle]')];
      addToCartButtons.forEach(el => el.addEventListener('click', (e) => {
          this.bundleProducts(e);
      }));
      const accessoryBtn = this.container.querySelector('[data-add-accessory]');
      if(data.accessories && data.accessories.length > 0){
        accessoryBtn.addEventListener('click', (e) => {
            this.loadAccessories(e);
        });
      }else{
        accessoryBtn.classList.add('hidden');
      }
  }
  async loadAccessories(){
      this.context.accessories_active = true;
      await fetch(`${window.routes.root_url}?section_id=api-mb-accessories`)
        .then((response) => response.text())
        .then((text) => {
          const listHTML = new DOMParser().parseFromString(text, 'text/html').querySelector('[data-api-content]').innerHTML;
          this.container.innerHTML = "";
          this.container.innerHTML = listHTML;
          this.container.querySelector('[data-heading]').innerText = "We recommend these accessories for your kit.";
        })
        .catch((e) => {
          console.error(e);
        });
        if(this.context.accessories && this.context.accessories.length > 0){
            this.loadProductTile(this.context.accessories, '#result-list');
        }
  }
  bundleProducts(event){
    const products = event.target.closest("[data-content]").querySelectorAll("product-tile");
    if(products){
      let items =  [];
      for (let i = 0; i < products.length; i++) {
          let item = {
            "id": Number(products[i].dataset.id),
            "quantity" : 1,
            "properties": {

            }
          }
          for (const [key, value] of Object.entries(this.context.context)) {
              if(value){
                let skey = "_Mount_Builder_" + key
                item["properties"][skey] = value
              }
          }
          items.push(item);
      }
      let data = { items,
                    sections: ['minicart-items', 'cart-toggle-with-item-count']
                  };
      fetch('/cart/add.js', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
      })
      .then((response) => response.json())
      .then((parsedState) => {
            this.minicart?.refresh(parsedState);
      })
      .catch((error) => {
          console.error('Error:', error);
      });
    }
  }

  buildDropDown(data){
    fetch(`${window.routes.root_url}?section_id=api-mb-dd`)
      .then((response) => response.text())
      .then((text) => {
        const listHTML = new DOMParser().parseFromString(text, 'text/html').querySelector('[data-api-content]').innerHTML;

        this.container.innerHTML = "";
        this.container.innerHTML = listHTML;
        this.container.querySelector('[data-heading]').innerText = data.header_question;
        const listContainer = this.container.querySelector('#dd-list');
        const ddContainer = this.container.querySelector('#dd-selectors');
        
        const dropDownNode = this.container.querySelector('[data-type]').cloneNode(true);
        const multiDownNode = this.container.querySelector('[data-selector]').cloneNode(true);
        ddContainer.innerHTML = "";
        listContainer.innerHTML = "";
        let index = 0 ;
        for (const key in data.dropdowns[0]) {
          const item = data.dropdowns[0][key];
          const itemNode = dropDownNode.cloneNode(true);
          const multiNode = multiDownNode.cloneNode(true);
          itemNode.dataset.type = key;
          multiNode.dataset.selector = key;
          const placeholder = document.createElement("option");
          placeholder.text = this.context.text[index];
          placeholder.value = "";
          itemNode.add(placeholder);

          if(Array.isArray(item)){
            item.map((op) => {
              const option = document.createElement("option");
              option.text = op;
              option.value = op;
              itemNode.add(option);

            })
            
          }else{
            multiNode.setAttribute("data-disabled", true);

          }
          itemNode.addEventListener('change', (e) => {
            this.nextStep(e.currentTarget);
          });
        
          listContainer.append(itemNode)
          ddContainer.append(multiNode)
          if(Array.isArray(item)){
            let customClass = 'select-' + Math.floor(Math.random() * 10000);
            itemNode.classList.add(customClass)
          

          }
          index++;
        }
        
      })
      .catch((e) => {
        console.error(e);
      });
  }
  buildImageList(data){
      fetch(`${window.routes.root_url}?section_id=api-mb-image-list`)
        .then((response) => response.text())
        .then((text) => {
          const listHTML = new DOMParser().parseFromString(text, 'text/html').querySelector('[data-api-content]').innerHTML;
          this.container.innerHTML = "";
          this.container.innerHTML = listHTML;
          this.container.querySelector('[data-heading]').innerText = data.header_question;
          let listContainer = this.container.querySelector('#image-list');
          let imageNode = this.container.querySelector('[data-type]').cloneNode(true);
          listContainer.innerHTML = "";
          for (const key in data.image_list) {
            let item = data.image_list[key];
            let itemNode = imageNode.cloneNode(true);;
            itemNode.querySelector('[data-title]').innerText = item.text;
            itemNode.querySelector('[data-img]').src = item.url;
            itemNode.dataset.type = key;
            itemNode.addEventListener('click', (e) => {
              this.nextStep(e.currentTarget);
            });
            listContainer.append(itemNode)
            
          }

        })
        .catch((e) => {
          console.error(e);
        });
  }
  close() {

  }

  handleBodyClick(e) {

  }
}

customElements.define('mount-builder', MountBuilder);



class DDSelector extends HTMLElement {
      constructor() {
      super();
            this.input = this.querySelector('[data-input]');
            this.value = this.querySelector('[data-value]');
            this.list = this.querySelector('[data-list]');
            this.search = this.querySelector('[data-search]');
      }
    connectedCallback() {
            this.input.addEventListener('input', this.debounce((event) => {
               this.onChange(event);
           }, 500).bind(this));
            this.value.addEventListener('click', (e) => {
                  if(this.search.style.height == '0px' ){
                    this.open();
                  }else{
                    this.close();
                  }
                 
            });
            
            this.search.style.height = '0px';
            const listOptions =  document.querySelector(`[data-type='${this.dataset.selector}']`);
            listOptions.options.forEach((el, index) => {
              if(index == 0){
                this.value.innerHTML = el.text
              }
            })

      }
    close(){
      this.clear();
      this.search.style.transition = 'height .5s';
      this.search.style.height = `0px`;
      this.search.classList.add('border-0');
    }
    open(){
      //CLose all 
    
      if(this.dataset.disabled != 'true'){
        document.querySelectorAll('[data-search]').forEach((el, index) => {
          el.style.transition = 'height .5s';
          el.style.height = `0px`;
        });
        this.createList();
        this.search.style.transition = 'height .5s';
        this.search.style.height = `${this.search.scrollHeight}px`;
        this.search.classList.remove('border-0');
      }
    
    }
    createList(){
      this.list.innerHTML = "";
      const listOptions =  document.querySelector(`[data-type='${this.dataset.selector}']`);
      let listItems = ""
      listOptions.options.forEach((el, index) => {
        if(index == 0){
          this.value.innerHTML = el.text
        }else{
          listItems += `<li class="text-left  p-2 cursor-pointer hover:bg-[#eee]">${el.text}</li>`
        }
       
      })
      this.list.innerHTML = listItems
      this.list.querySelectorAll('li').forEach(el => {
        el.addEventListener('click', (e) => {
          this.value.innerHTML = el.textContent
          document.querySelector(`[data-type='${this.dataset.selector}']`).value = el.textContent
          if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            document.querySelector(`[data-type='${this.dataset.selector}']`).dispatchEvent(evt);
        }
          this.close()
       });
    })
    }
    onChange() {
        const searchTerm = this.input.value.trim();
        if (!searchTerm.length) {
            this.clear();
            return;
        }else{
          this.getSearchResults(searchTerm);
        }
    }
    clear(){
      let listItems = this.list.querySelectorAll('li');
      listItems.forEach(el => {
        el.classList.remove('hidden')
      })
    }
    onSelect(){

    }

    getSearchResults(searchTerm){
      let listItems = this.list.querySelectorAll('li');
      listItems.forEach(el => {
        if(el.textContent.toLowerCase().includes(searchTerm.toLowerCase())){
          el.classList.remove('hidden');
        }else{
          el.classList.add('hidden');
        }
      })
    }

    debounce(fn, wait) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        };
    }
}
customElements.define('dd-selector', DDSelector);
