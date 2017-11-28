/* Module - Restuarant and Bars Map - Starts */
Shangrila.maps = {

  init: function(){

    this.root = Shangrila;


    if($('#rb-map').length > 0) {
      $.when(
        $.getScript( "/content/js/markerwithlabel.js" ),
        $.getScript( "/content/js/infobubble-min.js" ),
        $.Deferred(function( deferred ){
          $( deferred.resolve );
        })
      ).done(function(){
        Shangrila.restaurantBarMap.init();
      });
    }
/*
    $.getScript("./js/markerwithlabel.js", function() {
        
    });*/

  },

  // viewportChange: function() {
  //   if($('#rb-map').length > 0) {
  //     Shangrila.restaurantBarMap.viewportChange();
  //   }
  // }
};

//Shangrila.modules.push('maps');
/* Module - Restuarant and Bars Map Footer - Starts */