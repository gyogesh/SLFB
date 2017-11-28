/* Module - Search - Starts */
Shangrila.search = {

    init: function() {
        this.root = Shangrila;
        this.bindEvents();
        this.populateAllHotels();
    },

    bindEvents: function() {

        // On keyup dropdown will appear
        // $('.form-bar #home-hotel-search.input-val').on('keyup', function() {
        //
        //   var $thisEle = $(this),
        //       $thisParent = $thisEle.parents('.search-bar'),
        //       $searchDropDown = $thisParent.find('.search-dropdown'),
        //       searchClose = $thisParent.find('.search-close'),
        //       searchBtn = $thisParent.find('.search-link'),
        //       closeDrop = $thisParent.find('.close-search'),
        //       inputLength = $thisEle.val().length;
        //       //$('#ulAutoPopulateHomeSearch').html('');
        //   if(inputLength > 0){
        //     $searchDropDown.removeClass('js-dropdown-hidden');
        //     searchBtn.hide();
        //     closeDrop.show();
        //     searchClose.show();
        //
        //     if($('.ui-autocomplete').css('display') == 'none') {
        //       $thisParent.find('.no-search-result').removeClass('hidden');
        //     }
        //   } else {
        //     $searchDropDown.addClass('js-dropdown-hidden');
        //     searchBtn.show();
        //     searchClose.hide();
        //     closeDrop.hide();
        //     $thisParent.find('.no-search-result').addClass('hidden');
        //   }
        // });

        // Disable zoom on focus on input, select and textarea

        var $objHead = $( 'head' );

        // define a function to disable zooming
        var zoomDisable = function() {
            $objHead.find( 'meta[name=viewport]' ).remove();
            $objHead.prepend( '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0" />' );
        };

        // ... and another to re-enable it
        var zoomEnable = function() {
            $objHead.find( 'meta[name=viewport]' ).remove();
            $objHead.prepend( '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=1" />');
        };

        // if the device is an iProduct, apply the fix whenever the users touches an input
        if( navigator.userAgent.length && /iPhone|iPad|iPod/i.test( navigator.userAgent ) ) {
            // define as many target fields as your like 
            $( "input, select, textarea" )
                .on( { 'touchstart' : function() { zoomDisable(); } } )
                .on( { 'touchend' : function() { setTimeout( zoomEnable , 500 ); } } );
         }


        $('.close-search').on('click', function() {
            var $thisEle = $(this),
                $thisParent = $thisEle.parents('.search-bar'),
                $searchDropDown = $thisParent.find('.search-dropdown'),
                $searchBtn = $thisParent.find('.search-link');

            $searchDropDown.addClass('js-dropdown-hidden');
            $searchBtn.show();
            $thisEle.hide();
        });

        $('.cta-search').on('click', function(e) {
            var $thisEle = $(this),
                $searchPanel = $thisEle.parents('header').find('.search-panel'),
                $closeBtn = $searchPanel.find('.close-form');

            $searchPanel.fadeIn();
            $searchPanel.find('.input-val').val('').focus();
        });

        $('.close-form').on('click', function() {
            var $thisEle = $(this),
                $searchPanel = $thisEle.parents('header').find('.search-panel'),
                $inputEle = $thisEle.parents('.form-bar').find('.input-val');
            $inputEle.val('').focus();
            $searchPanel.hide();
            $inputEle.val('').focus();
        });

        $('.search-call').on('click', function() {
            var $thisEle = $(this),
                $searchPanel = $thisEle.parents('header').find('.search-panel'),
                $inputEle = $searchPanel.find('.input-val');

            $searchPanel.fadeIn();
            $inputEle.val('').focus();
        });

        $('.search-dropdown li').on('click', function() {
            var $thisEle = $(this),
                thisText = $thisEle.text(),
                $searchDropDown = $thisEle.parents('.search-dropdown'),
                $thisInput = $thisEle.parents('.search-bar').find('.input-val'),
                $closeDrop = $thisEle.parents('.search-bar').find('.close-search'),
                $searchBtn = $thisEle.parents('.search-bar').find('.search-link');

            $thisInput.val(thisText);
            $searchDropDown.addClass('js-dropdown-hidden');
            $closeDrop.hide();
            $searchBtn.show();
        });
    },

    populateAllHotels: function() {

        var thisModule = this,
            searchHotelInput = $('#home-hotel-search');

        if (searchHotelInput.length > 0) {
            window.onload = function(){searchHotelInput.val('');};//Empty value
            var jsonurl = searchHotelInput.attr('data-service');

            // ajax to populate data
            $.ajax({
                    url: jsonurl,
                    type: 'GET',
                    dataType: 'json'
                })
                .done(function(data) {
                    thisModule.searchHotelResult = data;
                    thisModule.bindAllAutocomplete();
                })
                .always(function() {
                    return false;
                });
        }
        this.searchHotelInput = searchHotelInput;
    },

    bindAllAutocomplete: function() {
        var thisModule = this;
        thisModule.searchHotelInput.on('focus', function() {
            $(this).autocomplete({
                    source: thisModule.searchHotelResult,
                    minLength: 1,
                    autoFocus: true,
                    open: function(event, ui) {
                        $(".ui-menu").addClass("list-unstyled").removeClass("ui-menu").css("max-height", "200px");
                        $(".ui-menu-item").addClass("ui-home-search-item"); //.removeClass("ui-menu-item");

                        var lastLiItem = document.createElement("li");
                        lastLiItem.setAttribute("data-hotel-url", $('#aShowAllRestaurants').attr('href'));
                        lastLiItem.setAttribute("data-hotel-name", "All restaurants");
                        lastLiItem.className = "ui-home-search-item ui-menu-item";
                        lastLiItem.id = "ui-id-0";
                        lastLiItem.setAttribute("tabindex", "-1");
                        lastLiItem.setAttribute("aria-label", "search");
                        lastLiItem.style.cssText = "text-align:center;";
                        lastLiItem.innerHTML = $('#aShowAllRestaurants').prop('outerHTML');
                        $(".ui-home-search-item:last").after(lastLiItem.outerHTML);
                        return false;
                    },
                    appendTo: '#allRestaurants',
                    focus: function(event, ui) {
                        return false;
                    },
                    select: function(event, ui) {
                        if(ui.item) {
                            if (ui.item.url !== "NoResult") {
                              window.location = ui.item.url;
                            } else {
                              $('#home-hotel-search').val('');
                            }
                        } else {
                          window.location = $('#aShowAllRestaurants').attr('href');
                        }
                        return false;
                    },
                    response: function(event, ui) {
                        if (!ui.content.length) {
                            var noResult = {
                                url: "NoResult",
                                label: "There are no result matching \"" + $('#home-hotel-search').val().trim() +"\"."
                            };
                            ui.content.push(noResult);
                        }
                    },
                    //App support SHANGWEAS-136 issue fix
                    create: function(event, ui) {
                        if(navigator.userAgent.length && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                            $('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
                        }
                    }
                })
                .autocomplete("instance")._renderItem = function(ul, item) {
                    var term = this.term;
                    var regexText = new RegExp("(" + term + ")", "gi");
                    var searchLabel = item.label.replace(regexText, "<b class='searchText'>$1</b>");
                    if (item.url === "NoResult") {
                        return $("<li>")
                            .attr('data-hotel-url', '#')
                            .attr('data-hotel-name', item.label)
                            .append("<span>" + item.label + "</span>")
                            .appendTo(ul);
                    } else {
                        return $("<li>")
                            .attr('data-hotel-url', item.url)
                            .attr('data-hotel-name', item.label)
                            .append("<a href='" + item.url + "'>" + searchLabel + "</a>")
                            .appendTo(ul);
                    }
                };
        });
    },
};

Shangrila.modules.push('search');

$(window).load( function(e) {
     // App support SHANGWEAS-133 Fix
     
    if( $('html').hasClass('ie') ) {
        $('#home-hotel-search').focus().blur();
    }
    
});

//Fix for SHANGWEAS-135 issue
$(window).on("pageshow", function(event) {
    if (event.originalEvent.persisted) {
        // window.location.reload() //reload the entire page or jus reset the input fields
        $('#home-hotel-search').val('');
    }
});
/* Module - Search - Ends */
