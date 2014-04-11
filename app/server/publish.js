Meteor.publish('feeds', function () {
  return Feeds.find({},{sort:{postedAt:-1}});
});