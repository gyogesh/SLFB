/* Module - R&B Filters - Starts */
Shangrila.multiCheckboxFilters = {

  init: function() {
    this.root = Shangrila;  // root object with namespace Shangrila    
    this.bindEvents();
  },

  bindEvents: function() {
    this.toggleDropdown();
    this.toggleFilter();
    this.filterExperienceMonths();
    this.clearFilters();
  },

  clearFilters: function() {
    var clearAnchor = $('.filter-container .filter-clear-all'),
        checkboxOptions = clearAnchor.parents('.filter-container').find('.multiselect-dropdown li input[type="checkbox"]');

    clearAnchor.on('click', function(e) {
      checkboxOptions.each(function(i, v) {
        if( $(this).is(':checked')) {
          $(this).prop('checked', false);
        }
      });
    });
  },

  toggleDropdown: function() {

    var $root = this.root;
    
    var selectEle = $('.filter-container .field-container'),
        selectDrops = $('.filter-container .multiselect-dropdown'),
        checkEle = $('.filter-field ul > li .multiselect-dropdown input[type="checkbox"]');
    
    selectEle.on('click', function(event) {

      Shangrila.hideElement();

      var $thisEle = $(this),
          $dropPanel = $thisEle.parent().find('.multiselect-dropdown');

      if($dropPanel.css('display') == 'none') {
        selectDrops.hide();
        selectEle.find('.ui-select').removeClass('active');

        $dropPanel.slideDown();
        $thisEle.find('.ui-select').addClass('active');
      }
      else {
        $dropPanel.slideUp();
        $thisEle.find('.ui-select').removeClass('active');
      }

      event.stopPropagation();

      var fn = function() {
        selectEle.find('.ui-select').removeClass('active');

      };

      Shangrila.setEscapeElement($dropPanel);
      Shangrila.setEscapeCallback(fn);
    });

  },

  toggleFilter: function() {

    var filterBtn = $('.filter-btn'),        
        filterContainer = $('.form-container > ul'),
        filterStr,
        closeStr;

        // Not to add in server : This is used for local purpose only
        var wa = wa || {};
        wa.Language = "en"; 
        // Not to add in server : This is used for local purpose only 

        if(wa.Language == "en"){
          filterStr = 'Filter';
          closeStr = 'Close';
        } else {
          filterStr = '筛选';
          closeStr = '关闭';
        }

    filterBtn.on('click', function(e) {
      e.preventDefault();

      var calendarBlock = $(this).parents('.offer-landing').find('.offers-calendars');
      
      if(Shangrila.screenWidth < Shangrila.small) {

        if( filterContainer.css('display') == 'block') {
          filterContainer.slideUp();
          $(this).text(filterStr).removeClass('icon-android-closeafter');
        }
        else {
          $(this).text(closeStr).addClass('icon-android-closeafter');

          filterContainer.slideDown();
          
          if(calendarBlock.css('display') == 'block') {
            calendarBlock.hide();
            $(this).parents('.filter-container').find('.calendar-toggle').removeClass('active');
          }
        }
      }
    });

  },

  resetFilters: function() {
    if( Shangrila.screenWidth >= Shangrila.small ){
        
        // Not to add in server : This is used for local purpose only
        var wa = wa || {};
        wa.Language = "en"; 
        // Not to add in server : This is used for local purpose only      

        if(wa.Language == "en"){
          filterStr = 'Filter';
        } else {
          filterStr = '筛选';
        }
      //alert(filterStr);
      $('.filter-btn').text(filterStr).removeClass('icon-android-closeafter');      
      $('.form-container > ul').removeAttr('style');
    }
  },

  filterExperienceMonths: function() {
    var monthFilter = $('#filter-experience-months');

    if( monthFilter.length > 0) {

      var dateObj = new Date();

      var d = dateObj.getDate(),
          m = dateObj.getMonth(),
          y = dateObj.getFullYear();

      console.log(d,m,y);

      var monthArray = [
                        'january',
                        'february',
                        'march',
                        'april',
                        'may',
                        'june',
                        'july',
                        'august',
                        'sepetember',
                        'october',
                        'november',
                        'december'
                        ];

      var nMonths = monthFilter.attr('data-filter-months') ? monthFilter.attr('data-filter-months') : 5;

      var monthList = [];

      for( var i = 0; i < nMonths; i++ ) {
        if( m <= monthArray.length - 1 ){
          m = m;
        }
        else {
          m = 0;
        }
        monthList.push(monthArray[m]);
        m++;
      }

      // render list of months in dropdown
      (function() {

        var monthFilterTemplate =
          _.template([
              '<li>',
                '<label>',
                  '<input type="checkbox" value="<@= month @>")>',
                  '<span class="icon-uncheck">',
                    '<@= month @>',
                  '<span>',
                '</label>',
              '</li>'
            ].join(''),
            Shangrila.underscoreSettings
          );

        var content = '';

        _.each(monthList, function(month, index, monthList) {
          content += monthFilterTemplate({
            month : month
          });
        });


        monthFilter.html(content);
      })();
    }
  },
  
  viewportChange: function() {
    this.resetFilters();
  }
};

Shangrila.modules.push('multiCheckboxFilters');

/* Module - R&B Filters - Ends */