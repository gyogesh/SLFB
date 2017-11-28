/* Module - Restaurant Bar Detail - Starts */
Shangrila.restaurantDetail = { 

  init: function() {
    this.root = Shangrila;  // root object with namespace Shangrila
    this.bindEvents();
  },

  bindEvents: function(){
    this.accordionHandler();
    this.stickyNavigation();
    this.scrollToSection();
    this.highlightMenuLinks();
    this.triggerUnveil();
    this.hideShowOfferTiles();
  },
  accordionHandler: function() {
    // reference to root namespace Shangrila
    var $root = this.root;
    var thisModule = this;

    $('.restaurant-details .accordion-container .accordion-header').on('click', function() {
      var _this = $(this),
      allPanels = $('.restaurant-details .panel-container'),
      allElements = $('.restaurant-details .accordion-header'),
      currentParent = _this.parents('.accordion-container'),
      currentPanel = currentParent.find('.panel-container');

      var callback = function() {
        // $root.scrollToElement(_this,1000);
        var $thisContainer = _this.parent().next(),
            photoGal = $thisContainer.find('.image-gallery'),
            videoGal = $thisContainer.find('.video-gallery'),
            sliderContent = $thisContainer.find('.content-slider');

        photoGal.each(function(){
          if(typeof $(this).data('owlCarousel') != 'undefined') {
            $(this).trigger('destroy.owl.carousel');
            $(this).removeClass('owl-loaded owl-carousel');
            $(this).find('.owl-stage-outer').children().unwrap();
            $(this).owlCarousel($root.photoGallery.carouselOptions);
          }
        });

        videoGal.each(function(){
          if(typeof $(this).data('owlCarousel') != 'undefined') {
            $(this).trigger('destroy.owl.carousel');
            $(this).removeClass('owl-loaded owl-carousel');
            $(this).find('.owl-stage-outer').children().unwrap();
            $(this).owlCarousel($root.photoGallery.carouselOptions);

            $(this).on('changed.owl.carousel', function(property){
              var current = property.item.index;
              var src = $(property.target).find(".owl-item").eq(current).find("video");
              if (!$('html').hasClass("ie8")) {
                if(src.length > 0) {
                  $("video").each(function () { this.pause(); });
                  $(property.target).find(".owl-item").eq(current).find("video")[0].play();
                }
              }
            });
          }
        });

        sliderContent.each(function(){
          if(typeof $(this).data('owlCarousel') != 'undefined') {
            $(this).trigger('destroy.owl.carousel');
            $(this).removeClass('owl-loaded owl-carousel');
            $(this).find('.owl-stage-outer').children().unwrap();
            $(this).owlCarousel($root.carousels.contentCarouselOptions);

          }
        });
        thisModule.adjustHeight(); // added this code for adjusting height of the containers
        if($('.slider-content-pod .owl-carousel').length > 0) {
          if(Shangrila.screenWidth < Shangrila.extraSmall){
            $('.slider-content-pod .item .caption-block.eqHeight').css({
              'height': 'auto', 'padding-bottom' : '100px'
            });
          }
          $('.slider-content-pod .item .caption-block .aligned-content').heightAdjust();
        }
      };

      if($root.screenWidth < $root.small){
        $root.accordionHandler(_this, allElements, currentPanel, allPanels, callback);
      }
    });
  },

  hideShowOfferTiles: function() {
    var venueSpecialOffers = $('.venue-special-offers .tabs-content');
    venueSpecialOffers.each(function() {
      venueSpecialOffers.find(".col-xs-12:gt(1)").hide();
    });

    $('.venue-special-offers .view-all-btn a').on('click', function(e) {
      e.preventDefault();
      venueSpecialOffers.find(".col-xs-12").show();
      $('.lazy-load').unveil(200);
      viewAllTiles.hide();
    });

  },

  resetAccordion: function() {
    // reference to root namespace Shangrila
    var $root = this.root;

    var allPanels = $('.restaurant-details .panel-container'),
        allElements = $('.restaurant-details .accordion-header');

    if($root.screenWidth < $root.small) {
      //allPanels.hide();
    }
    else{
      allPanels.show();
    }

    allElements.removeClass('active');
  },
  adjustHeight: function() {
    // reference to root namespace Shangrila
    var $root = this.root;
    if($('.slider-content-pod').length > 0) {
      if(Shangrila.screenWidth < Shangrila.extraSmall){
        $('.slider-content-pod .item .eqHeight').css({
          height: 'auto'
        });
      }   else {
        $('.slider-content-pod .item .eqHeight').heightAdjust();
      }
    }
  },


  stickyNavigation: function(){
    if(Shangrila.screenWidth > Shangrila.small){
      $('.sticky-menu').each(function(){
        var topPos = $('header').height(),
            bottomPos = $('footer').height();
        $(this).sticky({
          topSpacing: topPos + 30,
          bottomSpacing: bottomPos + 30
        });
      });
    }

    // Hide menu if menu list is 1.
    if($('ul.scroll-nav li').length <= 1){
      $('ul.scroll-nav').hide();
    }
  },

  scrollToSection: function() {
    if($('ul.scroll-nav').length > 0) {
      var menuLinks = $('ul.scroll-nav li'),
          scrollSections = $('.right-column > section');

      menuLinks.on('click', function(e) {

        e.stopPropagation();

        var $this = $(this),
            element = scrollSections.eq($(this).index());
            
        Shangrila.scrollToPosition(element.offset().top - 110);
 
        var fn = function() {
          menuLinks.removeClass('active');
          $this.addClass('active');  
        };
        setTimeout(fn, 300);
      });
    }
  },

  triggerUnveil: function() {
    $('.venue-special-offers').on('click', '.tabs li a', function(){
      $(window).trigger("lookup");
    });
  },

  highlightMenuLinks: function() {
    var thisModule = this;

    var visibleTile = function(scrollPosition, allTilesOffset){
      allTilesOffset = allTilesOffset.reverse();

      var closeElementPos = allTilesOffset[0][1],
          closeElement = allTilesOffset[0][0];

      for(var i = 1; i < allTilesOffset.length; i++){

        if(Math.abs(scrollPosition - allTilesOffset[i][1]) < Math.abs(scrollPosition - closeElementPos)){
          closeElementPos = allTilesOffset[i][1];
          closeElement = allTilesOffset[i][0];
        }
      }

      return closeElement;  
      
    };

    if($('ul.scroll-nav').length > 0) {

      $(window).on('scroll resize', Shangrila.debouncer(function(e) {

        thisModule.getSectionOffset();

        var closeElement = visibleTile($(this).scrollTop(), thisModule.sectionOffsetList);
        var idx = closeElement.index();

        $('ul.scroll-nav li').removeClass('active');
        $('ul.scroll-nav li').eq(idx).addClass('active');
      }));
    }
  },

  getSectionOffset: function() {
    var thisModule = this;

    var sectionList = $('.restaurant-details').find('.right-column > section');
    this.sectionOffsetList = [];

    sectionList.each(function(i, v) {
      var offsetTop = $(this).offset().top + $('header').height();
      thisModule.sectionOffsetList.push([$(this), offsetTop]);
    });
  },

/*
  resetViewport: function() {
    Shangrila.scrollToTop();
  },*/

  viewportChange: function() {
    this.resetAccordion();
    this.adjustHeight();
    this.stickyNavigation();
    //this.resetViewport();
   // this.scrollNavigation();
  }
};

Shangrila.modules.push('restaurantDetail');

/* Module - Restaurant Bar Detail - Ends */
