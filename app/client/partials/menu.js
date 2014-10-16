Template.menu.profile = function() {
		return Hembu.user.profile;
};
Template.menu.address = function() {
		return Hembu.methods.address.current.get().url;
};

Template.menu.addresses = function() {
		return Hembu.collections.addresses.find();
};

Template.menu.boards = function() {
	  return Hembu.collections.boards.find();
};

Template.menu.boardUrl = function() {
    return Router.url('home', {address: Hembu.methods.address.current.display(), board:this.name});
};
Template.menu.postUrl = function() {
    if( Hembu.collections.boards.findOne({isDefault:true})){
        var params = Hembu.router.current().params;
        params.board = params.board ? params.board : Hembu.collections.boards.findOne({isDefault:true}).name;
        return Router.url('post', params);
    }
};

Template.menu.events({
   'click .uk-nav-offcanvas > li > a': function(event, template){
       $.UIkit.offcanvas.hide();
   },
    'click .menu-item-address': function(event, templace){
        Hembu.methods.address.current.set(this.display);
        Hembu.router.go('home');
    },
    'click ul.user-menu li': function(event, templace){
        Template.menu.toggleUserMenu(false);
    }
});

var userMenuToggle = false;
Template.menu.toggleUserMenu = function(e, show){
        userMenuToggle = !userMenuToggle;
        if(show !== undefined){
            userMenuToggle = show;
        }
		if(userMenuToggle === true) {
			$('ul.user-menu')
				.removeClass('user-menu-closed')
				.addClass('user-menu-open');
            $('body').on('click', function(e){
                if(!$.contains(document.getElementsByClassName('header-user-menu')[0], e.target)){
                    Template.menu.toggleUserMenu(false);
                    $('body').off('click');
                }
            });
            
		} 
        else {
			$('ul.user-menu')
				.removeClass('user-menu-open')
				.addClass('user-menu-closed');
		}
}

Template.menu.rendered=function() {
	$('.user-menu-head').on('click', Template.menu.toggleUserMenu);
}