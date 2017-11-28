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

function validateDOB(){
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
}

jQuery.validator.addMethod( "required_email_or_dob", function( value, element, options ) {
  var $email = $.trim($('#txtEmail').val());
  var isValidDOB = validateDOB();
  var isValidEmail = ($email !== '' && $email !== null) ? true : false;
  if (isValidDOB || isValidEmail) {
    return true;
  } else {
    return false;
  }
}, $.validator.format( "Email Or Date of Birth is required field" ) );

$(document).ready(function(){
  $('#Captcha-Refresh').on('click',function(){
    change_captcha();
    $('#txtCaptchaKeyword').val('');
  });
  $('#frmActivateAccount').validate({
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
    },
    unhighlight: function(element, errorClass, validClass) {
      $(element).closest('.form-field').removeClass(errorClass).addClass(validClass);
      $(element).closest('.form-field-group').removeClass(errorClass).addClass(validClass);
      $(element).closest('.form-field-group').find('.form-field').removeClass(errorClass).addClass(validClass);
      $(element.form).find("label[for=" + element.id + "]").removeClass(errorClass);
    },
    submitHandler: function(form) {
      $(form).submit();
    }
  });
});