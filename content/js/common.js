// Root namespace defined (everything will be within namespace scope)
var Shangrila = window.Shangrila || {};

// Global variables
Shangrila.screenWidth = $(window).width();
Shangrila.screenHeight = $(window).height();
Shangrila.extraSmall = 768; // for 'xs' devices
Shangrila.small = 992; // for 'sm' devices
Shangrila.medium = 1200; // for 'md' devices

// Shangrila underscore settings to use '@' instead of '%' to avoid .net conflicts
Shangrila.underscoreSettings = {
    interpolate: /<@=(.+?)@>/g,
    evaluate: /<@(.+?)@>/g
};

// get common jquery elements in cache
Shangrila.getCommonElements = function() {
    Shangrila.commonPopup = $('.common-popup-block:not(.modal)');
    Shangrila.commonPopupClose = $('.common-popup-block:not(.modal) .close-btn');
    Shangrila.commonOverlay = $('.common-overlay');
};

// check if local or staging server

Shangrila.serverEnvironment = (function() {
    //var rex = (/cunard([^\.]*?).co([\.mukau]*)$/i), // i.e. weare(cunard.co)m.au
    var host = window.location.host,
        path = window.location.pathname || '',
        //isProduction = rex.test(host),

        isStaticHtml = (/html$/i).test(path); // i.e. pathname.s(html)

    return {
        //'production': isProduction,
        //'apache': isStaticHtml,
        'static': isStaticHtml
    };
}());

/* Array to push references to modules for which js is written
  Used to implement sub/ pub or observer pattern. */
Shangrila.modules = [];


/* plugins for common functions - starts */

/* plugin for adjusting height of elements in same row */
$.fn.heightAdjust = function(reset) {
    var maxheight = 0;
    if (reset === false) {
        $(this).each(function() {
            if (maxheight < $(this).innerHeight()) {
                maxheight = $(this).innerHeight();
            }
        });
        $(this).css("height", maxheight);
    } else {
        $(this).each(function() {
            $(this).removeAttr('style');
        });
        $(this).each(function() {
            if (maxheight < $(this).innerHeight()) {
                maxheight = $(this).innerHeight();
            }
        });
        $(this).css("height", maxheight);
    }
};

/* plugins for common functions - ends */

/* debouncer function to delay event triggering on window resize */
Shangrila.debouncer = function(func, timeout) {
    var timeoutID;
    timeout = timeout || 300;
    return function() {
        var scope = this,
            args = arguments;
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function() {
            func.apply(scope, Array.prototype.slice.call(args));
        }, timeout);
    };
};

/* orientation change or resize events */
if (window.orientationchange) {
    if (window.attachEvent) {
        window.attachEvent("orientationchange", Shangrila.viewportChange, false);
    } else {
        window.addEventListener("orientationchange", Shangrila.viewportChange, false);
    }
} else {
    $(window).on("resize", Shangrila.debouncer(function(e) {

        //if (Shangrila.screenHeight != $(window).height()) {
            Shangrila.viewportChange();
        //}
        Shangrila.screenWidth = $(window).width();
        Shangrila.screenHeight = $(window).height();
    }));
}

/* Changes to be triggered on viewport change */
Shangrila.viewportChange = function() {

    Shangrila.screenWidth = $(window).width();
    Shangrila.screenHeight = $(window).height();
    Shangrila.triggerObserver('viewportChange');

    if (Shangrila.commonPopup.css('display') == 'block') {
        Shangrila.setPopupPosition();
    }

};

/* sub/ pub or Observer implementation for all changes across
  modules @ viewport change */
Shangrila.triggerObserver = function(functionName) {

    var jsModulesLength = Shangrila.modules.length;

    if (jsModulesLength > 0) {
        for (var i = 0; i < jsModulesLength; i++) {
            var module = Shangrila.modules[i];
            if (Shangrila[module][functionName]) {
                Shangrila[module][functionName]();
            }
        }
    }
};

