/* Module - Book a Hotel - Starts */
Shangrila.calendars = {

  init: function() {
    this.root = Shangrila;
    this.calendarInit();
  },

  calendarInit: function(){
    this.checkIncheckOut();
    //this.dateOfBirth();
    this.specialOffersSelection();
    this.addArrowsCalendar();
  },

  checkIncheckOut: function(){
    var checkIn = $('.checkInSelector'),
        checkOut = $('.checkOutSelector'),
        calendarOptions,
        flag = false;

        // Not to add in server : This is used for local purpose only
        var wa = wa || {};
        wa.Language = "en"; 
        // Not to add in server : This is used for local purpose only 

    if(wa.Language == "en"){
      calendarOptions = {
        minDate: new Date(),
        dateFormat: 'dd-mm-yy',
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

        beforeShowDay: function (date) {
          var sdate = $('#checkInSelector').datepicker("getDate");
          var edate = $('#checkOutSelector').datepicker("getDate");

          if (date >= sdate && date <= edate) {
            if(date.toString() == sdate.toString()) {
              return [true, 'start-date', ''];
            }
            else if(date.toString() == edate.toString() && !$('.ui-textinput.icon-calendar.disable').length) {
              return [true, 'end-date', ''];
            }
            else if(!$('.ui-textinput.icon-calendar.disable').length) {
              return [true, 'ui-state-highlight', ''];
            }          
          }
          return [true, '', ''];

        },          
        beforeShow: function (input, inst, td) {
          Shangrila.calendars.addArrowsCalendar();
        },
        onChangeMonthYear: function(){
          Shangrila.calendars.addArrowsCalendar();
        },
        onSelect: function(selected){
            var $this = $(this);
            var sdate = $('#checkInSelector').datepicker("getDate");
            var edate = $('#checkOutSelector').datepicker("getDate");
            var flag=false;

            if (this.id == 'checkInSelector') {
             $('#checkOutSelector').datepicker('option', 'minDate',new Date(sdate) );
                $('.ui-textinput.icon-calendar').removeClass('disable');
                if (sdate >= edate) {
                  sdate = new Date(sdate);
                  sdate.setDate(sdate.getDate()+1);   
                  $('#checkOutSelector').datepicker('setDate',sdate );
                 }
              }
              if (this.id == 'checkOutSelector') {
                if (edate <= sdate) {
                  //$('#checkInSelector').click();
                  edate = new Date(edate);
                  edate.setDate(edate.getDate()-1);              
                  $('#checkInSelector').datepicker("setDate", edate);
                  setTimeout(function(){
                    flag=true;
                    $('#checkInSelector').datepicker('show');
                  },10);
                }
              }
            },         
      };
    } else {
      calendarOptions = {
        minDate: new Date(),
        dateFormat: 'dd-mm-yy',
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        dayNamesMin: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],


        beforeShowDay: function (date) {
          var sdate = $('#checkInSelector').datepicker("getDate");
          var edate = $('#checkOutSelector').datepicker("getDate");

          if (date >= sdate && date <= edate) {
            if(date.toString() == sdate.toString()) {
              return [true, 'start-date', ''];
            }
            else if(date.toString() == edate.toString() && !$('.ui-textinput.icon-calendar.disable').length) {
              return [true, 'end-date', ''];
            }
            else if(!$('.ui-textinput.icon-calendar.disable').length) {
              return [true, 'ui-state-highlight', ''];
            }          
          }
          return [true, '', ''];

        },          
        beforeShow: function (input, inst, td) {
          Shangrila.calendars.addArrowsCalendar();
        },
        onChangeMonthYear: function(){
          Shangrila.calendars.addArrowsCalendar();
        },
        onSelect: function(selected){
            var $this = $(this);
            var sdate = $('#checkInSelector').datepicker("getDate");
            var edate = $('#checkOutSelector').datepicker("getDate");
            var flag=false;

            if (this.id == 'checkInSelector') {
             $('#checkOutSelector').datepicker('option', 'minDate',new Date(sdate) );
                $('.ui-textinput.icon-calendar').removeClass('disable');
                if (sdate >= edate) {
                  sdate = new Date(sdate);
                  sdate.setDate(sdate.getDate()+1);   
                  $('#checkOutSelector').datepicker('setDate',sdate );
                 }
              }
              if (this.id == 'checkOutSelector') {
                if (edate <= sdate) {
                  //$('#checkInSelector').click();
                  edate = new Date(edate);
                  edate.setDate(edate.getDate()-1);              
                  $('#checkInSelector').datepicker("setDate", edate);
                  setTimeout(function(){
                    flag=true;
                    $('#checkInSelector').datepicker('show');
                  },10);
                }
              }
            },

      };
    }

    checkIn.datepicker(calendarOptions);
    checkIn.datepicker('setDate', new Date());
    checkOut.datepicker(calendarOptions);
    checkOut.datepicker('setDate', 1);
  },

  addArrowsCalendar: function(){
    var $root = this.root;

    setTimeout(function(){
      var $prevControl = $(".ui-datepicker-prev"),
          $nextControl = $(".ui-datepicker-next");
      $prevControl.addClass('icon-angle-left');
      $nextControl.addClass('icon-angle-right');
    }, 200);

  },

  specialOffersSelection: function(){
    var $root = this.root;

    var offerCalendar = $('.offers-calendars'),
        serviceData = offerCalendar.attr('data-available-days');
    if($('.offers-calendars').length > 0 && serviceData !== undefined){
      //var jsonObj = JSON.parse(serviceData);
    //$.getJSON(serviceUrl, function(data) {
      //var offerDates = data.OfferDateRange;
      var jsonObj = serviceData.split(','),
          specialOffersOptions;


        // Not to add in server : This is used for local purpose only
        var wa = wa || {};
        wa.Language = "en"; 
        // Not to add in server : This is used for local purpose only 
        
      if(wa.Language == "en"){
          specialOffersOptions = {
            minDate: new Date(),
            dateFormat: 'dd-mm-yy',
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            beforeShowDay: function(d) {
              //console.log("offerDates: "+ offerDates, 'd: '+ d);
              var dmy = d.getDate();

              //console.log(typeof d.getDate());

              if(d.getDate()<10) {
                dmy = "0"+dmy;
                //console.log(typeof dmy);
                //console.log('dmy : ' + dmy);
              }

              //console.log(typeof d.getMonth())

              if((d.getMonth()+1)<=9) {
                dmy = dmy+"-0";
              }
              else {
                dmy = dmy + '-';
              }

              

              dmy = dmy + (d.getMonth()+1);
              dmy = dmy + "-" + d.getFullYear();

              //console.log('jsonObj' + jsonObj);

              if ($.inArray(dmy, jsonObj) != -1) {
                return [true, "offer-dates","Offers Available"];
              } else{
                return [true,"",""];
              }

            },

            beforeShow: function(){
              Shangrila.calendars.addArrowsCalendar();
            },

            onChangeMonthYear: function(){
              //this.beforeShowDay();
             Shangrila.calendars.addArrowsCalendar();
            },

            onSelect: function(curDate, instance){
              Shangrila.calendars.addArrowsCalendar();
              //SET calendar selected date
              $('.offers-calendars').trigger("dateSelected", [curDate]);

              if($root.screenWidth < Shangrila.small) {
                offerCalendar.hide();
                $('.calendar-toggle').removeClass('active');
              } else {
                offerCalendar.show();
              }
              //Use below code to GET calendar selected date in other JS file
              // $('.offers-calendars').on("dateSelected", function(event, selectedDateVar){
              //   console.log(selectedDateVar);
              // });
              //calendar GET date code end here

              //$('.special-offers .offer-block').hide();
              //$(".special-offers").find(".offer-block[offer-date='" + curDate + "']").show();
            }
          };      
      } else {
          specialOffersOptions = {
            minDate: new Date(),
            dateFormat: 'dd-mm-yy',
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            dayNamesMin: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            beforeShowDay: function(d) {
              //console.log("offerDates: "+ offerDates, 'd: '+ d);
              var dmy = d.getDate();

              //console.log(typeof d.getDate());

              if(d.getDate()<10) {
                dmy = "0"+dmy;
                //console.log(typeof dmy);
                //console.log('dmy : ' + dmy);
              }

              //console.log(typeof d.getMonth())

              if((d.getMonth()+1)<=9) {
                dmy = dmy+"-0";
              }
              else {
                dmy = dmy + '-';
              }

              

              dmy = dmy + (d.getMonth()+1);
              dmy = dmy + "-" + d.getFullYear();

              //console.log('jsonObj' + jsonObj);

              if ($.inArray(dmy, jsonObj) != -1) {
                return [true, "offer-dates","Offers Available"];
              } else{
                return [true,"",""];
              }

            },

            beforeShow: function(){
              Shangrila.calendars.addArrowsCalendar();
            },

            onChangeMonthYear: function(){
              //this.beforeShowDay();
             Shangrila.calendars.addArrowsCalendar();
            },

            onSelect: function(curDate, instance){
              Shangrila.calendars.addArrowsCalendar();
              //SET calendar selected date
              $('.offers-calendars').trigger("dateSelected", [curDate]);
 
              if($root.screenWidth < Shangrila.small) {
                offerCalendar.hide();
                $('.calendar-toggle').removeClass('active');
              } else {
                offerCalendar.show();
              }
              //Use below code to GET calendar selected date in other JS file
              // $('.offers-calendars').on("dateSelected", function(event, selectedDateVar){
              //   console.log(selectedDateVar);
              // });
              //calendar GET date code end here

              //$('.special-offers .offer-block').hide();
              //$(".special-offers").find(".offer-block[offer-date='" + curDate + "']").show();
            }
          };         
      }

      if(offerCalendar.data('calendar-initiated')) {
        //offerCalendar.datepicker('destroy');        
      }

      offerCalendar.datepicker(specialOffersOptions);
      offerCalendar.data('calendar-initiated', true);
      

      Shangrila.calendars.addArrowsCalendar();

      $('.calendar-toggle').on('click', function(){
        var filterBlock = $(this).parent().find('.form-container ul');

        if($root.screenWidth < Shangrila.small) {
          if(offerCalendar.css('display') == 'block'){
            $(this).removeClass('active');           
            setTimeout(function(){offerCalendar.slideUp();}, 300);
          } else {
            $(this).addClass('active');
            setTimeout(function(){offerCalendar.slideDown();}, 300);

            if(filterBlock.css('display') == 'block'){
              $('.filter-btn').text('Filter').removeClass('icon-android-closeafter');
              filterBlock.hide();
            }
          }
        } else {
          offerCalendar.show();
        }
      });
      if($root.screenWidth < Shangrila.small) {
        offerCalendar.hide();
      } else {
        offerCalendar.show();
      }
    }


    //});
  },

  viewportChange: function(){
    var $root = this.root;
    var offerCalendar = $('.offers-calendars');

    if($root.screenWidth < Shangrila.small) {
      offerCalendar.hide();
      $('.calendar-toggle').removeClass('active');
    } else {
      offerCalendar.show();
    }
  }

};

Shangrila.modules.push('calendars');

/* Module - Book a Hotel - Ends */
