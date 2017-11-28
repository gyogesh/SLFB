/* Module - Carousel - Starts */
Shangrila.photoGallery = {
  /**Below is the common options for the Photo Gallery you can use it anywhere by using for eg.
    $root.photoGallery.carouselOptions
    you can extend them by using for eg.
    $.extend($root.photoGallery.carouselOptions, zoomOptions) zoomOptions are the  new one added
  **/
  carouselOptions : {
    margin: 10,
    items: 1,
    loop: true,
    navText: false,
    dots: false,
    info: true,
    smartSpeed : 1000,
    nav: false,
   // autoHeight: true,
    responsive: {
      0:{
        stagePadding: 20
      },
      480: {
        stagePadding: 60
      },
      767: {
        stagePadding: 100
      },
      991: {
        margin: 0,
        nav: true
      }
    }
  },

  init: function() {
    this.root = Shangrila;  // root object with namespace Shangrila
    this.bindEvents();
  },
  bindEvents: function(){
    this.zoomGallery();
    this.videoPhotoGallery();
    this.videoLinker();
  },
  videoPhotoGallery: function(){
    var $root = this.root;
    var thisModule = this;
    //Below carousel is for Photogallery section
    $(".photo-gallery").each(function() {
      var $owlContainer = $(this),
          $owlSlides = $(this).children(".item"),
          totalSlides = $owlSlides.length;

      if ($owlSlides.length > 1) {

        $owlContainer.owlCarousel(thisModule.carouselOptions);
        // append text describing slide number
        (function(){
          $owlSlides.each(function(i, v) {
            var $this = $(this),
                $element = '<div class="page-info">' + (i+1) + ' OF ' + totalSlides + '</div>';
            $(this).find('.caption-block').append($element);

          });
        })();

        $owlContainer.on('changed.owl.carousel', function(property){
          var current = property.item.index;
          var src = $(property.target).find(".owl-item").eq(current).find("video");
          if (!$('html').hasClass("ie8")) {
            if(src.length > 0) {
              $("video").each(function () { this.pause(); });
              //$(".owl-item").find("video")[0].pause();
              $(property.target).find(".owl-item").eq(current).find("video")[0].play();
            }
          }
        });
      } else {
        $owlContainer.addClass("no-carousel");
      }
    });
  },
  zoomGallery: function(){
    var $root = this.root;
    var thisModule = this;

    $('.photo-gallery').each(function() { // the containers for all your galleries
      var galClone = $(this).html();
      var zoomLink = $(this).find('.zoom-link');
      zoomLink.each(function(){
        $(this).on('click', function(e){
          e.preventDefault();
          var thisIdx = $(this).parents('.photo-gallery').find(".owl-item.active").index(),
              thisLength = $(this).parents('.photo-gallery').find(".owl-item").length;
          var zoomOptions = {
            startPosition: thisIdx,
            margin: 0,
            nav: true,
            responsive: {
              0:{
                stagePadding: 0,
                nav: false
              },
              992: {
                stagePadding: 0
              }
            }
          };

          var fn = function() {

            $('.zoomed-gallery').append(galClone);
            $root.overlayShow();

            $root.commonOverlay.addClass('stackup');
            $root.scrollToTop();

            $root.commonPopup.find('.owl-carousel').show();

            if(thisLength > 1) {
              $('.zoomed-gallery').owlCarousel($.extend(thisModule.carouselOptions, zoomOptions));
            } else {
              $('.zoomed-gallery').addClass('no-carousel');
            }

          };

          $root.commonPopup.addClass('zoomed');
          $root.commonPopup.append('<div class="owl-carousel zoomed-gallery"></div>');
          $root.popupShow(fn);

        });
      });
    });

    var callback = function() {
      $root.commonPopup.removeClass('zoomed');
    };

    $root.closeButtonHandler(callback);

    $root.commonOverlay.on('click', function(){
      if($(this).hasClass('spinner'))
        return;
      else
        $root.commonPopupClose.trigger('click');
    });
  },

  videoLinker: function(){

    var $root = this.root,
        thisModule = this,
        $videoLink = $('.video-link');

    $videoLink.each(function(){

      $(this).on('click', function(e){

        e.preventDefault();

        var videoUrl = $(this),
        videoBlock = '',
        videoAccount = videoUrl.attr('data-account'),
        videoId = videoUrl.attr('data-video-id');

        if(/MSIE\s/.test(navigator.userAgent) && (parseFloat(navigator.appVersion.split("MSIE")[1]) == 9) || (parseFloat(navigator.appVersion.split("MSIE")[1]) == 8)) {

          videoBlock =  '<div class="brightcove-video"><object id="myExperience4898708312001" class="BrightcoveExperience"><param name="bgcolor" value="#FFFFFF" /><param name="width" value="970" /><param name="height" value="545" /><param name="autoStart" value="true" /><param name="playerID" value="'+ videoAccount +'" /><param name="playerKey" value="AQ~~,AAAEJG_cIJk~,bKaLNtGwt6whTkW5k0GLaYxrj9NcuDXM" /><param name="isVid" value="true" /><param name="isUI" value="true" /><param name="dynamicStreaming" value="true" /><param name="includeAPI" value="true" /><param name="templateLoadHandler" value="Shangrila.brightIe.videoLoaded" /><param name="templateReadyHandler" value="Shangrila.brightIe.videoReady"><param name="@videoPlayer" value="'+ videoId +'" /></object></div>';

        } else {

          videoBlock = '<div class="brightcove-video"><video id="myVideo13" data-account='+ videoAccount +' data-player="B1vQhARi" data-embed="default" data-video-id='+ videoId +' data-application-id class="video-js BrightcoveExperience" controls autoplay onloadedmetadata="Shangrila.bright.videoMetaDataLoaded()" onplay="Shangrila.bright.videoPlay()" onpause="Shangrila.bright.videoPause()"></video><script src="//players.brightcove.net/4554542031001/B1vQhARi_default/index.min.js"></script></div>';

        }


        $root.commonPopup.addClass('brightcove-wrapper').append(videoBlock);
        console.log(videoBlock);
        $root.popupShow();

        $root.scrollToTop();

        $root.commonOverlay.addClass('stackup');
        Shangrila.unlockBodyScroll();
        $('body').addClass('hang');

        $root.overlayShow();

        if ($('.brightcove-wrapper').is(':visible')) {
          brightcove.createExperiencesPostLoad();
        }

      });
    });
  },

  viewportChange: function() {
    var $root = this.root;

    if($root.commonPopup.css('display') == 'block'){
      $root.overlayShow();
    }
  }
};

Shangrila.modules.push('photoGallery');

/* Module - Carousel - Ends */
