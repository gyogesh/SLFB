/* Module - Special Offers - Starts */
Shangrila.specialOffers = {

  init: function() {
    this.root = Shangrila;  // root object with namespace Shangrila
    
    this.adjustHeight();
  },

  adjustHeight: function(){
    
    if($('.special-offers').length > 0) {
      if(Shangrila.screenWidth < Shangrila.extraSmall){
        $('.special-offers .inner-container .content-container').css({
          height: 'auto'
        });      
      } else {      
        $('.special-offers .inner-container .content-container').heightAdjust();  
      }   
    }
  },

  viewportChange: function() {
    this.adjustHeight();
  }
};

Shangrila.modules.push('specialOffers');

/* Module - Special Offers - Ends */