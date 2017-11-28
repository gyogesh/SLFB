Shangrila.user = {
	element: {
		membershipNumber: $('#txtflyooutMembershipNumber'),
		membershipPassword: $('#txtflyoutPassword'),
		flyoutform: $('#flyoutform')
	},
	init: function() {
	    this.root = Shangrila;
	    this.bindEvents();
	},
	checkMembershipNumber: function(){
		var element = this.element;
		if ($.trim($(element.membershipNumber).val()) !== "") {
			$(element.membershipNumber).closest('.form-field').removeClass('error');
			return true;
		} else {
			$(element.membershipNumber).closest('.form-field').addClass('error');
			return false;
		}
	},
	checkMembershipPassword: function(){
		var element = this.element;
		if ($.trim($(element.membershipPassword).val()) !== "") {
			$(element.membershipPassword).closest('.form-field').removeClass('error');
			return true;
		} else {
			$(element.membershipPassword).closest('.form-field').addClass('error');
			return false;
		}
	},
	bindEvents: function(){
		var self = this,
		 	element = this.element;
		$(element.membershipNumber).on('blur',function(){
			self.checkMembershipNumber();
		});
		$(element.membershipPassword).on('blur',function(){
			self.checkMembershipPassword();
		});
		$(element.flyoutform).on('submit', function(e){
			var membershipNumber = self.checkMembershipNumber();
			var membershipPassword = self.checkMembershipPassword();
			if (membershipNumber && membershipPassword) {
				return true;
			} else {
				return false;
			}
		});
	}
};
Shangrila.modules.push('user');