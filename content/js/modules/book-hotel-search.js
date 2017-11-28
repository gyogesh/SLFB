/* book hotel search - starts */
Shangrila.bookHotelSearch = {

  init: function() {
    this.root = Shangrila;
    this.bindEvents();
  },

  bindEvents: function() {
    this.populateHotels();
    this.searchBookHotel();
  },

  populateHotels: function() {
    var thisModule = this,
        searchInput = $('#book-hotel-search');

    if(searchInput.length > 0) {
      var jsonurl = searchInput.attr('data-service');

      // ajax to populate data
      $.ajax({
        url: jsonurl,
        type: 'GET',
        dataType: 'json'
      })
      .done( function (data) {
        thisModule.searchResult = data;
        thisModule.bindAutocomplete();
      })
      .always( function() {
        return false;
      });
    }
    this.searchInput = searchInput;
  },

  bindAutocomplete: function() {
    var thisModule = this;

    thisModule.searchInput.autocomplete({
      source: thisModule.searchResult,
      minLength: 0,
      select: function (e, i) {
                thisModule.searchInput.val(i.item.label);// label
                $('#hdnHid').val(i.item.value.split('|')[0]);
                wa.HotelCode = i.item.value.split('|')[0];
                wa.HotelBrand = i.item.value.split('|')[1];
          return false;
      }

    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {

      return $( "<li>" )
              .attr('data-hotel-code', item.value.split('|')[0])
              .attr('data-hotel-name', item.label)
              .append( "<a href='javascript:void(0);'>" + item.label + "</a>")
              .appendTo( ul );
    };
  },

  searchBookHotel: function() {

      $("#selLang").on("change", function () {

          $(this).parents("form").submit();
      });


      $('#btnAddRoom').click(function () {
          return false;
      });

      //Disable checkout
      $('.checkOutSelector').parents('.ui-textinput.icon-calendar').addClass('disable');

      $('#btnBookNow').click(function () {
        
          $('#divError').removeClass('error');

          var dataUrl = $(this).data('url');
          var dataFbcode = $(this).data('fbcode');

          var checkinDate = $(".bookHotelCheckIn").val();
          checkinDate = checkinDate.split('-');
          checkinDate = checkinDate[2] + checkinDate[1] + checkinDate[0];
          waCheckinDate = checkinDate;

          var checkoutDate = $(".bookHotelCheckOut").val();
          checkoutDate = checkoutDate.split('-');
          checkoutDate = checkoutDate[2] + checkoutDate[1] + checkoutDate[0];

          var adults = $(".numAdult");
          var children = $(".numChildren");
          var num_rac = '1000000000';
          var numOfRooms = $('.room-block').length;
          var charPlacer = 0;
          var HotelId = '';

          if ($('#hdnHid').val() === '') {
              HotelId = '';
          }
          else {
              HotelId = $('#hdnHid').val();
          }
          console.log(HotelId);
          if (HotelId !== '') {

              for (var i = 0; i < numOfRooms; i++) {

                  num_rac = replaceAt(num_rac, charPlacer, $(adults).eq(i).val());
                  num_rac = replaceAt(num_rac, charPlacer + 1, $(children).eq(i).val());
                  charPlacer = charPlacer + 2;

              }
              //num_rac ready

              //num_rac = replaceAt(num_rac, 1, changeNum_Rac(num_rac.charAt(0), num_rac.charAt(1)));
              //num_rac = replaceAt(num_rac, 3, changeNum_Rac(num_rac.charAt(2), num_rac.charAt(3)));
              //num_rac = replaceAt(num_rac, 5, changeNum_Rac(num_rac.charAt(4), num_rac.charAt(5)));
              //num_rac = replaceAt(num_rac, 7, changeNum_Rac(num_rac.charAt(6), num_rac.charAt(7)));
              //num_rac = replaceAt(num_rac, 9, changeNum_Rac(num_rac.charAt(8), num_rac.charAt(9)));

              //var BookRoomUrl = 'http://www.shangri-la.com/landing/reservations/?hid=@hid&amp;check_in=@checkin&amp;check_out=@checkout&amp;lang=@lang&amp;num_rac=@num_rac';
              var BookRoomUrl = dataUrl;
              BookRoomUrl = BookRoomUrl.replace("amp;", "");
              BookRoomUrl = BookRoomUrl.replace("$hid", HotelId);//replace with hotel id
              BookRoomUrl = BookRoomUrl.replace("$checkin", checkinDate);
              BookRoomUrl = BookRoomUrl.replace("$checkout", checkoutDate);
              BookRoomUrl = BookRoomUrl.replace("$lang", 'en');
              BookRoomUrl = BookRoomUrl.replace("$num_rac", num_rac);
              //BookRoomUrl = BookRoomUrl.replace("@WT.mc_id", "SLS_201603_GLOBAL_WEBSITE_DLP_BUTTON_STAY-CONNECTED_STAYCONNECTED_EN"); // Pending

              //var analyticsCode = 'WT.mc_id=FBCODE';
              var analyticsCode = dataFbcode;
              if(analyticsCode!==null)
              {
                  if (analyticsCode !== "")
                  {
                      BookRoomUrl = BookRoomUrl + "&" + analyticsCode;
                  }
              }

              BookRoomUrl = BookRoomUrl.replace(/amp;/g, "");
              console.log(BookRoomUrl);

              window.open(BookRoomUrl, '_blank');
          }
          else {
              $('#divError').addClass('error');
          }

          wa.HotelCode = $('#hdnHid').val();
          console.log("waHotelCode:" + wa.HotelCode);
          wa.TotalRooms = $('.room-block').length;
          console.log("TotalRooms:" + wa.TotalRooms);
          wa.CheckIndate = $(".bookHotelCheckIn").val();
          console.log("waCheckinDate:" + wa.CheckIndate);
          wa.CheckOutDate = $(".bookHotelCheckOut").val();
          console.log("waCheckoutDate:" + wa.CheckOutDate);
        
          wa.TotalAdultQty = parseInt(num_rac.charAt(0)) + parseInt(num_rac.charAt(2)) + parseInt(num_rac.charAt(4)) + parseInt(num_rac.charAt(6)) + parseInt(num_rac.charAt(8));
          console.log("waTotalAdultQty:" + wa.TotalAdultQty);

          wa.TotalChildrenQty = parseInt(num_rac.charAt(1)) + parseInt(num_rac.charAt(3)) + parseInt(num_rac.charAt(5)) + parseInt(num_rac.charAt(7)) + parseInt(num_rac.charAt(9));
          console.log("TotalChildrenQty:" + wa.TotalChildrenQty);

          wa.Room1AdultQty = num_rac.charAt(0);
          console.log("wa.Room1AdultQty:" + wa.Room1AdultQty);
          wa.Room1ChildrenQty = num_rac.charAt(1);
          console.log("wa.Room1ChildrenQty:" + wa.Room1ChildrenQty);
          wa.Room2AdultQty = num_rac.charAt(2);
          console.log("wa.Room2AdultQty:" + wa.Room2AdultQty);
          wa.Room2ChildrenQty = num_rac.charAt(3);
          console.log("wa.Room2ChildrenQty:" + wa.Room2ChildrenQty);
          wa.Room3AdultQty = num_rac.charAt(4);
          console.log("wa.Room3AdultQty:" + wa.Room3AdultQty);
          wa.Room3ChildrenQty = num_rac.charAt(5);
          console.log("wa.Room3ChildrenQty:" + wa.Room3ChildrenQty);
          wa.Room4AdultQty = num_rac.charAt(6);
          console.log("wa.Room4AdultQty:" + wa.Room4AdultQty);
          wa.Room4ChildrenQty = num_rac.charAt(7);
          console.log("wa.Room4ChildrenQty:" + wa.Room4ChildrenQty);
          wa.Room5AdultQty = num_rac.charAt(8);
          console.log("wa.Room5AdultQty:" + wa.Room5AdultQty);
          wa.Room5ChildrenQty = num_rac.charAt(9);
          console.log("wa.Room5ChildrenQty:" + wa.Room5ChildrenQty);
          _satellite.track('booknow');


      });

      function changeNum_Rac(a, c) {
          if (a == 3 && c == 2) {
              return '0';
          }
          else if (a == 2 && c == 2) {
              return '1';
          }
          else
          {
              return c;
          }
      }

      //replace nth char of s with t
      function replaceAt(s, n, t) {
          return s.substring(0, n) + t + s.substring(n + 1);
      }
  }
};

Shangrila.modules.push('bookHotelSearch');
/* book hotel search - ends */