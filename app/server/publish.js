Meteor.publish('feeds', function () {
  return Feeds.find({},{sort:{postedAt:-1}});
});

Meteor.publish('events', function () {
  return Events.find({});
});