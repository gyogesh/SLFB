/* Module - Header - Starts */
Shangrila.header = {

  init: function() {
    this.root = Shangrila;
    this.bindEvents();
    this.setNavigation();
    this.addRemoveRooms();
  },

  bindEvents: function() {

    var $root = this.root;
    var mobileMenu = $('.mobile-menu li a.mobile-nav'),
        backToMenu = $('.nav-wraper .back-btn-container a.back-btn');

    mobileMenu.on('click', function(e){
      e.preventDefault();
      $(".main-carousel").trigger('stop.owl.autoplay');
      
      $('.primary-nav-wrapper .nav-wraper').animate({
        left:0
      });
      $root.commonOverlay.fadeIn();
      $root.lockBodyScroll();
      $('html, body').css({'height':'100%'});
    });
    backToMenu.on('click', function(e){
      e.preventDefault();
      $(".main-carousel").trigger('play.owl.autoplay');

      $('.primary-nav-wrapper .nav-wraper').animate({
        left:'100%'
      });
      $root.commonOverlay.hide();
      $root.unlockBodyScroll();
      $('html, body').css({'height':'auto'});      
    });

    //Called for the Book Hotel Link
    this.callBookNow();
    this.callLogInFlyout();
    this.memberLogIn();
  },

  callBookNow: function(){
    var $root = this.root;
    var thisModule = this;

    var container = $('.book-hotel-slider'),
        backToNav = $('.book-hotel-slider .back-btn-container a.back-btn');

    $('.book-hotel').on('click', function(e){
      var $this = $(this),
          callback;

      e.stopPropagation();
      $('.ui-autocomplete').appendTo('.book-hotel-container #divError #book-hotel-autocomplate');

      Shangrila.hideElement();
      container.css({'left': $this.position().left});

      if($root.screenWidth >= $root.medium){

        if(container.css('display') == 'none') {
          $this.addClass('active');
          $this.next().addClass('remove');
          container.slideDown();
        }
        else {
          $this.removeClass('active');
          $this.next().removeClass('remove');
          container.slideUp();
        }

        callback = function() {
          $this.removeClass('active');
          $this.next().removeClass('remove');
          thisModule.resetForm();
        };

        //Shangrila.escapeFlyout(container, callback);
        Shangrila.setEscapeElement(container);
        Shangrila.setEscapeCallback(callback);

      } else {

        callback = function() {
          container.animate({
            left: 0
          });
          $('.primary-nav-wrapper .nav-wraper').animate({
            left:'-100%'
          });
        };

        container.show(400, function(){
          callback();
        });

      }

    });


    backToNav.on('click', function(){
      container.animate({
        left:"100%"
      });
      $('.primary-nav-wrapper .nav-wraper').animate({
        left:0
      });
    });
  },

  setLoginFlyoutPosition: function() {
    var container = $('.login-flyout'),
        rightPos;

    if(Shangrila.screenWidth > 1300) {
      rightPos = parseInt ( ( Shangrila.screenWidth - 1300 ) / 2 );
    }
    else {
      rightPos = 0;
    }

    container.css({'right': rightPos});
  },

  resetLoginFlyout: function() {
    $('.login-flyout-trigger').removeClass('active');
    $('.login-flyout-trigger').next().removeClass('remove');
    $('.login-flyout').removeAttr('style');

    /*  following condition should be checked along with logged in/ out status
        to show respective block */
    /*
    if( Shangrila.screenWidth < Shangrila.medium ) {
      $('.member-login-trigger').css('display', 'none'); 
      $('.member-login-mobile').css('display', 'block');
    }
    else {
      $('.member-login-trigger').css('display', 'inline-block');
      $('.member-login-mobile').css('display', 'none'); 
    }*/
  },

  callLogInFlyout: function(){
    var $root = this.root;
    var thisModule = this;

    var container = $('.login-flyout'),
        backToNav = $('.login-flyout .back-btn-container a.back-btn');

    $('.login-flyout-trigger').on('click', function(e){
      var $this = $(this),
          callback;

      e.stopPropagation();
      

      Shangrila.hideElement();
      //container.css({'left': $this.position().left});

      // login flyout position fix - assuming max-width is 1300px.
      thisModule.setLoginFlyoutPosition();
      
      if($root.screenWidth >= $root.medium){

        if(container.css('display') == 'none') {
          $this.addClass('active');
          $this.next().addClass('remove');
          container.slideDown();
        }
        else {
          $this.removeClass('active');
          $this.next().removeClass('remove');
          container.slideUp();
        }

        callback = function() {
          $this.removeClass('active');
          $this.next().removeClass('remove');
          thisModule.resetForm();
        };

        //Shangrila.escapeFlyout(container, callback);
        Shangrila.setEscapeElement(container);
        Shangrila.setEscapeCallback(callback);

      } else {

        callback = function() {
          container.animate({
            left: 0
          });
          $('.primary-nav-wrapper .nav-wraper').animate({
            left:'-100%'
          });
        };

        container.show(400, function(){
          callback();
        });

      }

    });


    backToNav.on('click', function(){
      container.animate({
        left:"100%"
      });
      $('.primary-nav-wrapper .nav-wraper').animate({
        left:0
      });
    });
  },

  memberLogIn: function(){
    var $root = this.root;
    var thisModule = this;
    var flyoutContent;
    if (typeof window.flyoutcontent === 'undefined') {
      return;
    } else {
      flyoutContent = window.flyoutcontent.member;
    }

    $.ajax({
        datatype: "json",
        url: flyoutContent.service.href,
        cache: false,
        xhrFields: { withCredentials: true}
    })
    .done(function (response) {
      if (!response) return;
      if (response.rvt) {
        var rvt = '<input type="hidden" name="__RequestVerificationToken" value="' + response.rvt + '" />';
        var ff = $("#flyoutform");
        if (ff.length > 0) {
          ff.append(rvt);
        }
      }
      if (response.membername) {
        var $login = $('.secondary-nav-wrapper .login-flyout-trigger');
        if ($login.length > 0) {
            var memberHTML = '<a href="javascript:void(0);" title="'+ flyoutContent.loggedintitle +'">' +
                             '<span class="member-name">'+ response.membername +'</span>' +
                             '<span class="member-points"><img src="' + response.gcmemberleveliconpath + '" alt="Redeem Points">' + response.gcpoints + '</span>' +
                             '</a>';
            $login.removeClass('login-flyout-trigger').addClass('member-login-trigger');
            $login.html(memberHTML);

            $('.login-flyout').remove();
            $('.nav-inner-container .login-flyout-trigger').remove();
            $('.join-link').remove();

            var $mobileNavContainer = $('.nav-inner-container .secondary ul');
            

            if ($('.member-login-mobile',$mobileNavContainer).length === 0) {
              var mobileMemberInfo = '<li class="member-login-mobile">'+
                                      '<ul>'+
                                        '<li>'+
                                          '<a href="javascript:void(0);" title="Member Login">'+
                                            '<span class="member-name">'+ response.membername +'</span>'+
                                            '<span class="member-points">'+
                                              '<img src="' + response.gcmemberleveliconpath + '" alt="Redeem Points">' + response.gcpoints + 
                                            '</span>'+
                                          '</a>'+
                                        '</li>'+
                                        '<li><a href="'+ flyoutContent.profile.href +'">'+ flyoutContent.profile.text +'</a></li>'+
                                        '<li><a href="'+ flyoutContent.logout.href +'">'+ flyoutContent.logout.text +'</a></li>'+
                                      '</ul>'+
                                    '</li>';
              $mobileNavContainer.prepend(mobileMemberInfo);  
            }
            
            if ($('.header-container .member-login-flyout').length === 0) {
                var memberFlyoutHTML = '<div class="member-login-flyout">'+
                                            '<div class="member-login-container">'+
                                                '<h2 class="hidden-md hidden-lg">Member Login</h2>'+
                                                '<ul>'+
                                                    '<li><a href="'+ flyoutContent.profile.href +'">'+ flyoutContent.profile.text +'</a></li>'+
                                                    '<li><a href="'+ flyoutContent.logout.href +'">'+ flyoutContent.logout.text +'</a></li>'+
                                                '</ul>'+
                                           ' </div>'+
                                        '</div>';
                $('.header-container').append(memberFlyoutHTML);
            }
        }
        var container = $('.member-login-flyout');
        $('.member-login-trigger').on('click', function(e){
          var $this = $(this),
              callback;
          e.stopPropagation();
          Shangrila.hideElement();
          container.css({'width': $this.outerWidth(), 'left': $this.position().left});
          //container.css({'width': $this.outerWidth()});

          if($root.screenWidth >= $root.medium){

            if(container.css('display') == 'none') {
              $this.addClass('active');
              $this.next().addClass('remove');
              container.slideDown();
            }
            else {
              $this.removeClass('active');
              $this.next().removeClass('remove');
              container.slideUp();
            }

            callback = function() {
              $this.removeClass('active');
              $this.next().removeClass('remove');
              thisModule.resetForm();
            };

            //Shangrila.escapeFlyout(container, callback);
            Shangrila.setEscapeElement(container);
            Shangrila.setEscapeCallback(callback);
          }
        });
      }
    });
  },

  setNavigation: function() {
    var $root = this.root;

    if(Shangrila.screenWidth >= Shangrila.medium){
      $('.primary-nav-wrapper .nav-wraper').removeAttr('style');
      $('.book-hotel-slider').removeAttr('style');
      $('.book-hotel').removeClass('active');
    }
    if($('.mobile-menu').css('display') != 'block') {
      Shangrila.overlayHide();
    }
  },
  
  addRemoveRooms: function(){

    $('.room-block').eq(0).find('.remove-room').addClass('hidden');

    this.roomCounter = 1;
    this.maxAdults = 3;
    this.maxChildren = 2;

    // addRoomBlock
    this.addRoomBlock();
    // removeRoomBlock
    this.removeRoomBlock();

    // incrementNumber
    this.increaseMember();

    // decrementNumber
    this.decreaseMember();
  },

  addRoomBlock: function() {

    var thisModule = this,
        addRoomLink = $('.add-room');

    addRoomLink.on('click', function(e){

      e.preventDefault();
      thisModule.roomCounter++;

      if(thisModule.roomCounter > 5) {
        return;
      }

      var firstClone = $('.room-block').first().clone(true);
      var strRoom;
      if(wa.Language == "en") {
        strRoom = "Room ";
      } else {
        strRoom = "房间 ";
      }

      firstClone.find('h3 span').text(strRoom + thisModule.roomCounter);
      firstClone.find('.remove-room').removeClass('hidden');
      firstClone.find('.form-field.adults input').val('1');
      firstClone.find('.form-field.children input').val('0');

      firstClone.insertBefore(addRoomLink.parent());

      if(thisModule.roomCounter == 5) {
        $('.add-room-cta').addClass('hidden');
      }
    });
  },

  removeRoomBlock: function() {
    var thisModule = this;

    $('.room-addition-block').on('click', '.remove-room', function(e){
      e.stopPropagation();
      if ($(".room-block").length != 1) {
        $(this).parents('.room-block').remove();
        thisModule.roomCounter--;
        thisModule.resetRoomNumber();

        if(thisModule.roomCounter <=5 ) {
          $('.add-room-cta').removeClass('hidden');
        }
      }
    });
  },

  resetForm: function(){
    var thisModule = this;

    //reset the form field data
    $(".book-hotel-container .form-field.adults input[type=text]").val("1");
    $(".book-hotel-container .form-field.children input[type=text]").val("0");
    $(".book-hotel-container .search input[type=text]").val("");

    //reset the total rooms
    $('.book-hotel-container .room-block').not(':first').remove();
    thisModule.roomCounter = 1;

    //reset the calendars data
    Shangrila.calendars.checkIncheckOut();

  },

  increaseMember: function() {
    var thisModule = this,
        addMemberHandler = $('.icon-plus');

    addMemberHandler.on('click', function(){
      var $this = $(this),
          $input = $this.parent().find('input'),
          $inputValue = parseInt($input.val());

      if($this.parents('.form-field').hasClass('adults') && $inputValue < thisModule.maxAdults) {
        $input.val($inputValue+1);
      }
      else if($this.parents('.form-field').hasClass('children') && $inputValue < thisModule.maxChildren) {
        $input.val($inputValue+1);
      }
      else {
        return;
      }
    });
  },

  decreaseMember: function() {
    var thisModule = this,
        removeMemberHandler = $('.icon-minus');

    removeMemberHandler.on('click', function(e) {
      var $this = $(this),
          $input = $this.parent().find('input'),
          $inputValue = parseInt($input.val());

      if($this.parents('.form-field').hasClass('adults') && $inputValue > 1) {
        $input.val($inputValue-1);
      }
      else if($this.parents('.form-field').hasClass('children') && $inputValue > 0) {
        $input.val($inputValue-1);
      }
      else {
        return;
      }
    });
  },

  resetRoomNumber: function() {
    var roomBlock = $('.room-block');

    roomBlock.each(function(i, v) {
      var idx = i+1;
      var strRoom;
      if(wa.Language == "en") {
        strRoom = "Room ";
      } else {
        strRoom = "房间 ";
      }
      $(this).find('h3 span').text(strRoom + idx);
    });
  },

  viewportChange: function() {
    var isAndroid = navigator.userAgent.match(/Android/g) ? true : false;

    this.setNavigation();

    if(isAndroid === false ){
      this.resetLoginFlyout();
      $('.common-overlay').hide();
      $('.nav-wraper').removeAttr('style');
    }

    this.setLoginFlyoutPosition();
  }

};

Shangrila.modules.push('header');

/* Module - Header - Ends */