/** 
 * Route map for the application
 */ 
Router.map(function() {
    this.route('home', {path:'/', layoutTemplate: 'layout'});
    this.route('calendar', {path: '/cal', layoutTemplate: 'layout'});
    this.route('login', {path: '/login', layoutTemplate: 'layout'});
    this.route('logout', {path: '/logout', action: function(){
        Meteor.logout(function(err){
            if(!err)
                Router.go('login')
        })
    }});
    this.route('signup', {path: '/signup', layoutTemplate: 'layout'});
});

/**
 * Functionality to check authenticated user and present unauthenticated
 * ones with a login dialog.
*/
Router.onBeforeAction(function(){
    if (!(Meteor.loggingIn() || Meteor.user())) {
          this.redirect('login');
          this.pause();
    }
}, {except: ['login', 'signup']});