/* scroll to current elments position and align top */
Shangrila.scrollToElement = function(element, duration) {
    var scrollPosition = element.offset().top - $('header').outerHeight() - 20;
    if (!duration) {
        duration = 400;
    }
    $('html, body').stop().animate({
        scrollTop: scrollPosition
    },duration);
};

/* scroll to top position for overlay */
Shangrila.scrollToTop = function() {
    /* chrome doesn't return html scrollTop so calculating on window */
    Shangrila.bodyScrollPosition = $(window).scrollTop();
    $('html, body').scrollTop(0);
};

/* scroll to specific position */
Shangrila.scrollToPosition = function(position) {

    /* position should be positive value and can not be 0 */
    /* To set scrolltop to 0 use Shangrila.scrollToTop function instead */
    position = (position ? position : Shangrila.bodyScrollPosition);
    $('html, body').scrollTop(position);

};

/* input should be repositioned for touch devices
to allow user to enter through keboard */
Shangrila.positionInput = function() {

    if (Modernizr.touch) {
        var inputs = $('input[type=text], textarea')
            .not('header input, :input[type=button], :input[type=submit], :input[type=reset], :input[type=checkbox]');

        $(inputs).each(function(e) {
            var _this = $(this);
            _this.on('focus, click', function(e) {
                Shangrila.scrollToElement(_this);
            });
        });
    }
};

/* Common js outside module will be defined here - starts */
Shangrila.accordionHandler = function(element, allElements, currentPanel, allPanels, callback) {
    if (currentPanel.css("display") == "none") {
        allPanels.removeAttr('style');
        allPanels.slideUp(0);
        allElements.removeClass('active');

        Shangrila.scrollToElement(element,0);

        currentPanel.slideDown(100, function(e) {
            element.addClass('active');
            callback();
        });
    } else {
        currentPanel.slideUp(0);
        element.removeClass('active');
    }
};

/* Common overlay functionality */
Shangrila.overlayShow = function() {
    var overlay = Shangrila.commonOverlay,
        overlayHeight = $(document).height();

    overlay.fadeIn();
    overlay.css({
        height: overlayHeight
    });
};

Shangrila.overlayHide = function() {
    var overlay = Shangrila.commonOverlay;
    if ($('.destination-overlay').css('display') != 'block') {
        overlay.hide();
    }
};

Shangrila.popupHide = function() {
    Shangrila.commonPopup.hide();
};

Shangrila.popupShow = function(callback) {

    Shangrila.commonPopup.show(400, function() {

        Shangrila.setPopupPosition();

        if (callback) {
            callback();
        }

    });
};

Shangrila.setPopupPosition = function() {
    if (!Modernizr.csstransforms) {
        var left = -Shangrila.commonPopup.width() / 2;
        Shangrila.commonPopup.css('marginLeft', left);
    }
};

/*** Common Close button for the Pop Up **/
Shangrila.closeButtonHandler = function(callback) {
    var $root = Shangrila,
        close = Shangrila.commonPopupClose;

    close.on('click', function(e) {

        e.preventDefault();

        var $this = $(this);

        $this.next().remove();

        $root.commonOverlay.removeClass('stackup');
        $root.overlayHide();

        $root.scrollToPosition();
        $('body').removeClass('hang');

        if($('.scroll-inside').length){
          $('.common-popup-block').unwrap($('.scroll-inside'));
        }

        $root.commonPopup.removeAttr('style');
        $root.popupHide();

        if (callback) callback();
    });

};
/*** Common Close button for the Pop Up **/

