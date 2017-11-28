/* Module - Static Map - Starts */

Shangrila.staticMap = {

  init: function() {
    this.generateMapImage();
    this.bindEvents();
  },

  generateMapImage: function() {
    var thisModule = this;

    $('*[data-type="static-map"] img').each(function(i, v) {
      var $this = $(this),
          lat = parseFloat($this.attr('data-latitude')),
          lng = parseFloat($this.attr('data-longitude')),
		  mapurl = $this.attr('data-mapurl');

      var isStatic = Shangrila.serverEnvironment.static;
      var iconurl = 'http://' + window.location.host + '/content/img/icon/png/static-map-marker.png';
      if(isStatic){
        iconurl = 'http://stg01.vizualize.com/Shangri-La/static-map-marker.png';
      }

      mapurl = mapurl + iconurl + '|' + lat + ',' + lng;

      $this.attr('src', mapurl);
    });
  },

  bindEvents: function() {
    var thisModule = this;

    $('*[data-type="static-map"]').on('click', function(e) {
      $this = $(this);
      thisModule.generateMap($this);
    });
  },

  generateMap: function($this) {

    var thisModule = this;

    if(!$this.data('googleMapParams')) {

      var mapContainer = document.createElement('div'),
          mapImage = $this.find('> img'),
          latPosition = parseFloat(mapImage.attr('data-latitude')),
          lngPosition = parseFloat(mapImage.attr('data-longitude'));

      var mapOptions = {
          scrollwheel: false,
          zoom: 15,
          center: {lat: latPosition, lng: lngPosition},
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

      var googleMap = new google.maps.Map(mapContainer, mapOptions);

      $this.data('googleMapParams',{
        'googleMap' : googleMap,
        'container' : mapContainer,
        'markerPosition' : {lat: latPosition, lng: lngPosition}
      });

      this.plotMarkers(googleMap, latPosition, lngPosition);
    }

    this.currentMapSource = $this;
    this.mapEnlarged = false;
    thisModule.show($this.data('googleMapParams'));
  },

  plotMarkers: function(map, lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);

    var image = {
      url: '/content/img/icon/png/static-map-marker.png',
    };

    var marker = new google.maps.Marker({
      position: latlng,
      icon: image
    });

    marker.setMap(map);
  },

  show: function(mapParams) {
    var $root = Shangrila,
        thisModule = this;

    this.setMapContainer(mapParams);

    $root.commonPopup.append(mapParams.container).addClass('zoomed map-static');

    $root.commonPopup.show(400, function(){
      google.maps.event.trigger(mapParams.googleMap, "resize");
      mapParams.googleMap.setCenter(mapParams.markerPosition);
      thisModule.mapEnlarged = true;
    });
    $('body').addClass('hang');

    $root.commonOverlay.addClass('stackup');
    $root.overlayShow();
    $root.scrollToTop();

    var callback = function() {
      thisModule.mapEnlarged = false;
    };

    $root.closeButtonHandler(callback);
  },

  setMapContainer: function(mapParams){
    mapParams.container.style.width = "100%";
    mapParams.container.style.height = Shangrila.screenHeight - 95 + "px";
    mapParams.container.style.maxHeight = Shangrila.screenHeight + "px";
  },

  viewportChange: function() {
    var thisModule = this;

    if(thisModule.mapEnlarged) {
      var mapParams = thisModule.currentMapSource.data('googleMapParams');
      thisModule.setMapContainer(mapParams);
      google.maps.event.trigger(mapParams.googleMap, "resize");
      mapParams.googleMap.setCenter(mapParams.markerPosition);
    }
  }
};

Shangrila.modules.push('staticMap');
/* Module - Static Map - Ends */
