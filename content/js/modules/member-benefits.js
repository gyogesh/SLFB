 /* Module - Member Benefits - Starts */
Shangrila.memberBenefits = {

  init: function() {
    this.root = Shangrila;  // root object with namespace Shangrila
    this.bindEvents();
  },

  bindEvents: function(){
    this.adjustHeight();
    this.accordionHandler();
    this.scrollToSection();
  },

  adjustHeight: function() {

    if($('.member-benefits-benefit').length > 0) {
      $('.member-benefits-benefit').each(function(){
        var thisContainer = $(this).find('.benefit-item');
        if(Shangrila.screenWidth < Shangrila.extraSmall){
          thisContainer.css({
            height: 'auto'
          });
        } else {
          thisContainer.heightAdjust();
        }
     });
    }

    if($('.member-benefits-gc-member-tier').length > 0) {
      $('.member-benefits-gc-member-tier').each(function(){
        var thisContainer = $(this).find('.benefit-tier');
        if(Shangrila.screenWidth < Shangrila.extraSmall){
          thisContainer.css({
            height: 'auto'
          });
        } else {
          thisContainer.heightAdjust();
        }
     });
    }

    if($('.member-benefits-point').length > 0) {
      $('.member-benefits-point').each(function(){
        var thisContainer = $(this).find('.point-container');
        if(Shangrila.screenWidth < Shangrila.extraSmall){
          thisContainer.css({
            height: 'auto'
          });
        } else {
          thisContainer.heightAdjust();
        }
     });
    }

    if($('.member-benefits-generic-banner').length > 0) {
      $('.member-benefits-generic-banner').each(function(){
        var thisContainer = $(this).find('.equal-height');
        if(Shangrila.screenWidth < Shangrila.extraSmall){
          thisContainer.css({
            height: 'auto'
          });
        } else {
          thisContainer.heightAdjust();
        }
      });
    }

  },

  accordionHandler: function() {
    // reference to root namespace Shangrila
    var $root = this.root;

    $('.member-benefits-expanded-type .accordion-container .accordion-header').off("click").on('click', function() {
      var _this = $(this),
      allPanels = $('.member-benefits-expanded-type .panel-container'),
      allElements = $('.member-benefits-expanded-type .accordion-header'),
      currentParent = _this.parents('.accordion-container'),
      currentPanel = currentParent.find('.panel-container');
      var callback = function() {
        $root.scrollToElement($('.member-benefits-expanded-type .benefit-title'));
        /*allPanels.hide();
        _this.addClass('active');
        currentPanel.slideDown();*/
      };
      if($root.screenWidth > 0) {
        $root.accordionHandler(_this, allElements, currentPanel, allPanels, callback);
      }
    });
  },

  scrollToSection: function() {
    if($('.member-benefit-intro-links ul').length > 0) {
      var menuLinks = $('.about-gc-link'),
      scrollSections = $('.member-benefits-about-golden-circle');

      menuLinks.on('click', function(e) {
        var $this = $(this),
        element = scrollSections.eq($(this).index());

        Shangrila.scrollToElement(scrollSections);
      });

    }

  },

  viewportChange: function() {
    this.adjustHeight();
  }
};

Shangrila.modules.push('memberBenefits');

/* Module - Member Benefits - Ends */
