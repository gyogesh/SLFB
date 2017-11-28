/* Module - Read More - Starts */
Shangrila.readMore = {
  init: function() {
    this.readMore();
  },
  readMore: function(){
    
    $('.introductory .read-more').on('click', function(){
      var parent = $(this).parents('.introductory');
      parent.find('.introductory-text').hide();
      parent.find('.introductory-fulltext').show();
    });
    $('.introductory .read-less').on('click', function(){
      var parent = $(this).parents('.introductory');
      parent.find('.introductory-fulltext').hide();
      parent.find('.introductory-text').show();
    });
  }
};

Shangrila.modules.push('readMore');

/* Module - Read More - Ends */