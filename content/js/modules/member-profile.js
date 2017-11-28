/* Module - Member Profile - Starts */
Shangrila.memberProfile = {
 init: function() {
   this.root = Shangrila;  // root object with namespace Shangrila
   $('.manage-profile .button-primary').on('click',function(e){
    e.preventDefault();
    $('span',this).toggleClass('hide');
    $('.menu-bar').toggleClass('visible-lg');
   });
 }
};

Shangrila.modules.push('memberProfile');

/* Module - Member Profile - Ends */
