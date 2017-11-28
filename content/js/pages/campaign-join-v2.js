/**
 * Pulls Verification tokens used for The Table and stores them for use as needed in JS-driven AJAx POSTS
*/
AddAntiForgeryToken = function (data) {
  data.__RequestVerificationToken = $('input[name=__RequestVerificationToken]').val();
  return data;
};

var Registration = {}

/**
 * Registration: Prototype for Registration Modal for potential reuse in the future.
 * @namespace Registration
*/
Registration = function (element) {
  // If this is not instantiated with new, do it right.
  if (this.constructor !== Registration) {
    return new Registration();
  }

  this.init(element);
}

/**
 * Registration.Init: Creates initial Registration element and required variables for use throughout the bound events
 * @method: init
 * @usage: Inside Registration contstructor
 * @useCase: Declares variables for event binding use.
*/
Registration.prototype.init = function (element) {
  var self = this;

  this.el = element;

  // Modal Elements and Data Attributes
  this.form = this.el.parents("form");
  this.action = this.form.attr("action");
  this.tracking = this.form.data('media-tracking');
  this.debug = this.form.data('debug');
  this.fields = this.form.find("input");

  // Additional logic
  this.modal = this.form.parents(".modal");
  this.data = this.form.data("populate");

  if (this.data != "") {
    self.populate()
  }

  self.bind();
};

/**
 * Registration.Bind: Sets up bound events for Registration modal and supplemental data-toggle elements on the page (Activating and deactivating modal)
 * @method: bind
 * @usage: Inside Registration contstructor
*/
Registration.prototype.bind = function () {
  var self = this;

  Foundation.Abide.defaults.patterns['alpha_spaces'] = /^[A-Za-z\s]+$/;
  this.abide = new Foundation.Abide($(this.form));

  this.el.bind("click", function () {
      $('.error-container').addClass('hide');
      if (self.el.attr('disabled') == 'disabled') {
        return false;
      }
      else {
        self.el.attr('disabled', 'disabled');
      }

      if (self.abide.validateForm()) {
          var data = {};
          for (i = 0; i < self.fields.length; i++) {
              data[self.fields[i].name] = $(self.fields[i]).val()
          }

          $.ajax({
              type: "POST",
              url: location.origin + self.action,
              data: data,
              success: function (data) {
                  // Form Attribute that will enable advanced logging
                  if (self.debug === true) {
                      console.log("Promotion Registration Service Response:");
                      console.log(data);
                  }
                  self.el.removeAttr('disabled');

                  // Successful Registration
                  if (data.ResponseCode == 0) {
                      self.removePrimary();
                      self.addSuccess();

                      // Checks Form for tracking ID injected by CMS for media.
                      if (self.tracking != "" || self.tracking != undefined) {
                          _satellite.track(self.tracking);
                      }
                  }
                  // Unsuccessful Registration, Already Registered
                  else if (data.ResponseCode == 1) {
                      self.removePrimary();
                      self.addAlreadyRegistered();
                  }
                  // Successful Registration, However User Still Needs to Verify Account
                  else if (data.ResponseCode == 2) {
                      self.removePrimary();
                      self.addSuccess();
                  }
                  // Communication Error | Perhaps incorrect credentials
                  else if (data.ResponseCode == 3 | data.ResponseCode == 98) {
                      console.error("Promotion Registration Service Unsuccessful")
                      $('.error-container').removeClass('hide');
                  }
                  else {
                      console.error("Promotion Registration Service Unknown Error.");
                      $('.error-container').removeClass('hide');
                  }
              },
              error: function (data) {
                  console.error("Promotion Registration Service Error. 500")
                  $('.error-container').removeClass('hide');
              }
          })
      }
    
  })

  $('[data-togglemodal-anchor]').bind("click", function () {
      self.modal.modal('hide');
      setTimeout(function () {
          window.location.hash = $('[data-togglemodal-anchor]').data('togglemodal-anchor');
      }, 1000);
  })

  this.modal.on('hidden.bs.modal', function (e) {
    self.reset()
  })
}

/**
 * Registration.Populate: Populates Registation field with any text sent via personalized links
 * @method: populate
 * @usage: Inside Registration contstructor
 * @useCase: On pageload, if there are specific fields decrypted/rendered from the controller, they are populated in data attributes attached to the form, so they need to be populated on page load to the form inputs themselves.
*/
Registration.prototype.populate = function () {
  var self = this;
  self.data = self.data.split("||");

  $(self.fields[1]).val(self.data[1]);
  $(self.fields[2]).val(self.data[0]);
}

Registration.prototype.removePrimary = function () {
  $('.form-container-primary').addClass('hide');
  $('.section-heading-primary').addClass('hide');
}

Registration.prototype.addSuccess = function () {
  $('.form-container-success').removeClass('hide');
  $('.section-heading-success').removeClass('hide');
}

Registration.prototype.addAlreadyRegistered = function () {
  $('.form-container-alreadyregistered').removeClass('hide');
  $('.section-heading-alreadyregistered').removeClass('hide');
}

/**
 * Registration.Reset: Resets Registration Modal
 * @method: reset
 * @usage: Inside Registration contstructor
 * @useCase: Resets form and the different containers within the form to standard "on page-load" specs (removes success/failure predefined elements, etc.)
*/
Registration.prototype.reset = function () {
  var self = this;

  $('.section-heading-primary').removeClass('hide');
  $('.form-container-primary').removeClass('hide');

  $('.section-heading-success').addClass('hide');
  $('.form-container-success').addClass('hide');
  $('.section-heading-error').addClass('hide');
  $('.form-container-error').addClass('hide');
  $('.section-heading-alreadyregistered').addClass('hide');
  $('.form-container-alreadyregistered').addClass('hide');

  $('.error-container').addClass('hide');

}

/**
 * Registration Constructor: The Registration constructor is created by binding to [data-registration] attributes in the DOM
*/
var registration_forms = $('[data-registration]');
for (var i = 0; i < registration_forms.length; i++) {
  new Registration($(registration_forms[i]));
}

(function (TheTable, $) {
  TheTable.Forms = TheTable.Forms || {};

  TheTable.Forms.registrations = {
    init: function () { }
  };

  $(function () {
    TheTable.Forms.registrations.init();
  });
})(window.TheTable = window.TheTable || {}, jQuery);


(function (TheTable, $) {
  TheTable.Helpers = TheTable.Helpers || {};

  TheTable.Helpers = {
    getParameterByName: function (name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
  };

})(window.TheTable = window.TheTable || {}, jQuery);
