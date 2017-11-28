/* Module - Carousel - Starts */
Shangrila.carousels = {
  /**Below is the common options for the Content Carousels you can use it anywhere by using for eg.
    $root.carousels.contentCarouselOptions
  **/
  contentCarouselOptions : {
    margin: 20,
    items: 1,
    loop: true,
    nav: false,
    navText: false,
    dots: true,
    info: true,
    smartSpeed : 250,
    stagePadding: 0,
    responsive: {
      0:{
        center: true,
        stagePadding: 20,
        margin: 10
      },
      479:{
        center: true,
        stagePadding: 40
      },
      767: {
        margin:0,
        nav: false,
        smartSpeed : 1000
      },
      991:{
        nav: true,
        smartSpeed : 1000
      }
    }
  },
  /**Below is the common options for the Hero Carousels you can use it anywhere by using for eg.
    $root.carousels.mainCarouselOptions
  **/
  mainCarouselOptions:{
    margin: 0,
    items: 1,
    loop: true,
    navText: false,
    dots: true,
    info: true,
    smartSpeed : 250,
    autoplay : true,
    autoplayTimeout : 6000,
    stopOnHover : true,
    responsive: {
      0:{
        nav: false,
        dots: true
      },
      767: {
        smartSpeed : 1000
      },
      991: {
        nav: true,
        smartSpeed : 1000
      }
    }
  },

  init: function() {
    this.root = Shangrila;  // root object with namespace Shangrila
    this.initcarousel();
    this.adjustHeight();
    this.adjustHeightScroller();
  },

  initcarousel: function(){
    var $root = this.root;
    var thisModule = this;

    //Below carousel is for Content Sliders
    $(".content-slider").each(function() {

      var $owlContainer = $(this),
          $owlSlides = $(this).children(".item"),
          totalSlides = $owlSlides.length;

      if ($owlSlides.length > 1) {
        $owlContainer.owlCarousel(thisModule.contentCarouselOptions);

        // append text describing slide number
        (function(){
          $owlSlides.each(function(i, v) {
            var $this = $(this),
                $element = '<div class="page-info">' + (i+1) + ' / ' + totalSlides + '</div>';
            $(this).find('.caption-block').append($element);
          });
        })();
      } else {
        $owlContainer.addClass("no-carousel");
      }
    });

    //Below carousel is for Hero Banners section
    $(".main-carousel").each(function() {

      $owlContainer = $(this);
      $owlSlides = $(this).children(".item");

      if ($owlSlides.length > 1) {

        $owlContainer.owlCarousel(thisModule.mainCarouselOptions);

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

    $('.main-carousel .owl-item, .owl-nav > div').on('mouseenter',function(e){
      $(this).closest('.main-carousel').trigger('stop.owl.autoplay');
    });
    $('.main-carousel .owl-item, .owl-nav > div').on('mouseleave',function(e){
      $(this).closest('.main-carousel').trigger('play.owl.autoplay');
    });

    $(document).on('click', '.owl-carousel .owl-next', function() {
      var carouselImg = $('.owl-carousel .owl-item img').attr('alt');
      if(carouselImg !== '' || carouselImg !== undefined){
        $(this).each(function() {
          var activSlide = $(this).closest('.owl-carousel').find('.owl-item.active').prev().find('img');
          var activSlideAlt = activSlide.attr('alt');
          //console.log(activSlideAlt);
          wa.CarouselTitle = activSlideAlt;
          console.log(wa.CarouselTitle);
        });
      }
    });


    $(document).on('click', '.owl-carousel .owl-prev', function() {
      var carouselImg = $('.owl-carousel .owl-item img').attr('alt');
      if(carouselImg !== '' || carouselImg !== undefined){
        $(this).each(function() {
          var activSlide = $(this).closest('.owl-carousel').find('.owl-item.active').next().find('img');
          var activSlideAlt = activSlide.attr('alt');
          //console.log(activSlideAlt);
          wa.CarouselTitle = activSlideAlt;
          console.log(wa.CarouselTitle);
        });
      }
    });

    /*$(document).on('click', '.owl-carousel .owl-next, .owl-carousel .owl-prev', function() {
      var activSlide = $(this).closest('.owl-carousel').find('.owl-item.active img');
      var activSlideAlt = activSlide.attr('alt');
      //console.log(activSlideAlt);
      wa.CarouselTitle = activSlideAlt;
      console.log(wa.CarouselTitle);
    });*/

  },

  adjustHeight: function() {

    if($('.slider-content-pod').length > 0) {

      if(Shangrila.screenWidth < Shangrila.extraSmall){
        $('.slider-content-pod .item .eqHeight').css({
          height: 'auto'
        });

      } else {
        $('.slider-content-pod .item .eqHeight').heightAdjust();
      }
    }

  },

  adjustHeightScroller: function() {

    if($('.experiences .slider-content-pod').has('.owl-carousel')) {
      $('.slider-content-pod .item .caption-block .aligned-content').heightAdjust();
    } else {
      $('.slider-content-pod .item .caption-block .aligned-content').css({
          height: 'auto'
      });
    }
  },

  viewportChange: function() {
    this.adjustHeight();
    this.adjustHeightScroller();
  }

};

Shangrila.modules.push('carousels');

/* Module - Carousel - Ends */
