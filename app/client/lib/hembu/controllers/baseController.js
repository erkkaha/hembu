BaseController = RouteController.extend({
  layoutTemplate: 'loggedin',

  waitOn: function () { 
        return Meteor.subscribe('userData');
  },

  action: function () {
    this.render();
  }
});