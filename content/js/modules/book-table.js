/* Module - Book a Table - Starts */
Shangrila.bookTable = {

  init: function() {
    this.root = Shangrila;
    this.bindEvents();
  },

  bindEvents: function() {
    var thisModule = this;

    //$('*[data-type="book-table-link"]').off("click");

    $('*[data-type="book-table-link"]').on('click', function(e) {
      e.preventDefault();
      var $this = $(this);
      thisModule.showBookingEngine($this);

    });
  },

  onLoadHandler: function() {
      $('.book-reservation').css('height', '61vh');
  },

  showBookingEngine: function($this) {
    var $root = this.root;
    var iframeSource = $this.attr('href');

    var iframe = '<div class="book-reservation">' +
                    '<iframe src=' + iframeSource + ' onload="Shangrila.bookTable.onLoadHandler()">' +
                    '</iframe>' +
                  '</div>';

    $root.commonPopup.addClass('reservation-wrapper popup-book-table');
    var callback = function() {
      $root.commonPopup.removeClass('reservation-wrapper popup-book-table');
      $root.unlockBodyScroll();
    };

    Shangrila.closeButtonHandler(callback);
    $("div.book-reservation").remove();
    $root.commonPopup.append(iframe);
    $root.popupShow();
    $root.lockBodyScroll();
    $root.commonOverlay.addClass('stackup');

    $root.overlayShow();
    //$root.scrollToTop();
  }

};

Shangrila.modules.push('bookTable');
/* Module - Book a Table - Ends */
