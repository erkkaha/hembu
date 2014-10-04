BaseController = RouteController.extend({
  layoutTemplate: 'loggedin',
  waitOn: function () { 
    return [Meteor.subscribe('userData'), Meteor.subscribe('addresses')];
  },
  action: function () {
    this.render();
  }
});