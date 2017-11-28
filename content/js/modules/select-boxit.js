/* Common widget select box - selectBoxIt - starts */
Shangrila.selectBoxit = {
  
  init: function() {
    if($('html').hasClass('no-touch')){
      this.initializeSelectBox();
      this.setSelectWidth();
    }
  },

  initializeSelectBox: function() {
    // initiate custom select box
    var opts = {
      showEffect: 'slideDown',
      hideEffect:'slideUp',
      aggresiveChange:'true',
      theme:'bootstrap'
    };
    
    var selectBox = $('select').selectBoxIt().data('selectBoxIt');
  },

  viewportChange: function() {
    this.setSelectWidth();
  },

  setSelectWidth: function() {
    // calculate and set width for custom select from respective select box
    $('.ui-select-wrapper').each(function(e){
      var _this = $(this),
        wdth = _this.width(),
        dropArrowWidth = 35,
        selectBoxItContainer = _this.find('.selectboxit-container .selectboxit'),
        selectBoxItOptions = _this.find('.selectboxit-options'),
        optionsPaddingLeft = parseInt(selectBoxItOptions.css('paddingLeft')),
        optionsPaddingRight = parseInt(selectBoxItOptions.css('paddingRight')),
        optionsWidth = wdth - optionsPaddingLeft - optionsPaddingRight;
        //containerWidth = wdth - dropArrowWidth;

      selectBoxItOptions.width(optionsWidth);
      selectBoxItOptions.css('min-width', optionsWidth);

      selectBoxItContainer.width(wdth+1);
      selectBoxItContainer.css('min-width', wdth+1);
      //_this.find('.selectboxit.btn').addClass('icon-angle-down');
      _this.find('.selectboxit-btn').addClass('icon-angle-down');
    });
  }

};

Shangrila.modules.push('selectBoxit');
/* Common widget select box - selectBoxIt - starts */