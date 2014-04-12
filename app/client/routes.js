/** 
 * Route map for the application
 */ 
Router.map(function() {
  this.route('feed', {path:'/'});
  this.route('login', {path: '/login', layoutTemplate: 'layout'});
  this.route('signup', {path: '/signup', layoutTemplate: 'layout', action: function(){
    if (Meteor.user()) {
        this.redirect('/');
    }  
  }});
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
}, {except: ['login', 'signup']});

/**
 * Content loading animation
 */
Router.onBeforeAction(function(){
    // for existing content
    $('#content').hide();
});
Router.onAfterAction(function(){
    // for new content
     $('#content').fadeIn();
});