/* placeholder handler for old browsers */
Shangrila.placeholderHandler = function() {

    (function($) {
        $.support.placeholder = ('placeholder' in document.createElement('input'));
    })(jQuery);


    //fix for IE7 and IE8
    $(function() {
        if (!$.support.placeholder) {
            $("[placeholder]").focus(function() {
                if ($(this).val() == $(this).attr("placeholder")) {
                    $(this).val("");
                }
            }).blur(function() {
                if ($(this).val() === "") $(this).val($(this).attr("placeholder"));
            }).blur();

            $("[placeholder]").parents("form").submit(function() {
                $(this).find('[placeholder]').each(function() {
                    if ($(this).val() == $(this).attr("placeholder")) {
                        $(this).val("");
                    }
                });
            });
        }
    });

};

/* Expand/Collapse Social Icons */
Shangrila.showHideSocialIcons = function() {
    $('.social-icons-wrapper').each(function() {
        var _this = $(this),
            socialMore = _this.find('.social-more'),
            socialLess = _this.find('.social-less');

        var liList = _this.find('.social-icons ul li')
            .not(socialMore)
            .not(socialLess),
            visibleListLength = _this.attr('data-visible');
        Shangrila.showSocialIcons(liList, visibleListLength, socialMore, socialLess);
    });
};

Shangrila.showSocialIcons = function(liList, visibleListLength, socialMore, socialLess) {

    var liListLength = liList.length;

    function showLess() {
        liList.each(function(i, v) {
            if (i > visibleListLength - 1) {
                $(liList[i]).addClass('social-hide');
            }
        });

        socialMore.removeClass('social-hide');
        socialLess.addClass('social-hide');
    }

    showLess();

    liList.each(function(i, v) {
        if (i > visibleListLength - 1) {
            $(liList[i]).addClass('social-hide');
        }
    });


    socialMore.on('click', function() {
        liList.removeClass('social-hide');
        $(this).addClass('social-hide');
        socialLess.removeClass('social-hide');
    });

    socialLess.on('click', function() {
        showLess();
    });

};

// Show destination overlay
Shangrila.showDestinationOverlay = function() {
    $('a[data-action="change-destination"]').on('click', function(e) {
        e.preventDefault();

        Shangrila.overlayShow();
        //$('body').addClass('hang');
        $('.destination-overlay').slideDown();
        $('.common-overlay').css({
            'z-index': 11
        });
        //Shangrila.lockBodyScroll();
        $('body').css('overflowY', 'auto');

    });
};

// Hide destination overlay
Shangrila.hideDestinationOverlay = function() {
    $('.destination-overlay .close a').on('click', function(e) {
        e.preventDefault();
        Shangrila.removeDestinationCookie();
        $('body').removeClass('hang');
        $('.common-overlay').css({
            'z-index': 10
        });
        $('.destination-overlay').slideUp(400, function() {
            Shangrila.overlayHide();
            if (Shangrila.screenWidth < Shangrila.extraSmall) {
                $('.accordion-header.active').removeClass('active');
                $('ul[data-ref]').hide();
            }
        });

        //Shangrila.unlockBodyScroll();
        $('body').css('overflowY', 'auto');
    });

    $('.common-overlay').on('click', function() {
        $(this).css({
            'z-index': 10
        });
        $('.destination-overlay').slideUp(400, function() {
            Shangrila.overlayHide();
            //Shangrila.unlockBodyScroll();
            $('body').css('overflowY', 'auto');
        });
    });
};



// Set destination in section header
Shangrila.setDestination = function() {
    $('.destination-overlay ul.list-unstyled li > a , .destination-overlay h2 a').on('click', function(e) {
        e.preventDefault();

        $('*[data-type="change-destination"]').text($(this).text());
        $('.destination-overlay').slideUp(400, function() {
            Shangrila.overlayHide();
        });

        Shangrila.unlockBodyScroll();
    });
    $(".destination-overlay .accordion-header a").on("click", function() {
        return false;
    });
};

// lock body scroll
Shangrila.lockBodyScroll = function() {

    Shangrila.bodyScrollPosition = $(window).scrollTop();

    if (Shangrila.screenWidth < Shangrila.extraSmall) {
        $('html, body').scrollTop(0);
    }

    $('body').addClass('hang');
};

