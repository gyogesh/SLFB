/* Module - Restuarant and Bars Map - Starts */
Shangrila.restaurantBarMap = {

  init: function(){
    this.root = Shangrila;
    //this.setMapContainer();
    this.setMap();
  },

  triggerUnveil: function() {
    $('.detail-container').on('scroll resize', function(){
      $(window).trigger("lookup");
    });
  },

  setMapContainer: function() {
    var $root = this.root;
    var mapViewContainer = $('.map-view-container'),
        mapWrapper = $('.map-wrapper'),
        title = mapViewContainer.find('.title'),
        detailContainer = mapViewContainer.find('.detail-container');

    if($root.screenWidth < $root.small) {
      mapViewContainer.css('height', $root.screenHeight);
      mapWrapper.css('height', ($root.screenHeight*3/5 - title.height()));
      detailContainer.css('height', $root.screenHeight*2/5);
    }
    else {
      mapViewContainer.removeAttr('style');
      mapWrapper.removeAttr('style');
      detailContainer.removeAttr('style');
    }

  },

  setMap: function(jsonurl){
    var thisModule = this;

    this.bounds = new google.maps.LatLngBounds();

    if(!this.map) {

      this.markerList = [];
      this.infoWindowList = [];

      var mapOptions = {
        scrollwheel: false,
        zoom: 10,
        center: {lat: 0, lng: 0},
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false
      };

      var map = new google.maps.Map(document.getElementById('rb-map'), mapOptions);
      this.map = map;
    }
    else {
      this.destroyMarkers();
    }

    this.getData(jsonurl);
    this.triggerUnveil();
    this.getTilesOffset();
  },

  // Need to pass web service url containing data as per filters
  getData: function(jsonurl) {
    var thisModule = this;

    $.ajax({
      url: jsonurl ? jsonurl : $('#rb-map').attr('data-service'),
      type: 'GET',
      dataType: 'json'
    })
    .done( function (data) {

      var totalVenueCount = 0;
      // loop through data
      $(data).each( function(i, v) {

        var hotelDetails = data[i];

        thisModule.markerCenter = {
          lat: data[0].lat,
          lng: data[0].lng
        };

        thisModule.plotMarkers(hotelDetails);
        totalVenueCount += parseFloat(hotelDetails.venueCount);
      });

      thisModule.fitBounds();
      thisModule.map.setZoom(thisModule.map.getZoom()-1);

      $('.map-view-container .title .count').text(" (" + totalVenueCount + ")");

      thisModule.onScroll();
    })
    .fail( function() {

    });
  },

  setCenter: function(latlng) {
    this.map.setCenter(latlng);
  },

  fitBounds: function(){

    for(var i=0; i< this.markerList.length; i++) {
      this.bounds.extend(this.markerList[i].getPosition());
    }

    this.map.fitBounds(this.bounds);
    //this.map.panToBounds(this.bounds);
    this.map.setZoom(this.map.getZoom()-1);
    //this.setCenter(this.markerCenter);
  },

  plotMarkers: function(hotelDetails){
    var hotelId = hotelDetails.id,
        hotelName = hotelDetails.name,
        lat = hotelDetails.lat,
        lng = hotelDetails.lng,
        venueCount = hotelDetails.venueCount;

    var latlng = new google.maps.LatLng(lat, lng);

    var image = {
      url: '/content/img/icon/png/map-marker.png',
      scaledSize: new google.maps.Size(30, 45),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(15, 47)
    };

    var marker = new MarkerWithLabel({
      position: latlng,
      title: hotelName,
      icon: image,
      labelContent: venueCount.toString(),
      labelClass: 'markerLabels'
    });

    this.setLabelAnchor(marker);
    this.setMarkerCursor(marker);

    marker.hotelId = hotelId;
    marker.lat = lat;
    marker.lng = lng;

    marker.setMap(this.map);

    this.markerList.push(marker);
    this.populateLinks(marker, hotelDetails);
  },

  setMarkerCursor : function(marker) {

    if(Shangrila.screenWidth < Shangrila.small) {
      marker.setOptions({cursor:'default'});
      google.maps.event.addListener(marker, "mouseover", function (e) {
        marker.setOptions({labelStyle: {cursor:'default'}});
      });
    }
    else {
      marker.setOptions({cursor:'pointer'});
      google.maps.event.addListener(marker, "mouseover", function (e) {
        marker.setOptions({labelStyle: {cursor:'pointer'}});
      });
    }
  },

  setLabelAnchor: function(marker) {

    var pointX,
        pointY;

    if(marker.labelClass.indexOf('active') > -1) {
      pointX = 20;
      pointY = 55;
    }
    else {
      pointX = 15;
      pointY = 40;
    }

    marker.setOptions({labelAnchor: new google.maps.Point(pointX, pointY)});

  },

  populateLinks: function(marker, hotelDetails){
    var thisModule = this,
        contentString = this.generateFlyout(marker, hotelDetails);

    var infoWindow = new InfoBubble({
          minWidth:'100%',
          maxWidth:'100%',
          minHeight: '100%',
          maxHeight: '100%',
          content : contentString,
          padding: 0,
          borderRadius: 0,
          arrowSize: 0,
          borderWidth: 0,
          disableAutoPan: false,
          closeSrc:'/content/img/icon/png/flyout-close.png'
        });

    infoWindow.marker = marker;
    marker.infoWindow = infoWindow;

    this.infoWindowList.push(infoWindow);

    marker.addListener('click', function() {

      if(Shangrila.screenWidth >= Shangrila.small) {
        for(var i=0; i<thisModule.infoWindowList.length; i++){
          if(thisModule.infoWindowList[i] != this.infoWindow){
            thisModule.infoWindowList[i].close();
            thisModule.setMarkerSize(thisModule.infoWindowList[i].marker, 30, 45);

            thisModule.infoWindowList[i].marker.setOptions({
              labelClass:'markerLabels'
            });
          }
          else {
            this.infoWindow.open(thisModule.map, this);
            thisModule.setMarkerSize(this, 40, 62);

            this.setOptions({
              labelClass:'markerLabels active'
            });
          }

          thisModule.setLabelAnchor(thisModule.infoWindowList[i].marker);
        }
      }
    });

    infoWindow.addListener('closeclick', function(){
      thisModule.setMarkerSize(this.marker, 30, 45);
      this.marker.setOptions({
        labelClass:'markerLabels'
      });
      thisModule.setLabelAnchor(this.marker);
    });

  },

  setMarkerSize: function(element, markerSizeX, markerSizeY) {
    element.setIcon({
      url: '/content/img/icon/png/map-marker.png',
      scaledSize: new google.maps.Size(markerSizeX, markerSizeY)
    });
  },

  generateFlyout: function(marker, hotelDetails) {

    var flyoutTemplate = _.template(
      [
      '<div class="flyout">',
        '<div class="flyout-title">',
          '<@= hotelDetails.name @> (',
          '<@= hotelDetails.venueCount @>)',
        '</div>',
        '<div class="flyout-links-wrapper">',
          '<@ _.each(venues, function(venue, index, venues) { @>',
            '<a class="flyout-links" href="javascript:void(0);" onclick="javascript:Shangrila.restaurantBarMap.onClick(this);" data-venue-id="<@= venue.id @>"><@= venue.name @></a>',
          '<@ }); @>',
        '</div>',
      '</div>'
    ].join(''),
    Shangrila.underscoreSettings
    );

    var contentString = flyoutTemplate({
      hotelDetails: hotelDetails,
      venues: hotelDetails.venues
    });

    return contentString;
  },

  onClick: function(flyoutLink){

    var _this = $(flyoutLink),
        venueId = _this.attr('data-venue-id'),
        parentWrapper = $('.detail-container .restaurant-bar-container[data-venue-id="' + venueId + '"]').parent(),
        offsetTop = parentWrapper[0].offsetTop;

    $('.detail-container').animate({
      scrollTop: offsetTop
    }, 100);
  },

  getTilesOffset: function() {
    this.allTilesOffset = [];

    var thisModule = this;

    $('.detail-container .restaurant-bar-container').each(function(i, v){
      var $this = $(this),
          offset = $this.parent()[0].offsetTop;

      thisModule.allTilesOffset.push([$this, offset]);
    });
  },

  onScroll: function(){

    var thisModule = this;

    var visibleTile = function(scrollPosition, allTilesOffset){
      allTilesOffset = allTilesOffset.reverse();

      var closeElementPos = allTilesOffset[0][1],
          closeElement = allTilesOffset[0][0];

      for(var i = 1; i < allTilesOffset.length; i++){

        if(Math.abs(scrollPosition - allTilesOffset[i][1]) < Math.abs(scrollPosition - closeElementPos)){
          closeElementPos = allTilesOffset[i][1];
          closeElement = allTilesOffset[i][0];
        }
      }

      return closeElement;
    };

    $('.detail-container').on('scroll', Shangrila.debouncer(function(e) {

      if($('.detail-container').length > 0 && Shangrila.screenWidth >= Shangrila.small){
        var closeElement = visibleTile($(this).scrollTop(), thisModule.allTilesOffset);
        var marker;

        for(var i=0; i< thisModule.markerList.length; i++) {

          if(thisModule.markerList[i].hotelId == closeElement.attr('data-hotel-id')){
            marker = thisModule.markerList[i];
            thisModule.setCenter({lat: marker.lat, lng: marker.lng});
          }
          else {
            thisModule.setMarkerSize(thisModule.markerList[i], 30, 45);

            thisModule.markerList[i].infoWindow.close();

            thisModule.markerList[i].setOptions({
              labelClass: 'markerLabels'
            });

            thisModule.setLabelAnchor(thisModule.markerList[i]);
          }
        }
      }
    }));
  },

  resetAllMarkers: function() {
    for(var i = 0; i < this.markerList.length; i++) {
      this.setMarkerSize(this.markerList[i], 30, 45);
      this.markerList[i].setOptions({
        labelClass:'markerLabels'
      });
      this.setLabelAnchor(this.markerList[i]);
      this.setMarkerCursor(this.markerList[i]);
    }
  },

  closeAllInfoWindows: function(){
    for(var i = 0; i < this.infoWindowList.length; i++) {
      this.infoWindowList[i].close();
    }
  },

  destroyMarkers: function() {
    var markerList = this.markerList;

    if(markerList.length > 0) {
      for(var i=0; i< markerList.length; i++) {
        markerList[i].infoWindow.setMap(null);
        markerList[i].setMap(null);
      }
    }
    this.markerList.length = 0;
  },

  viewportChange: function() {
    var thisModule = this;

    //this.setMapContainer();
    this.getTilesOffset();
    this.resetAllMarkers();
    this.closeAllInfoWindows();

    google.maps.event.trigger(this.map, "resize");

    this.fitBounds();
    this.map.setZoom(this.map.getZoom()-1);
  }
};

/* orientation change or resize events */
if(window.orientationchange) {
  if($('#rb-map').length > 0) {
    if(window.attachEvent) {
      window.attachEvent("orientationchange", Shangrila.restaurantBarMap.viewportChange, false);
    }
    else{
        window.addEventListener("orientationchange", Shangrila.restaurantBarMap.viewportChange, false);
    }
  }
}
else {
  $(window).on("resize", Shangrila.debouncer(function(e) {

    if($('#rb-map').length > 0) {
      Shangrila.restaurantBarMap.viewportChange();
    }
    Shangrila.screenWidth = $(window).width();
    Shangrila.screenHeight = $(window).height();
  }));
}

//Shangrila.modules.push('restaurantBarMap');
/* Module - Restuarant and Bars Map Footer - Starts */
