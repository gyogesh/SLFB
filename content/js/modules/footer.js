/* Module - Footer - Starts */
Shangrila.footer = {

  init: function() {
    this.root = Shangrila;  // root object with namespace Shangrila
    this.bindEvents();
  },

  bindEvents: function(){
    var $root = this.root;

    this.accordionHandler();    
    $root.placeholderHandler();   // Placeholder function to fix IE8 and IE9
    this.socialShare();
  },

  accordionHandler: function() {
    // reference to root namespace Shangrila
    var $root = this.root;

    $('.accordion-header').on('click', function() {
      var _this = $(this),
          allPanels = $('.sitelinks > li > ul'),
          allElements = $('.sitelinks > li .accordion-header'),
          currentParent = _this.parent('li'),
          currentPanel = currentParent.find(' > ul');

      var callback = function() {
        $root.scrollToElement(_this);
      };

      if( $root.screenWidth < $root.small ){
        $root.accordionHandler(_this, allElements, currentPanel, allPanels, callback);
      }
    });
  },

  socialShare: function() {
    var $root = this.root,
        thisModule = this,
        $socialShare = $('.social-share a[href^="http"]');

        $socialShare.popupWindow({ 
          centerScreen:1 
        });       

  },

  resetAccordion: function() {
    // reference to root namespace Shangrila
    var $root = this.root;
    
    var allPanels = $('.sitelinks > li > ul'),
        allElements = $('.sitelinks > li .accordion-header');

    if($root.screenWidth < $root.small) {
      //allPanels.hide();
    }
    else {
      allPanels.show();
      allElements.removeClass('active');
    }
  },

  viewportChange: function() {
    this.resetAccordion();
  }

};

Shangrila.modules.push('footer');

/* Module - Footer - Ends */