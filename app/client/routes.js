/** 
 * Route map for the application
 */ 
Router.map(function() {
  this.route('login', {path: '/'});
  this.route('signup');
});

/**
 * Functionality to check authenticated user and present unauthenticated
 * ones with a login dialog.
*/
Router.onBeforeAction(function(){
    if (!(Meteor.loggingIn() || Meteor.user())) {
          this.render('login');
          this.pause();
    }
}, {only: ['signup', 'bar']});