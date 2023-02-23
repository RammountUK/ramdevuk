/** VERSION: 1.0.0 Please do not delete this line. Thank you! **/
// Override Settings
var boostPFSInstantSearchConfig = {
	search: {
		//suggestionMode: 'test',
		//suggestionPosition: 'left'
	}
};

(function() {
	BoostPFS.inject(this);

	// Customize style of Suggestion box
	SearchInput.prototype.customizeInstantSearch = function() {
		var suggestionElement = this.$uiMenuElement;
		var searchElement = this.$element;
		var searchBoxId = this.id;
	};

  // Bind Event for input search Mobile
  var bindEventsMobile = InstantSearchMobile.prototype.bindEvents;
  InstantSearchMobile.prototype.bindEvents = function() {
    bindEventsMobile.call(this);

    var self = this;
    var searchButtonMobile = '.site-nav--mobile .search-button, .js-search-destop';
    var searchInputMobile = '.search-input-group input[type="search"], .wg-search-form .search-input';
    var searchCloseButtonMobile = '.drawer__close > button, .drawer_back a';
    jQ(searchButtonMobile).off('click').click(function(e) {
      e.preventDefault();
      //e.stopPropagation();
      jQ(searchInputMobile).focus();
      self.openSuggestionMobile();
      jQ(searchCloseButtonMobile).trigger('click');

    });
  }
  
  // Bind Event for input search style 3
  var bindEvents = InstantSearchStyle3.prototype.bindEvents;
  InstantSearchStyle3.prototype.bindEvents = function() {
    bindEvents.call(this);

    var self = this;
    var searchButtonDesktop = '.site-header__links .search-button';
    var searchInputDesktop = '#SearchContainer #search-input';
    var searchCloseButtonDesktop = '.drawer__close > button';
    jQ(searchButtonDesktop).off('click').click(function(e) {
      e.preventDefault();
      //e.stopPropagation();
      jQ(searchInputDesktop).focus();
      self.openSuggestionStyle3();
      jQ(searchCloseButtonDesktop).trigger('click');

    });
  }

  // Fix search for the Flow theme
  jQ('.site-header__links .search-button').on('click', function() {
    setTimeout(function() {
      boostPFS.initSearchBox();
      if(Utils.isCollectionPage()) jQ('.search-input-group > .boost-pfs-search-box').val('');
    }, 500);
  });

  InstantSearchResultItemProduct.prototype.compileSuggestionProductPrice = function() {
		// If the multi-currency feature is enabled, update the product price
		this.prepareSuggestionProductPriceData();
    if (!this.data.price_min) {
      return '';
    }
		// Check on sale
		var onSale = this.data.compare_at_price_min > this.data.price_min;
		// Format price
		var price = Utils.formatMoney(this.data.price_min);
		var compareAtPrice = '';
		if (this.data && this.data.compare_at_price_min) {
			compareAtPrice = Utils.formatMoney(this.data.compare_at_price_min);
			if (Settings.getSettingValue('search.removePriceDecimal')) {
				price = Utils.removeDecimal(price);
				compareAtPrice = Utils.removeDecimal(compareAtPrice);
			}
		}
		
		// Build Price
		var result = '';
		if (Settings.getSettingValue('search.showSuggestionProductPrice')) {
			if (onSale && Settings.getSettingValue('search.showSuggestionProductSalePrice')) {
				result = this.getTemplate(InstantSearchResultItemProduct.tempType.PRICE_SALE);
			} else {
				result = this.getTemplate(InstantSearchResultItemProduct.tempType.PRICE);
			}
		}
        result = this.data.price_min !== 0 ? result : '';
		return result
			.replace(/{{regularPrice}}/g, price)
			.replace(/{{compareAtPrice}}/g, compareAtPrice);
	}

  InstantSearchApi.beforeCall = function(searchTerm) {
  Globals.instantSearchQueryParams.q = Utils.encodeURIParamValue(unescape(searchTerm || '').replace(/&#x27;/g, '').replace(/&#x26;/g, '').replace(/&#x2A;/gi, ''));
  if (!Globals.instantSearchQueryParams.q) Globals.instantSearchQueryParams.q = searchTerm // avoid breaking the search
}

var searchSubmit = SearchInput.prototype._onSubmit;
  
SearchInput.prototype._onSubmit = function(event, redirect) {
  searchSubmit.call(this, event, redirect);
  
  var term = unescape(Globals.currentTerm || '').replace(/&#x27;/g, '').replace(/&#x26;/g, '').replace(/&#x2A;/gi, '');
  var isApiReturnedResult = Globals.suggestionCache.hasOwnProperty(term);
  
  var redirectUrl = InstantSearchResultRedirect.getSearchRedirectUrl();
  
  if (isApiReturnedResult) {
    if (redirectUrl && !Utils.isBadUrl(redirectUrl)) {
      Utils.setWindowLocation(redirectUrl);
    } else {
      this.isChangePage = true;
      this.$searchForm[0].submit();
    }
  } 
}

})();