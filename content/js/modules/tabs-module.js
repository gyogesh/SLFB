/* Module - Tabsmodule - Starts */
Shangrila.tabsmodule = {
  init: function() {
    this.initTabs();
  },
  initTabs: function(){
    $(".tabs-section").each(function() {
      var $tablinks = $(this).find('ul.tabs > li'),
          $tabContainer = $(this).find('.tabs-content');         

      $tablinks.on('click', function(){
        $tablinks.removeClass('active');
        $(this).addClass('active');
        $tabContainer.removeClass('visibility-visible').addClass('visibility-hidden');        
        var thisIndex = $(this).index();        
        $tabContainer.eq(thisIndex).removeClass('visibility-hidden').addClass('visibility-visible');
      });
      $tablinks.eq(0).trigger('click');      
    });    
  }
};

Shangrila.modules.push('tabsmodule');

/* Module - Tabsmodule - Ends */