/* Pagination script new plugin to make it generlise */
Shangrila.pagination = {

    init: function() {
        this.root = Shangrila;
        // this.bindEvents();
    },

    bindEvents: function (ulObj, tPages, callback) {

        $(ulObj).twbsPagination({
            totalPages: tPages,
            visiblePages: 4,
            prev:'<span class="prev-btn icon-angle-left"></span>',
            next:'<span class="next-btn icon-angle-right"></span>',
            onPageClick: function (event, page) {
                if(page < tPages-2) {
                    $(".page").last().after('<li class="fake-next"><a href="#">...</a></li>');
                }

                if(page > 2) {
                    $(".page").first().before('<li class="fake-prev"><a href="#">...</a></li>');
                }

                if(!!callback) {
                    callback(page);
                }

                $(".disabled").addClass("disabled-btn");
            }
        });

        $(ulObj).on("click", "li", function (e) {
            e.preventDefault();

            if($(this).hasClass("fake-prev")) {
                $(".prev").trigger("click");
            } else if($(this).hasClass("fake-next")) {
                $(".next").trigger("click");
            }
        });
    }
};

Shangrila.modules.push('pagination');

/* End - Pagination script new plugin to make it generlise */

/* Module - Pagination - Starts */
/*
Shangrila.pagination = {

  init: function() {
    this.root = Shangrila;
    this.bindEvents();
    this.enableButton('next');
    this.disableButton('previous');
  },

  bindEvents: function() {

    var pagination = $('.pagination'),
        prevButton = pagination.find('.prev-btn'),
        nextButton = pagination.find('.next-btn'),
        pageLinks = pagination.find('ul li a'),
        pageLinksLength = pageLinks.lenth;

    // previous Button Click
    $(pageLinks, prevButton, nextButton).on('click', function() {

      if(pageLinks.eq(0).hasClass('active')) {
        this.disableButton('prev-btn');
      }
      else {
        this.enableButton('prev-btn');
      }

      if(pageLinks.eq(pageLinksLength-1).hasClass('active')) {
        this.disableButton('next-btn');
      }
      else {
        this.enableButton('next-btn');
      }
    });

    pageLinks.on('click', function(e) {
      console.log('in pageLinks click');
      e.preventDefault();

      var $this = $(this);

      if($this.hasClass('active')) {
        return;
      }
      else {
        pageLinks.removeClass('active');
        $this.addClass('active');
        //Shangrila.freezPage();  // Should be called before showpage();
        //Shangrila.unfreezPage();  // Should be called after ajax success as a callback
        var idx = $this.parent('li').index();

        showpage(idx+1);
      }
    });

    prevButton.not('.disabled-btn').on('click', function(e) {
      console.log('in prevButton click');
      prevPage();
    });

    nextButton.not('.disabled-btn').on('click', function(e) {
      console.log('in nextButton click');
      nextpage();
    });
  },

  enableButton: function(button) {
    $('.' + button).removeClass('.disabled-btn');
  },

  disableButton: function(button) {
    $('.' + button).addClass('.disabled-btn');
  }

};

Shangrila.modules.push('pagination');*/
/* Module - Pagination - Ends */
