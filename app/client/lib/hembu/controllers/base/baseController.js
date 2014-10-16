BaseController = RouteController.extend({
  layoutTemplate: 'loggedin',
  waitOn: function () { 
      var wait =[Meteor.subscribe('userData'), Meteor.subscribe('addresses')];
      if(Hembu.methods.address.current.get()){
          wait.push(Meteor.subscribe("boards", {address : Hembu.methods.address.current.get()._id}));
          wait.push(Meteor.subscribe("notices", {address : Hembu.methods.address.current.get()._id}));
      }
    return wait;
  },
  action: function () {
    if (this.ready())
      this.render();
    else
      this.render('Loading');
  }
});