// unlock body scroll
Shangrila.unlockBodyScroll = function() {
    Shangrila.scrollToPosition();

    $('body').removeClass('hang');
};

// set Escape element
Shangrila.setEscapeElement = function(element) {
    Shangrila.escapeElement = element;
};

Shangrila.setEscapeCallback = function(callback) {
    Shangrila.escapeCallback = callback;
};

Shangrila.hideElement = function() {
    var element = Shangrila.escapeElement,
        callback = Shangrila.escapeCallback;

    if ($(element).is(":visible")) {
        $(element).slideUp(400, function() {
            if (callback) callback();
        });
    }
};

$(document).click(function(e) {

    var target = $(e.target);

    //console.log($.contains($('#ui-datepicker-div')[0], $(target)[]));

    if (target.hasClass('ui-datepicker-prev') || target.hasClass('ui-datepicker-next')) {
        return;
    } else if ($.contains($('#ui-datepicker-div')[0], $(target)[0])) {
        return;
    } else
    /*if( target.hasClass('ui-autocomplete') $.contains($('.ui-autocomplete')[0], $(target)[0]) ) {
       return;
     }
     else*/
    if (!target.closest(Shangrila.escapeElement).length && !target.is(Shangrila.escapeElement)) {
        Shangrila.hideElement();
        Shangrila.setEscapeElement(null);
        Shangrila.setEscapeCallback(null);
    }
});

$(document).on('keyup', function(e) {
    var key = e.keyCode || e.which;

    if (key == 27) {

        if ($(e.target).hasClass('hasDatepicker')) {
            $(e.target).blur();
        } else {
            Shangrila.hideElement();
        }
    }
});

Shangrila.candidWall = function(elem) {

    var elemArray = $(elem);

    if (elemArray.length) {
        elemArray.each(function(i, v) {
            candid.wall($(this), {
                id: $(this).attr('data-gallery-id'),
                //SHANGWEAS-15 and 40
                ready: function() {
                    var candidMediaClick = elemArray.find('.media'),
                        candidMediaClose = $('#candid-overlay').find('.candid-close');
                    candidMediaClick.on('click', function(event) {
                        event.preventDefault();
                        if(!$('body').hasClass('hang')){
                            $('body').addClass('hang');
                        }
                    });
                    candidMediaClose.on('click', function(event) {
                        event.preventDefault();
                        if($('body').hasClass('hang')){
                            $('body').removeClass('hang');
                        }
                    });
                },
                layout: 'standard'
            });
        });
    }
};

Shangrila.freezPage = function() {
    Shangrila.lockBodyScroll();
    Shangrila.commonOverlay.addClass('spinner stackup');
    Shangrila.overlayShow();

};

Shangrila.unfreezPage = function() {
    Shangrila.unlockBodyScroll();
    Shangrila.overlayHide();
    Shangrila.commonOverlay.removeClass('spinner');
};

// Disable keyboard popup for datepicker inputs.
Shangrila.disableKeyPopup = function() {
    $('.hasDatepicker').attr('readonly', true);
};


// hashTag js
Shangrila.hashTag = function() {
    var socialHashTag = $('body h1');
    socialHashTag.each(function() {
        $this = $(this);
        if ($this.text().indexOf("#") > -1) {
            $this.css({
                'text-transform': 'none'
            });
        } else {
            $this.css({
                'text-transform': 'uppercase'
            });
        }
    });

};

// Data Type Attr tel in mobile
Shangrila.dataTypeAttr = function() {

    var dataTel = $("input[data-type='tel']");

    dataTel.each(function() {
        //console.log(dataTel);
        if (Shangrila.screenWidth < Shangrila.small) {
            dataTel.attr("type", $(this).attr("data-type"));
        } else {
            dataTel.attr("type", "text");
        }
    });

};

