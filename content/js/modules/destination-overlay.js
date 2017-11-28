/* Module - Destination Overlay - Starts */
Shangrila.destinationOverlay = {

  init: function() {
    this.root = Shangrila;  // root object with namespace Shangrila
    this.bindEvents();
  },

  bindEvents: function(){
    this.accordionHandler();
  },

  accordionHandler: function() {
    // reference to root namespace Shangrila
    var $root = this.root;

    $('.destination-overlay .accordion-header').on('click', function() {

      var _this = $(this),
          destinationOverlay = _this.parents('.destination-overlay'),
          dataAnchor = _this.attr('data-anchor'),
          allPanels = destinationOverlay.find('ul[data-ref]'),
          allElements = destinationOverlay.find('h2.accordion-header[data-anchor]'),
          currentPanel = allPanels.filter("[data-ref='" + dataAnchor + "']");

      var callback = function() {
        var a = $('.destination-wrapper').scrollTop(),
            b = _this.offset().top,
            c = $('.destination-overlay .close').outerHeight(true);

        var scrollPosition = a+b-c;

        $('.destination-wrapper').animate({
          scrollTop: scrollPosition
        });

      };

      if($root.screenWidth < $root.extraSmall){
        $root.accordionHandler(_this, allElements, currentPanel, allPanels, callback);
      }
      
    });

    $(".destination-overlay h2 > a, .destination-overlay ul li > a").on('click', function() {
      
      var destinationOverlay = $('.destination-overlay'),
          allPanels = destinationOverlay.find('ul[data-ref]'),
          allElements = destinationOverlay.find('h2.accordion-header[data-anchor]');      
      
        if($root.screenWidth < $root.extraSmall) {
          allPanels.hide();
          allElements.removeClass('active');
        }else
        {
          allPanels.show();
          allElements.removeClass('active');         
        }
    });

  },

  resetAccordion: function() {
    // reference to root namespace Shangrila
    var $root = this.root;

    var destinationOverlay = $('.destination-overlay'),
        allPanels = destinationOverlay.find('ul[data-ref]'),
        allElements = destinationOverlay.find('h2.accordion-header[data-anchor]');

    if($root.screenWidth < $root.extraSmall) {
      allPanels.hide();
    }
    else{
      allPanels.show();
      allElements.removeClass('active');
    }
  },

  viewportChange: function() {
    this.resetAccordion();
  },

};

Shangrila.modules.push('destinationOverlay');

/* Module - Destination Overlay - Ends */