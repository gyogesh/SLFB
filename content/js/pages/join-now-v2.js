var countryList = (function ($) {
  var provinces,
      countries,
      select = {
        country: $('.label-country select'),
        state:   $('.label-state select')
      };

  function initialize() {
    bindEvents();

    $(select.state).append('<option value="">N/A</option>');

    if( $(select.country).val() != '') {
      setStatesList( $(select.country).val() );
    }
  };

  function setStatesList(countryCode){
    var self = this,
        lang = ( $('html').attr('lang') ? $('html').attr('lang') :  'en' ),
        urlString = $(select.country).data('provinces');

    urlString = urlString.replace('{country}', countryCode);
    urlString = urlString.replace('{language}', lang);

    $.ajax({
      type: 'get',
      url: urlString,
      dataType: 'json',
      
      success: function(data){
        var states = data;

        $(select.state).html('');

        if( $.isEmptyObject(states) ) {
          $(select.state).append('<option value="">N/A</option>');  
        }
        else {
          $(select.state).append('<option value="">Please Select</option>');   
        }

        for( key in states ){
          $(select.state).append('<option value="' + key + '">' + states[key] + '</option>');
        }

        $(select.state).selectBoxIt('refresh');
        Shangrila.selectBoxit.setSelectWidth();
      }

    });

  };

  function bindEvents(){
    $(select.country).on('change',function(){
      var country = $(this).val();
      setStatesList(country);
    });
  };

  return {
    init: initialize
  };

})(jQuery);

var CaptchaKey = "";
(function loadKey(){
  var url = $('.captcha-holder').data('key');
  $.ajax({
    url: url,
    dataType: 'json',
    success: function(data) {
      CaptchaKey = data.key;
      change_captcha();
    }
  });
})();

function change_captcha(){
  var random = (Math.random() + "").substring(2);
  var $image = $('#Captcha-Image');
  var url = $image.data('getimage')+'?key=' + CaptchaKey + '&profile=register' + '&p=' + random;
  $image.attr("src", url);
}
function resetDropdowns(elementArray) {
  $('select').each(function(i, v) {
    var $this = $(this),
      selectId = $this.attr('id'),
      defaultOption = $this.find('option').eq(0),
      defaultVal = defaultOption.text(),
      selectBoxItEle = $('#' + selectId + 'SelectBoxItText');

    $this.find('option').removeAttr('selected');
    defaultOption.attr('selected', 'selected');
    selectBoxItEle.text(defaultVal);
  });
}
function showEror($field) {
  $($field).closest('.form-field').addClass(errorClass).removeClass(validClass);
  $($field).closest('.form-field-group').addClass(errorClass).removeClass(validClass);
}

function processSuccess(data,$form) {
  var memId = data.gcMembershipId;
  if (data.status == 1) {
    $('.join-golden-circle-pop-up').find('.membership-number > span').text(memId);
    Shangrila.formModules.thankYouJoinCircle();
    $($form)[0].reset();
    resetDropdowns();
    _satellite.track('joinnowsuccess');
  } else if (data.status == 2) {
    showEror($('#txtEmail'));
  } else if (data.status == 5) {
    var dom = $('#txtCaptchaKeyword');
    showEror($('#txtCaptchaKeyword'));
  } else {
    $("#paraAjaxReply").show();
    $("#paraAjaxReply").html("Something went wrong! Please try again later on contact the administrator.");
    $("#paraAjaxReply").focus();
  }
  $("#txtCaptchaKeyword").val("");
  Shangrila.unfreezPage();
}

function getLanguageSpecificMessages(){
  var lang = $('html').attr('lang');
  switch(lang){
    case "zh-Hans":
      return options.messagesCN;
    default:
      return options.messages;
  }
}
// DOB in MM/DD/YYYY for calculating age
function getAge(DOB) {
    var today = new Date();
    var birthDate = new Date(DOB);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1;
    }
    return age;
}
jQuery.validator.addMethod( "validate_dob", function( value, element, options ) {
  var ddlDay = $("#selDD"),
      ddlMonth = $("#selMM"),
      ddlYear = $("#selYYYY");
  if (ddlDay[0].selectedIndex === 0 || ddlMonth[0].selectedIndex === 0 || ddlYear[0].selectedIndex === 0) {
      return false;
  }
  
  var date = new Date();
      date.setFullYear(ddlYear.val(), ddlMonth.val() - 1, ddlDay.val());
  var inputDate = ddlYear.val() + "-" + (ddlMonth.val() - 1) + "-" + ddlDay.val(),
      parsedDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();

  var ndate = new Date();

  if (inputDate != parsedDate) {
      return false;
  }

  //Age should be atleast 18 years
  var age = getAge(ddlMonth.val()+'/'+ddlDay.val()+'/'+ddlYear.val());
  if (age < 18) {
    return false;
  }


  return true;
}, $.validator.format( "Date of Birth is required field" ) );

jQuery.validator.addMethod("strongPassword", function(value, element) {
    // /(^(?=.*\d)[a-zA-Z0-9]{6,}$)/
    // (/^
    // (?=.*\d)                //should contain at least one digit
    // (?=.*[a-z])             //should contain at least one lower case
    // (?=.*[A-Z])             //should contain at least one upper case
    // [a-zA-Z0-9]{8,}         //should contain at least 8 from the mentioned characters
    // $/)
    return this.optional(element) || /(^(?=.*\d)[a-zA-Z0-9]{6,}$)/.test(value);
}, "Password must follow above format");

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

$(document).ready(function(){
  countryList.init();

  $('#Captcha-Refresh').on('click',function(){
    change_captcha();
    $('#txtCaptchaKeyword').val('');
  });

  $('#frmJoinNow').submit(function(e) {
    e.preventDefault();
  }).validate({
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
      Shangrila.freezPage();
      var formData = $(form).serialize();
      $.ajax({
        url: $(form).attr('action'),
        type: 'POST',
        dataType: "json",
        data: formData,
        success: function(data) {
          processSuccess(data,$(form));
          change_captcha();
          Shangrila.unfreezPage();
        },
        error: function(error) {
          change_captcha();
          Shangrila.unfreezPage();
        }
      });
    }
  });
});