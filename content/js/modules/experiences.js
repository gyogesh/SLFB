/* Module - Experiences - Starts */
Shangrila.experiences = {
  
  init: function() {
    this.root = Shangrila;  // root object with namespace Shangrila
    this.adjustHeight();
    this.accordionHandler();
  },

  adjustHeight: function() {
    
    if($('.experience-panel').length > 0) {

      $('.experience-panel').each(function(){
        var thisContainer = $(this).find('.eqHeight');

        if(Shangrila.screenWidth < Shangrila.extraSmall) {
          thisContainer.css({
            height: 'auto'
          });
        } else {
          //thisContainer.heightAdjust();
          thisContainer.css({
            height: '540px'
          });
        }

        if(Shangrila.screenWidth < Shangrila.medium){
          $(this).find('.image-block.eqHeight').css({
            height: 'auto'
          });
          $(this).find('.caption-block.eqHeight').heightAdjust();
        }

        if(Shangrila.screenWidth < Shangrila.extraSmall){
          $(this).find('.eqHeight').css({
            height: 'auto'
          });
        }

      });
    }
  },

  accordionHandler: function() {
    // reference to root namespace Shangrila
    var $root = this.root;
    $('.terms-condition .accordion-header').on('click', function() {      
      var _this = $(this),
          allPanels = $('.terms-condition .panel-container'),
          allElements = $('.terms-condition .accordion-header'),
          currentPanel = _this.next('.panel-container');

      var callback = function() {
        $root.scrollToElement(_this);
      };

      if($root.screenWidth > 0) {
        $root.accordionHandler(_this, allElements, currentPanel, allPanels, callback);  
      }
    });

    if(window.location.hash) {
      var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
      if (hash == 'terms') {
        $('.terms-condition .accordion-header').trigger('click');
      }
    }
  },

  resetAccordion: function() {
    // reference to root namespace Shangrila
    var $root = this.root;

    var allPanels = $('.terms-condition .panel-container'),
        allElements = $('.terms-condition .accordion-header');

    allPanels.hide();    
    allElements.removeClass('active');
  },
  
  viewportChange: function() {
    this.adjustHeight();
    this.resetAccordion();
  }
  
};

Shangrila.modules.push('experiences');

/* Module - Experiences - Ends */