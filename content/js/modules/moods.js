/* Module - Moods - Starts */
Shangrila.moods = {

  init: function() {
    this.root = Shangrila;  // root object with namespace Shangrila    
    this.bindEvents();
    this.filterDropdown();
    this.brightCoveMoodVideo();
    this.moodVideoTracking();
  },

  bindEvents: function() {
    this.masonry();
  },

  masonry: function(){
    var $container = $('.masonry-container');

    $('img').load(function(){
        $container.masonry();
    });

    $container.masonry({
      itemSelector: '.masonry-item',
      columnWidth: '.masonry-item'
    });
  },

  filterDropdown: function(){
    var filterBtn = $('.sort-btn'),        
        filterContainer = $('.filter-mood'),
        sortList = $('.filter-mood li a');

    filterBtn.on('click', function(e){
      e.preventDefault();
      if(Shangrila.screenWidth < Shangrila.small){
        if(filterContainer.css('display') == 'block') {
          filterContainer.slideUp();
          $(this).text('Sort').removeClass('icon-android-closeafter');
        } else {
          $(this).text('Close').addClass('icon-android-closeafter');
          filterContainer.slideDown();
        }
      }
    });

    sortList.on('click', function(e) {
      e.preventDefault();
      if(Shangrila.screenWidth < Shangrila.extraSmall){
        if(filterContainer.css('display') == 'block') {
          filterContainer.slideUp();
          filterBtn.text('Sort').removeClass('icon-android-closeafter');
        } else {
          filterBtn.text('Close').removeClass('icon-android-closeafter');
          filterContainer.slideDown();
        }
      }
    });
  },

  brightCoveMoodVideo: function() {
    var moodVideoSection = $('.section-header-mood .brightcove-video, .merchandising-block .brightcove-video'),
        moodVideoBlock = '',
        moodVideoAccount = moodVideoSection.attr('data-account'),
        moodVideoId = moodVideoSection.attr('data-video-id');

    moodVideoSection.each(function() {
    if(/MSIE\s/.test(navigator.userAgent) && (parseFloat(navigator.appVersion.split("MSIE")[1]) == 9) || (parseFloat(navigator.appVersion.split("MSIE")[1]) == 8)) {
        moodVideoBlock = '<object id="myExperience4898708312001" class="BrightcoveExperience"><param name="bgcolor" value="#FFFFFF" /><param name="autoStart" value="true" /><param name="width" value="970" /><param name="height" value="545" /><param name="wmode" value="opaque" /><param name="playerID" value="'+ moodVideoAccount +'" /><param name="playerKey" value="AQ~~,AAAEJG_cIJk~,bKaLNtGwt6whTkW5k0GLaYxrj9NcuDXM" /><param name="isVid" value="true" /><param name="isUI" value="true" /><param name="dynamicStreaming" value="true" /><param name="includeAPI" value="true" /><param name="templateLoadHandler" value="Shangrila.moodsBrightCove.videoLoaded" /><param name="templateReadyHandler" value="Shangrila.moodsBrightCove.videoReady1" /><param name="@videoPlayer" value="'+ moodVideoId +'" /></object>';
      } else {
        moodVideoBlock = '<div><video id="myVideo13" data-account='+ moodVideoAccount +' data-player="B1vQhARi" data-embed="default" data-video-id='+ moodVideoId +' data-application-id class="video-js vjs-controls-disabled BrightcoveExperience" controls="false" autoplay loop muted></video></div><script src="//players.brightcove.net/4554542031001/B1vQhARi_default/index.min.js"></script>';
      }
    moodVideoSection.append(moodVideoBlock);
    });

  },

  moodVideoTracking: function() {
    $(document).on('mousedown', '.candid-next, .candid-prev', function(){
      var candidCaption = $('.candid-caption').clone().find('span').remove().end().text();
      //console.log(candidCaption);
      wa.CarouselTitle = candidCaption;
      //console.log(wa.CarouselTitle);
    });
  },

  resetFilters: function(){
    if(Shangrila.screenWidth >= Shangrila.extraSmall){
      $('.sort-btn').text('Sort').removeClass('icon-android-closeafter');      
      $('.filter-mood').removeAttr('style');
    }
  },
  viewportChange: function() {
    this.resetFilters();
  }
};

Shangrila.modules.push('moods');

/* Module - Moods - Ends */