Shangrila.setDestinationCookie = function(destination, destinationType, destinationText) {
    Cookies.set("DestinationCookie", {
        Destination: destination,
        DestinationType: destinationType,
        DestinationText: destinationText
    });
};

Shangrila.getDestinationCookie = function() {
    var destinationCookie = Cookies.getJSON('DestinationCookie');
    if (destinationCookie && destinationCookie.Destination && destinationCookie.DestinationType && destinationCookie.DestinationText) {
        return destinationCookie;
    }
};

Shangrila.removeDestinationCookie = function() {
  Cookies.remove("DestinationCookie");
};

Shangrila.GetTranslatedDestinationText = function (Language, DestinationNames) {

    var destinationObjArray = $.parseJSON(DestinationNames);
    var result = "";

    $.each(destinationObjArray, function (index, item) {
        if (Language == item.Key) {
            result = item.Value;
        }
    });

    return result;
};

Shangrila.GetCountryNames = function (countryCode) {

    var countryNames = null;

    $.ajax({
        type: "GET",
        url: "/Services/GetRestaurantsService.svc/GetCountryNames?param=" + countryCode.trim() + "&language=" + $("html").attr("lang"),
        dataType: "json",
        async: false
    })
       .success(function (data) {
           countryNames = data;
       });

    return countryNames;
};

Shangrila.GetCityNames = function (cityCode) {

    var cityNames = null;

    $.ajax({
        type: "GET",
        url: "/Services/GetRestaurantsService.svc/GetCityNames?param=" + cityCode.trim() + "&language=" + $("html").attr("lang"),
        dataType: "json",
        async: false
    })
       .success(function (data) {
           cityNames = data;
       });

    return cityNames;
};

// ie detection
Shangrila.checkBrowser = function() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var trident = ua.indexOf('Trident/');
    var edge = ua.indexOf('Edge/');

    if (msie > 0) {
        // If Internet Explorer, return version number
        return {'isIE': true, 'version': parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10)};

    } else if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return {'isIE': true, 'version': parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10)};

    } else if (edge > 0) {
        // Edge (IE 12+) => return version number
        return {'isIE': true, 'version': parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10)};

    } else {
        // If another browser, return 0
        return {'isIE': false, 'version': undefined};
    }
};

Shangrila.isIOS = function() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

Shangrila.isIE = Shangrila.checkBrowser().isIE;
Shangrila.browserVersion = Shangrila.checkBrowser().version;

// Add class 'ie' to html as conditional comment doesn't work for IE > 9
(function(){
    if(Shangrila.isIE ) {
        $('html').addClass('ie');
    }
    if(Shangrila.isIOS()) {
        $('html').addClass('ios');
    }
})();

// Mobile country code
Shangrila.setMobileCountryCode = function() {
    if( $('select[data-type="mobileCountryCode"]').length > 0 ) {

        var opts = $('select[data-type="mobileCountryCode"]').find('option');

        opts.each(function(i,v) {

            var $this = $(this),
                optValue = $this.val();

            if(optValue === '') {
                $this.attr( 'data-customtext', $this.text() );
            }
            else {
                $this.attr('data-customtext', '+' + optValue);
            }

        });

        // insert field
        $('select[data-type="mobileCountryCode"]').each(function(i, v) {

            var $this = $(this);

            if( ! $this.parents('.ui-select').find('.mobile-code-custom-text').length ) {
                var span = $('<span>', {'class':'mobile-code-custom-text'});

                span.text( $this.find('option:selected').attr('data-customtext') );
                span.insertAfter($this);
            }

            var selectContainer = $this.parents('.ui-select').find('.selectboxit-container'),
                selectElement = selectContainer.find('.selectboxit'),
                selectText = selectElement.find('.selectboxit-text');

            $this.css({
                'textIndent':'-999px',
                'zIndex': '3',
                'position' : 'absolute',
                'opacity' : '0'
            });

            selectContainer.css({
                'zIndex': '2'
            });

            selectElement.css({
                'backgroundColor': 'transparent'
            });

            selectText.css({
                'visibility':'hidden'
            });
        });
    }
};


