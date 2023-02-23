class Equalizer extends HTMLElement {

   constructor() {
     super();
     this.mobileWidth = 750; // Remove Equalizer
     //this._init();
   }

   connectedCallback() {
     this.$watched = this.querySelectorAll(`[data-equalizer-watch]`);
     this.addEventListener('resizeme.trigger', (event) => {
           this._onResizeMe()
     });
     let scope = this;
     window.addEventListener("resize", function() {
       scope.dispatchEvent(new CustomEvent('resizeme.trigger'));
     });


     this.isOn = false;

     this.tooSmall;
     this._checkSize();
     this._events();
   }

  _init() {

  }

  /**
   * Removes event listeners if the breakpoint is too small.
   * @private
   */
  _pauseEvents() {
    this.isOn = false;
    // this.off({
    //   '.zf.equalizer': this._bindHandler.onPostEqualizedBound,
    //   'resizeme.zf.trigger': this._bindHandler.onResizeMeBound,
	  // 'mutateme.zf.trigger': this._bindHandler.onResizeMeBound
    // });
  }
  _checkSize(){
    if(this.mobileWidth >= window.innerWidth){
        this.tooSmall = true;
    }else{
        this.tooSmall = false;
    }

  }

  /**
   * function to handle $elements resizeme.zf.trigger, with bound this on _bindHandler.onResizeMeBound
   * @private
   */
  _onResizeMe() {
    this._checkSize();
    this._reflow();
  }

  /**
   * function to handle $elements postequalized.zf.equalizer, with bound this on _bindHandler.onPostEqualizedBound
   * @private
   */
  _onPostEqualized(e) {
    if(e.target !== this.$element[0]){ this._reflow(); }
  }

  /**
   * Initializes events for Equalizer.
   * @private
   */
  _events() {
    //this._pauseEvents();
    this.isOn = true;
    this._reflow();
  }

  /**
   * Checks the current breakpoint to the minimum required size.
   * @private
   */
  _checkMQ() {
    var tooSmall = !MediaQuery.is(this.options.equalizeOn);
    if(tooSmall){
      if(this.isOn){
        this._pauseEvents();
        this.$watched.css('height', 'auto');
      }
    }else{
      if(!this.isOn){
        this._events();
      }
    }
    return tooSmall;
  }


  _killswitch() {
    return;
  }


  _reflow() {
    this.getHeights(this.applyHeight.bind(this));
  }


  /**
   * Finds the outer heights of children contained within an Equalizer parent and returns them in an array
   * @param {Function} cb - A non-optional callback to return the heights array to.
   * @returns {Array} heights - An array of heights of children within Equalizer container
   */
  getHeights(cb) {
    var heights = [];
    for(var i = 0, len = this.$watched.length; i < len; i++){
      this.$watched[i].style.height = 'auto';
      heights.push(this.$watched[i].offsetHeight);
    }
    cb(heights);
  }

  applyHeight(heights) {
    if(this.tooSmall != true){
      var max = Math.max.apply(null, heights);
      this.$watched.forEach((item) => {
        item.style.height = max + 'px';
      })
    }
  }



  /**
   * Destroys an instance of Equalizer.
   * @function
   */
  _destroy() {
    this._pauseEvents();
    this.$watched.css('height', 'auto');
  }
}

/**
 * Default settings
 */
Equalizer.defaults = {
  /**
   * Enable height equalization when stacked on smaller screens.
   * @option
   * @type {boolean}
   * @default false
   */
  equalizeOnStack: false,
  /**
   * Enable height equalization row by row.
   * @option
   * @type {boolean}
   * @default false
   */
  equalizeByRow: false,
  /**
   * String representing the minimum breakpoint size the plugin should equalize heights on.
   * @option
   * @type {string}
   * @default ''
   */
  equalizeOn: ''
};

customElements.define('custom-equalizer', Equalizer);
