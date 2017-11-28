/* PACKAGE CALCULATIONS AND VALIDATIONS */
var VALIDATOR;
var redeemPackage = (function ($) {
  var package = {
    header:              $('.package-header'),
    body:                $('.package-body'),
    footer:              $('.package-footer'),
    admits:              $('.package-container .admit-qty'),
    price:               $('.price-container .price'),
    priceinput:          $('.price-container input[type="hidden"]'),
    quantity:            $('.quantity-container select'),
  },
  calc = {
    container:           $('.gc-calculator-container'),
    pointsneeded:        $('.gc-needed-container .points'),
    pointsneededinput:   $('.gc-needed-container input[type="hidden"]'),
    pointsbalance:       $('.gc-balance-container .points'),
    pointsbalanceinput:  $('.gc-balance-container input[type="hidden"]'),
    info:                $('.gc-calculator-container .info'),
    error:               $('.gc-calculator-container .error-message'),
    attendeecontainer:   $('.redeem-package .attendiees-container')
  };
  attendeeTemplate;

  function formattedNumber(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  function initialize() {
    _.templateSettings = {interpolate: /\{\{(.+?)\}\}/g};
    attendeeTemplate = _.template($('#attendeeTemplate').html());
    bindEvents();
  };

  function bindEvents(){
    $(package.quantity).on('change',function(e){
      var quantity = $(this).find('option:selected').val();
      // if (/\bSilk\b/.test(navigator.userAgent)) {
      // }
      // $('.selected-qty').text(quantity);
      addremoveAttendies(quantity);
      gcPointsNeeded(quantity);
    });
  };
  function gcPointsNeeded (quantity) {
    // Formula for GC Points Needed is Price * Quantity
    var price = $(package.priceinput).val()*quantity;
    var formattedPrice = formattedNumber(price);
    var balance = $(calc.pointsbalanceinput).val();

    //(price > balance) ? $(calc.error).removeClass('hide') : $(calc.error).addClass('hide');

    if( price > balance ) {
      calc.error.removeClass('hide');
      calc.info.addClass('hide');
      calc.attendeecontainer.addClass('hide');
    }
    else {
      calc.error.addClass('hide');
      calc.info.removeClass('hide');
      calc.attendeecontainer.removeClass('hide');
      Shangrila.selectBoxit.setSelectWidth();
    }


    $(calc.pointsneeded).text(formattedPrice);
    $(calc.pointsneededinput).val(price);
  };
  function addremoveAttendies(quantity) {
    if (!VALIDATOR.element($(package.quantity))) return;
    var attendeeCount = getAttendeeCalculation(quantity),
    attendiesLength = $('.attendee-body .others').length,
    num = attendeeCount - attendiesLength;
    if (num === 0) return;
    if (attendiesLength < attendeeCount) {
      //add attendies
      for (var i = attendiesLength; i < attendiesLength + num; i++) {
        var data = {};
            data.selTitle = 'selTitle-'+i;
            data.txtSurname = 'txtSurname-'+i;
            data.txtFirstName = 'txtFirstName-'+i;
            data.txtSpecialRequest = 'txtSpecialRequest-'+i;
        addAttendee(data);
      }
    } else {
      // remove attendies
      var posNum = (num < 0) ? num * -1 : num;
      for (var i = 0; i < posNum; i++) {
        removeAttendee();
      }
    }
  };

  function getAttendeeCalculation(inputval) {
    //Formula for adding attendies is package admit (number) * Quantity - 1(primary member)
    return parseInt($(package.admits).text())*inputval - 1;
  };

  function addAttendee(data){
    var attendee = attendeeTemplate(data);
    $('.attendee-body').append(attendee);
    $('.attendee.primary').addClass('pull-left');
    $('.attendee.others').each(function(index){ if(index>0){$(this).find('.heading').remove();} });
    // Add validations to addded fields.
    var $elTitle = $('#'+data.selTitle), 
        titleMessage = $elTitle.closest('.form-field').find('.error-message').text(),
        $elSurname = $('#'+data.txtSurname), 
        surnameMessage = $elSurname.closest('.form-field').find('.error-message').text(),
        $elFirstname = $('#'+data.txtFirstName), 
        firstnameMessage = $elFirstname.closest('.form-field').find('.error-message').text();

    Shangrila.selectBoxit.init();

    $elTitle.rules('add',
      {
        required:true,
        messages:{
          required: titleMessage
        }
      });
    $elSurname.rules('add',
      {
        required:true,
        messages:{
          required: surnameMessage
        }
      });
    $elFirstname.rules('add',{
      required:true,
      messages:{
        required: firstnameMessage
      }
    });
  };

  function removeAttendee() {
    var $lastAttendee = $('.attendee.others:last-child');
    // $('select',$lastAttendee).rules('remove');
    // $('input',$lastAttendee).rules('remove');
    $lastAttendee.remove();
    if ($('.attendee-body .others').length === 0){
      $('.attendee.primary').removeClass('pull-left');
    }
  };

  function isValid(){
    var flag = true;
    $('.member-gc-profile .error-message').each(function(){
      (!$(this).hasClass('hide')) ? flag = false : flag = true;
    });
    return flag;
  };
  return {
    init: initialize,
    isValid: isValid
  };
})(jQuery);

/* FORM VALIDATIONS and SUBMIT HANDLING */
function getLanguageSpecificMessages(){
  var lang = $('html').attr('lang');
  switch(lang){
    case "zh-Hans":
      return options.messagesCN;
    default:
      return options.messages;
  }
}
jQuery.validator.addMethod("validateMobile", function(value, element, options) {
    var code = ($(options[0], element.form)[0].selectedIndex !== 0) ? true : false;
    var mobilevalue = $.trim($(options[1], element.form).val());
    var mobile = (mobilevalue !== "") ? true : false;
    if(code && mobile) {
      return true;
    } else {
      return false;
    }
}, "Mobile Number is required field");

function processSuccess(data,$form){
  if(data.error.type = 1) {
    handleErrors("package-shortage");
  }
  if(data.error.type = 2) {
    handleErrors("package-full");

  }
};

function handleErrors(typestring){
  switch(typestring) {
    case "package-shortage":
      $('.package-shortage').removeClass('hide');
      $('.package-full').addClass('hide');
    break;
    case "package-full":
      $('.quantity-container select').val(0);
      $('.quantity-container select').trigger('change');
      $('.quantity-container select').closest('.form-field').addClass('error');
      $('.package-full').removeClass('hide');
      $('.package-shortage').addClass('hide');
    break;
  }
};

$(document).ready(function(){
  //https://jsfiddle.net/casiano/LS384/
  VALIDATOR = $('#frmRedeemPackage').validate({
    ignore: [],
    rules: options.rules,
    messages: getLanguageSpecificMessages(),
    errorPlacement: function(error, element) {
      var errorText = $(error).text();
      if ($(element).closest('.form-field-group').length>0){
        $(element).closest('.form-field-group').find('.error-message').text(errorText);
      } else {
        $(element).closest('.form-field').find('.error-message').text(errorText);
      }
    },
    highlight: function(element, errorClass, validClass) {
      $(element).closest('.form-field').addClass(errorClass).removeClass(validClass);
      $(element).closest('.form-field-group').addClass(errorClass).removeClass(validClass);
      $(element.form).find("label[for=" + element.id + "]").addClass(errorClass);

      Shangrila.setPositionOnError();

    },
    unhighlight: function(element, errorClass, validClass) {
      $(element).closest('.form-field').removeClass(errorClass).addClass(validClass);
      $(element).closest('.form-field-group').removeClass(errorClass).addClass(validClass);
      $(element).closest('.form-field-group').find('.form-field').removeClass(errorClass).addClass(validClass);
      $(element.form).find("label[for=" + element.id + "]").removeClass(errorClass);
    },
    submitHandler: function(form) {
      if (!redeemPackage.isValid()) {
        var scrollPosition = $('.member-gc-profile').offset().top - $('header').outerHeight() - 20,
            duration = 400;
        $('html, body').stop().animate({
            scrollTop: scrollPosition
        },duration);
        return false;
      }

      Shangrila.freezPage();
      var formData = $(form).serialize();
      $.ajax({
        url: $(form).attr('action'),
        type: 'POST',
        dataType: "json",
        data: formData,
        success: function(data) {
          processSuccess(data,$(form));
          Shangrila.unfreezPage();
        },
        error: function(error) {
          Shangrila.unfreezPage();
        }
      });
    }
  });

  redeemPackage.init();
});