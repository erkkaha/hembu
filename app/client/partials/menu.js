Template.menu.profile = function() {
	if(Meteor.user()) {
		return Meteor.user().profile;
	} else {
		return null;
	}
}
Template.menu.address = function() {
	if(Meteor.user() && Hembu.userHasAddress()) {
		return Hembu.getCurrentAddress().displayAddress;
	} else {
		return '';
	}
}

var userMenuToggle = false;

Template.menu.rendered=function() {
	$('.user-menu-head').on('click', function() {
		userMenuToggle = !userMenuToggle;
		if(userMenuToggle == true) {
			$('ul.user-menu')
				.removeClass('user-menu-closed')
				.addClass('user-menu-open');
		} else {
			$('ul.user-menu')
				.removeClass('user-menu-open')
				.addClass('user-menu-closed');
		}
	});
}