Meteor.publish('notices', function (args) {
  return Notices.find({addressId: args.address},{sort:{pinnedUntil: -1, postedAt:-1}});
});

Meteor.publish('boards', function (args) {
  //TODO publish only boards user has access to
    if(args.address)
      return Boards.find({addressId: args.address._id});
});

Meteor.publish('addresses', function(){
    if (this.userId) {
        var user = Meteor.users.findOne({_id: this.userId},{fields: {'addresses': 1}});
        return Addresses.find({_id:{$in:_.pluck(user.addresses, '_id')}});
    } else {
        this.ready();
    }
});

Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},{fields: 
         {
           'addresses._id':1, 
           'services.google.picture': 1, 
           'services.facebook.id': 1
         }})
  } else {
    this.ready();
  }
});