Shangrila.CloseDestinationOverlay = function () {
    Shangrila.removeDestinationCookie();
    $("body").removeClass("hang");
    $(".common-overlay").css({
        "z-index": 10
    });
    $(".destination-overlay").slideUp(400, function () {
        Shangrila.overlayHide();
        if (Shangrila.screenWidth < Shangrila.extraSmall) {
            $(".accordion-header.active").removeClass("active");
            $("ul[data-ref]").hide();
        }
    });
    $("body").css("overflowY", "auto");
};
Shangrila.ClearDestinationFilter = function () {
    var callingPage = $("#callingPage").val();
    switch (callingPage) {
        case "FBRestaurantsLandingPage": clearRestaurantsFilter(); break;
        case "FBExperiencesLandingPage": clearExperiencesFilter(); break;
        case "FBOffersLandingPage": clearOffersFilter(); break;
        case "FBHomePage": clearDestinationOnHomePage(); break;
        case "FBMoodsPage": clearDestinationOnMoodsPage(); break;
        default: return;
    }
    Shangrila.CloseDestinationOverlay();
};

$('select[data-type="mobileCountryCode"]').on('change', function(e) {
    var $this = $(this),
        customText = $this.find('option:selected').attr('data-customtext');

    $this.parents('.ui-select').find('.mobile-code-custom-text').text( customText );
});

// set scroll position to first error in form for server postback
Shangrila.setPositionOnError = function() {

    if( $('form').length > 0 ) {

        var firstErrorField = $('form').find('.error').first(),
            captchaErrorField = $('form').find('.captcha-error'),
            headerOffset = $('header').outerHeight() + 100,
            errorPosition,
            offset;

        if( firstErrorField.length > 0 ){
            errorPosition = firstErrorField.offset().top;
        }
        else if( captchaErrorField.length > 0 ) {
            errorPosition = captchaErrorField.offset().top;
        }
        else {
            return;
        }

        offset = errorPosition - headerOffset;
        Shangrila.scrollToPosition(offset);
    }
};

// call to a function to set position error for captcha in form for server postback
$(window).load( function(e) {
    Shangrila.setPositionOnError();
});

$(window).trigger("lookup");
// Initiate functions on dom ready
$(document).ready(function(e) {

    $('.lazy-load').unveil(200); /* Initiate lazy loading of images */

    Shangrila.getCommonElements();
    Shangrila.triggerObserver('init');
    Shangrila.positionInput();
    Shangrila.showDestinationOverlay();
    Shangrila.hideDestinationOverlay();
    Shangrila.setDestination();
    Shangrila.showHideSocialIcons();
    Shangrila.candidWall('.candid-container');
    Shangrila.disableKeyPopup();
    Shangrila.hashTag();
    Shangrila.dataTypeAttr();
    Shangrila.setMobileCountryCode();
    // Shangrila.pagination.bindEvents(".pagination-holder .pagination ul", 35);
});

//To support placeholder for IE9 and less
$(function() {
    if (/MSIE\s/.test(navigator.userAgent) && parseFloat(navigator.appVersion.split("MSIE")[1]) < 10) {
        $("[placeholder]").focus(function() {
            if ($(this).val() === $(this).attr("placeholder")) $(this).val("");
        }).blur(function() {
            if ($(this).val() === "") $(this).val($(this).attr("placeholder"));
        }).blur();

        $("[placeholder]").parents("form").submit(function() {
            $(this).find('[placeholder]').each(function() {
                if ($(this).val() === $(this).attr("placeholder")) {
                    $(this).val("");
                }
            });
        });
    }
    if (/MSIE\s/.test(navigator.userAgent) && parseFloat(navigator.appVersion.split("MSIE")[1]) == 9) {
        $('html').addClass('ie9');
    }
});
