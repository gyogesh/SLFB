function getLanguageSpecificMessages(){
  var lang = $('html').attr('lang');
  switch(lang){
    case "zh-Hans":
      return options.messagesCN;
    default:
      return options.messages;
  }
}

$(document).ready(function(){
  $('#frmLogin').validate({
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
      $('.col-left').removeClass('error');
    }
  });
});