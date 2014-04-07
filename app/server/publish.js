Meteor.publish('feeds', function () {
  return Feeds.find({},{sort:{posted:-1}});
});