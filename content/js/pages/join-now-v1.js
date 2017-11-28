var ErrorMessage = {
  CaptchaRequired: "",
  DobRequired: "",
  DobInvalidFormat: "",
  InvalidAge: "",
  EmailRequired: "",
  EmailInvalid: "",
  PasswordRequired: "",
  PasswordInvalid: "",
  TCRequired: "",
  PPRequired: "",
  PhoneRequired: "",
  InvalidPhone: "",
  AreaCodeRequired: "",
  InvalidAreaCode: "",
  EnglishTextRequired: "",
  FirstnameRequired: "",
  LastnameRequired: "",
  NameonCardRequired: "",
  NameonCardEnglishText: "",
  FnameInEnglishText: "",
  LnameInEnglishText: "",
  EmailInEnglishText: "",
  other: "other"
};


$(document).ready(function() {



  var CaptchaKey = "";
  //Captcha Code Starts Here
  load_key();

  // refresh captcha
  $('#Captcha-Refresh').click(function() {

    change_captcha();
    $("#captchaKeyword").val("");
  });


  // NOTE: This Synchronously gets the Captcha key from the CaptchaService
  function load_key() {
    var url = window.location.protocol + "//" + window.location.host + "/" + "services/CaptchaService.svc/OnLoad";

    $.ajax({
      url: url,
      dataType: 'json',
      //async : false,
      success: function(data) {
        CaptchaKey = data.key;
        change_captcha();
      }
    });
  }

  function change_captcha() {
    // Create some random string consisting of numbers to get around possible CDN caching
    var random = (Math.random() + "").substring(2);

    //                var url = window.location.protocol + "//" + window.location.host + "/" + "services/CaptchaService.svc/GetImageTEST?key=" + CaptchaKey + "&KeywordLength=5&upperOnly=false&width=200&height=100&fontName=calibri&fontSize=60&greyScale=false&points=8&degree=0&water=true&wave=15" + "&p=" + random;
    var url = window.location.protocol + "//" + window.location.host + "/" + "services/CaptchaService.svc/GetImage?key=" + CaptchaKey + "&profile=register" + "&p=" + random;

    $("#Captcha-Image").attr("src", url);
  }

  //Captcha Code Ends Here

  $('input').change(function() {
    $(this).closest('.form-field').removeClass('error');
  });


  function valLName() {
    var ret = true;
    var dom = $('#txtLName');
    if (dom.val() === '') {
      dom.closest('.form-field').addClass('error');
      $("#vlastname").text(ErrorMessage.LastnameRequired);
      ret = false;
    } else if (!EnglishTextCheck(dom.val())) {
      dom.closest('.form-field').addClass('error');
      $("#vlastname").text(ErrorMessage.LnameInEnglishText);
      ret = false;
    }

    return ret;
  }

  function valFName() {
    var ret = true;
    var dom = $('#txtFName');
    if (dom.val() === '') {
      dom.closest('.form-field').addClass('error');
      $("#vfirstname").text(ErrorMessage.FirstnameRequired);
      ret = false;
    } else if (!EnglishTextCheck(dom.val())) {
      dom.closest('.form-field').addClass('error');
      $("#vfirstname").text(ErrorMessage.FnameInEnglishText);
      ret = false;
    }
    return ret;
  }

  function valNameonCard() {
    var ret = true;
    var dom = $('#txtNameonCard');
    if (dom.val() === '') {
      dom.closest('.form-field').addClass('error');
      $("#vcardname").text(ErrorMessage.NameonCardRequired);
      ret = false;
    } else if (!EnglishTextCheck(dom.val())) {
      dom.closest('.form-field').addClass('error');
      $("#vcardname").text(ErrorMessage.NameonCardEnglishText);
      ret = false;
    }
    return ret;
  }

  function valDob() {
    var dom = $('#txtDob');

    var from = dom.val().split("/");
    var date = new Date(from[2], from[1] - 1, from[0]);
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    // var today = dd + '/' + mm + '/' + yyyy;
    if (dom.val() === '') {
      dom.closest('.form-field').addClass('error');
      $('#vDob').text(ErrorMessage.DobRequired);
      //Date of birth is a required field
      return false;
    }
    if (dom.val().match(/(^(((0[1-9]|1[0-9]|2[0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/) === null) {
      //Invalid Date Of Birth
      $('#vDob').text(ErrorMessage.DobInvalidFormat);
      dom.closest('.form-field').addClass('error');

      return false;
    }

    if (getAge(dom.val()) < 18) {
      $('#vDob').text(ErrorMessage.InvalidAge);
      dom.closest('.form-field').addClass('error');
      return false;
    }
    return true;
  }

  function getAge(dateString) {

    var today = new Date(),
      dateStringArray = dateString.split('/').reverse(),
      birthDate = new Date(dateStringArray.join('/'));

    var age = today.getFullYear() - birthDate.getFullYear(),
      m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  function valEmail() {
    //var pattern = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
    var pattern = new RegExp(/^([A-z0-9-]+)(\.[_A-z0-9-]+)*@([A-z0-9-]+)(\.[A-z0-9-]+)*(\.[A-z]{2,4})$/i);
    var email = $('#txtEmail');
    var reEmail = $('#txtReEmail');
    if (email.val() === '') {

      $('#vEmail').text(ErrorMessage.EmailRequired);
      email.closest('.form-field').addClass('error');

      return false;
    }

    //if (!EnglishTextCheck(email.val()))
    //{
    //    $('#vEmail').text(ErrorMessage.ema);
    //    email.closest('.form-field').addClass('error');
    //    return false;
    //}

    if (!pattern.test($("#txtEmail").val())) {
      $('#vEmail').text(ErrorMessage.EmailInvalid);
      email.closest('.form-field').addClass('error');
      return false;
    }

    if (email.val() != reEmail.val()) {
      reEmail.closest('.form-field').addClass('error');
      return false;
    }



    return true;
  }

  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  function vcaptchaKeyword() {
    var ret = true;
    var dom = $('#captchaKeyword');
    if (dom.val() === '') {
      dom.closest('.form-field').addClass('error');
      $('#vCaptcha').text(ErrorMessage.CaptchaRequired);
      ret = false;
    }
    return ret;
  }

  function areaCodeValid() {

    var ret = true;
    if ($("select[id='selAreaCode'] option:selected").index() === 0) {
      $("#vAreacode").text(ErrorMessage.AreaCodeRequired);
      $('#selAreaCode').closest('.form-field').addClass('error');
      ret = false;
    }
    //var areacode = $('#txtPhoneareacode');
    //var numberexp = new RegExp(/^\d+$/);
    //if (areacode.val() === '') {
    //    areacode.closest('.form-field').addClass('error');
    //    $("#vAreacode").text(ErrorMessage.AreaCodeRequired);
    //    ret = false;
    //} else if (numberexp.test(areacode.val()) === false)
    //{
    //    areacode.closest('.form-field').addClass('error');
    //    $("#vAreacode").text(ErrorMessage.InvalidAreaCode);
    //    ret = false;
    //}       
    return ret;
  }

  function vPhone() {
    var ret = true;
    var dom = $('#txtPhone');
    var numberexp = new RegExp(/^\d+$/);
    if (dom.val() === '') {
      dom.closest('.form-field').addClass('error');
      $("#vPhone").text(ErrorMessage.PhoneRequired);
      ret = false;
    } else if (numberexp.test(dom.val()) === false) {
      dom.closest('.form-field').addClass('error');
      $("#vPhone").text(ErrorMessage.InvalidPhone);
      ret = false;
    }
    return ret;

  }

  function vPassword() {
    var psw = $('#txtPsw');
    var rePsw = $('#txtRePsw');

    var objPasswordFormat1 = /^[a-zA-Z0-9]{6,}$/;
    var objPasswordFormat2 = /[A-z]/;
    var objPasswordFormat3 = /[0-9]/;
    var passwordInvalid = false;

    if (psw.val() === '') {
      psw.closest('.form-field').addClass('error');
      $('#vPsw').text(ErrorMessage.PasswordRequired);
      return false;
    }

    if (objPasswordFormat1.test(psw.val()) !== true) {
      passwordInvalid = true;
    } else if (objPasswordFormat2.test(psw.val()) !== true) {
      passwordInvalid = true;
    } else if (objPasswordFormat3.test(psw.val()) !== true) {
      passwordInvalid = true;
    }

    if (passwordInvalid) {
      psw.closest('.form-field').addClass('error');
      $('#vPsw').text(ErrorMessage.PasswordInvalid);
      return false;
    }

    if (psw.val() != rePsw.val()) {
      $('#vRePsw').closest('.form-field').addClass('error');
      return false;
    }

    return true;
  }

  function CheckedTandC() {
    var ret = true;
    if (!$("#chkTC").is(':checked')) {
      $("#chkTC").closest('.form-field').addClass('error');
      ret = false;
    }
    if (!$("#chkPP").is(':checked')) {
      $("#chkPP").closest('.form-field').addClass('error');
      ret = false;
    }

    return ret;
  }
  $("#subForm").click(function() {
    //Shangrila.freezPage();
    //debugger;
    $('.form-field').removeClass('error');
    $("#paraAjaxReply").hide();
    //console.log('2');

    var element = $('#vlastname').parents('.form-field');
    //var joinNowPageID = $('#joinNowPageID').val();
    var lName = valLName();
    var fName = valFName();
    var nameonCard = valNameonCard();
    var dob = valDob();
    var email = valEmail();
    var captchaKeyword = vcaptchaKeyword();
    var areacode = areaCodeValid();
    var phone = vPhone();
    var password = vPassword();
    var tc = CheckedTandC();

    //console.log(joinNowPageID);

    if (lName && fName && nameonCard && dob && email && captchaKeyword && areacode && phone && password && tc) {
      Shangrila.freezPage();
      jsSubmit();
    }

    Shangrila.scrollToElement(element);
  });

  function jsSubmit() {
    var date = new Date($('#txtDob').val());

    var dd = date.getDate();
    var mm = date.getMonth() + 1; //January is 0!

    var yyyy = date.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }

    var RegistrationDetails = {
      "salutation": "" + $('#selTitle').find(":selected").val() + "",
      "firstName": "" + $('#txtFName').val() + "",
      "lastName": "" + $('#txtLName').val() + "",
      "phone": "" + $('#selAreaCode').val() + $('#txtPhone').val() + "",
      "phoneType": "" + $('#selPhoneType').find(":selected").val() + "",
      "password": "" + $('#txtPsw').val() + "",
      "dob": "" + $('#txtDob').val() + "",
      "gender": "" + $("input[name='gender']:checked").val() + "",
      "country": "" + "HK" + "",
      "email": "" + $('#txtEmail').val() + "",
      "gcMemberName": $('#txtNameonCard').val() + "",
      "captchaKeyword": $('#captchaKeyword').val(),
      "captchaKey": CaptchaKey,
      "joinnowpageid": "" + $('#joinNowPageID').val() + ""
    };

    var formData = JSON.stringify(RegistrationDetails);
    var url = window.location.protocol + "//" + window.location.host + "/" + "Services/RegisterService.svc/SubmitRegistrationDetails";
    jQuery.ajax({
      url: url,
      type: 'POST',
      dataType: "json",
      data: formData,
      success: function(data) {
        ShowMessage(data);
        change_captcha();
        Shangrila.unfreezPage();
      },
      error: function(error) {
        change_captcha();
        Shangrila.unfreezPage();
      }
    });
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

  function ShowMessage(data) {
    //console.log(data.gcMembershipId);
    var memId = data.gcMembershipId;

    //$('#spanMemId').html(memId + '*');

    if (data.status == 1) {
      $('.join-golden-circle-pop-up').find('.membership-number > span').text(memId);
      Shangrila.formModules.thankYouJoinCircle();
      $('input[type="text"]').val('');
      $('input[type="password"]').val('');
      $('#chkTC').removeAttr('checked');
      $('#chkPP').removeAttr('checked');
      $('#rdbtnMale').prop('checked', true);
      $('#rdbtnFemale').removeAttr('checked');

      resetDropdowns();
      _satellite.track('joinnowsuccess');
      //$('#selTitle').val('Mr');
      // Shangrila.unfreezPage();
    } else if (data.status == 2) {
      var email = $('#txtEmail');
      $('#vEmail').text('Email already exists');
      email.closest('.form-field').addClass('error');
      email.focus();

    } else if (data.status == 5) {
      var dom = $('#captchaKeyword');

      dom.closest('.form-field').addClass('error');
      $('#vCaptcha').text('Captcha Mismatch');
      dom.focus();
    } else {
      $("#paraAjaxReply").show();
      $("#paraAjaxReply").html("Something went wrong! Please try again later on contact the administrator.");
      $("#paraAjaxReply").focus();
    }

    $("#captchaKeyword").val("");
    Shangrila.unfreezPage();
    //RegistrationSuccess = 1,
    //EmailExists = 2,
    //EmailValidationServiceFailed = 3,
    //RegistrationServiceFailed = 4,
    //CaptchaKeyWordMismatch = 5,
    //CaptchaKeyInvalid = 6,
    //CaptchaUnknownStatus = 7,
    //RegisterUnknownError = 99
  }

  function EnglishTextCheck(text) {
    var pattern = new RegExp(/^[a-zA-Z' -]+$/);
    if (!pattern.test(text)) {
      return false;
    } else {
      return true;
    }
  }

});