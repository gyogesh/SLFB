/* Module - Restaurant and Bar List - Starts */
Shangrila.restaurantBarList = {

  init: function() {
    this.root = Shangrila;  // root object with namespace Shangrila
    this.adjustHeight();
    this.toggleGridMapView();
   // this.paginationScrollTop();
  },

  adjustHeight: function(){

    if($('.restaurant-bar-list, .restaurant-bar-grid').length > 0) {
      $('.restaurant-bar-list, .restaurant-bar-grid').each(function(){
        var thisContainer = $(this).find('.restaurant-bar-container');
        if(Shangrila.screenWidth < Shangrila.extraSmall){
          thisContainer.css({
            height: 'auto'
          });
        } else {
          thisContainer.heightAdjust();
        }
      });
    }

    /* Mood for sections code - starts */
    if($('.mood-for').length > 0) {
      $('.mood-for').each(function(){
        var thisContainer = $(this).find('.mood-for-option-container');
        if(Shangrila.screenWidth < Shangrila.extraSmall){
          thisContainer.css({
            height: 'auto'
          });
        } else {
          thisContainer.heightAdjust();
        }
      });
    }
    /* Mood for sections code - ends */
  },

  // Function to scroll top for Pagination
  /*paginationScrollTop: function() {
    var $root = this.root;
    var pagination = $('.pagination');
    pagination.each(function(){
      var paginationAnchor = $('.pagination ul li a');
      paginationAnchor.on('click', function(e){
        $root.scrollToTop();
      });
    });
  },*/

  toggleGridMapView: function() {

    var thisModule = this;

    var rbList = $('.restaurant-bar-list'),
        gridCta = rbList.find('.filter-grid-view'),
        mapCta = rbList.find('.filter-map-view'),
        grid = rbList.find('.restaurant-bar-grid'),
        map = rbList.find('.restaurant-bar-map'),
        destinationCities = $('.destination-overlay ul[data-ref], .destination-overlay .accordion-header a');

    gridCta.removeClass('active');
    mapCta.removeClass('active');
    gridCta.addClass('active');
    //map.hide();
    //grid.show();
    if(map.css('display') !== 'block') {
        map.hide();
    }
    if(grid.css('display') !== 'none') {
        grid.show();
    }

    gridCta.on('click', function(e) {
      $(this).addClass('active');
      mapCta.removeClass('active');
      grid.show();
      map.hide();
      thisModule.adjustHeight();
    });

    mapCta.on('click', function(e) {
      $(this).addClass('active');
      gridCta.removeClass('active');

      if(!map.is(":visible")){
        var scrollTopDetail = $('.detail-container .container h3').offset().top - 400;
        $('.detail-container').animate({
          scrollTop: scrollTopDetail
        });
      }

      map.show(200, function(){
        $(window).trigger("lookup");
        if(Shangrila.restaurantBarMap.map) {
          Shangrila.restaurantBarMap.viewportChange();
        }
        else {
          Shangrila.restaurantBarMap.setMap();
        }
      }); 
        

      grid.hide();
    });

    destinationCities.on('click', function() {
    var rbList = $('.restaurant-bar-list'),
        gridCta = rbList.find('.filter-grid-view'),
        mapCta = rbList.find('.filter-map-view');
        
        gridCta.addClass('active');
        mapCta.removeClass('active');
        grid.show();
        map.hide();
        thisModule.adjustHeight();
    });

  },

  viewportChange: function() {
    this.adjustHeight();
  }

};

Shangrila.modules.push('restaurantBarList');

/* Module - Restaurant and Bar List - Ends */
