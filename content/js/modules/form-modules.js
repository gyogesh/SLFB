/* Module - Form Modules - Starts */
Shangrila.formModules = {

  init: function() {
    this.root = Shangrila;  // root object with namespace Shangrila
    //this.bindEvents();
  },

  /* function to be called after validation on submit button */
  thankYouJoinCircle: function(){

    // reference to root namespace Shangrila
    var $root = this.root;

    var $thankYouPop = $('.join-golden-circle-pop-up').clone(true, true);
        //containerPop = Shangrila.commonPopup;


    //$('.golden-circle-btn input').on('click', function(){
      $root.commonPopup.append($thankYouPop);
      $thankYouPop.removeClass('hidden');
      $root.commonPopup.addClass('thankYouPopUp');
      $root.overlayShow();
      $root.commonOverlay.addClass('stackup');
      $root.scrollToTop();
      $root.popupShow();
    //});
  }

};

Shangrila.modules.push('formModules');
/* Module - Form Modules - Ends */
