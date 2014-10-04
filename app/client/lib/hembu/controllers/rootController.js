window.Hembu = window.Hembu || {};
window.Hembu.controllers = window.Hembu.controllers || {};


Hembu.controllers.RootController = BaseController.extend({
    layoutTemplate: 'loggedin',
    action:function(){
        if(this.ready()){
            if(!Hembu.user.hasAddress)
                this.render('login')
                //Hembu.router.go('addressesCreate', {addressParam:'new'});
            else
                this.render('home')
                //Hembu.router.go('home', {addressParam: Hembu.methods.address.current.get()});
        }
    }
});