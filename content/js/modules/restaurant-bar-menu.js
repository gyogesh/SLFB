/* Module - Restaurant and Bars - Menu - Starts */
Shangrila.restaurantBarMenu = {
  
  init: function() {
    this.root = Shangrila;
    this.bindEvents();
  },

  bindEvents: function() {
    var $this = this;
    var $root = this.root;

    /*
    $('.venue-menu .menu-list li > a').on('click', function(e) {
      var $this = $(this),
          menuDetailWrapper = $this.parent().find('.menu-detail-wrapper'),
          menuDetail = menuDetailWrapper.html();

          var scrollInside = "<div class='scroll-inside'></div>";
          $('.common-popup-block').wrap(scrollInside);
          $('.scroll-inside').css({'position': 'fixed', 'top': '0px', 'left': '0px', 'right': '0px', 'overflow-y': 'auto', 'bottom': '0px', 'z-index': '999'});
      if(menuDetail) {
        var callback = function() {
          if($this.attr('data-section-header')){
            var id = $this.attr('data-section-header');
            Shangrila.scrollToPosition($('.common-popup-block').find(id).offset().top - 20 );
          }
        };

        $root.commonPopup.append(menuDetail);
        $root.popupShow(callback);

        $root.commonOverlay.addClass('stackup');
        $root.overlayShow();
        $root.scrollToTop();
        $('body').addClass('hang');
        $('.common-popup-block a.cta-link.print').on('click', function() {
          $('body').addClass('restaurantbar');
          window.print();
        });
      }
    });
    */
    $('.venue-menu .menu-list li > a').on('click', function(e) {
      e.preventDefault();
      var $this = $(this);
      if($root.screenWidth < Shangrila.small) {
        window.open($this.attr('href'), '_blank');
      } else {
        var menuDetailWrapper = $this.parent().find('.menu-detail-wrapper'),
            menu = $('.menu-detail',menuDetailWrapper),
            menuDetail = menuDetailWrapper.html();
        if (menu.length  ===  0) {
          $.ajax({
            type: "GET",
            url: $this.attr('href'),
            async: false
          }).success(function (data) {
            var html = $.parseHTML(data);
            menuDetailWrapper.html(html);
            var menuPage = $('.menu-page',menuDetailWrapper).html();
            menuDetailWrapper.html(menuPage);
            Shangrila.restaurantBarMenu.prepareOverlay(menuDetailWrapper.html(), $this.attr('data-section-header'));
          });
        } else {
          Shangrila.restaurantBarMenu.prepareOverlay(menuDetail, $this.attr('data-section-header'));
        }
      }
     });

    if ($('.menu-detail').length > 0) {
      $('body').addClass('restaurantbar');
      /*$('.menu-detail a.print').on('click', function() {
        window.print();
      });*/
    }
  },
  prepareOverlay: function (markup, scrollToID){
    var $this = this;
    var $root = this.root;
    var scrollInside = "<div class='scroll-inside'></div>";
    $('.common-popup-block').wrap(scrollInside);
    
    var callback = function() {
      if (scrollToID) {
        Shangrila.scrollToPosition($('.common-popup-block').find(scrollToID).offset().top - 20 );
      }
    };
    $root.commonPopup.append(markup);
    $root.popupShow(callback);
    $root.commonOverlay.addClass('stackup');
    $root.overlayShow();
    $root.scrollToTop();
    $('.scroll-inside').css({'position': 'fixed', 'top': '0px', 'left': '0px', 'right': '0px', 'overflow-y': 'auto', 'bottom': '0px', 'z-index': '999'});
    $('body').addClass('hang');
    $('.common-popup-block a.cta-link.print').on('click', function() {
      $('body').addClass('restaurantbar');
      window.print();
    });
  }
};

Shangrila.modules.push('restaurantBarMenu');
/* Module - Restaurant and Bars - Menu - Starts */
