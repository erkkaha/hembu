Meteor.publish('feeds', function () {
  return Feeds.find({},{sort:{postedAt:-1}});
});

Meteor.publish('events', function () {
  return Events.find({});
});

Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},
                             {fields: {'services.google.picture': 1, 'services.facebook.id': 1}});
  } else {
    this.ready();
  }
});