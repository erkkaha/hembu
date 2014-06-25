Meteor.publish('notices', function () {
  return Notices.find({},{sort:{postedAt:-1}});
});

Meteor.publish('boards', function (args) {
  //TODO publish only boards user has access to
  return Boards.find({addressId: args.address});
});

Meteor.publish('events', function () {
  return Events.find({});
});

Meteor.publish('facilities', function(){
  return Facilities.find({}); 
});

Meteor.publish('addresses', function(){
    var user = Meteor.users.findOne({_id: this.userId},{fields: {'addresses': 1}});
    return Addresses.find({_id:{$in:_.pluck(user.addresses, '_id')}});
});

Meteor.publish("userData", function () {
  if (this.userId) {
        return Meteor.users.find({_id: this.userId},{fields: {'services.google.picture': 1, 'services.facebook.id': 1}})
  } else {
    this.ready();
  }
});