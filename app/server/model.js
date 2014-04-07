Feeds = new Meteor.Collection("feeds")


Meteor.methods({
  postFeed: function (options) {
    options = options || {};
    if (! (typeof options.content === "string" && options.content.length ))
      throw new Meteor.Error(400, "Required parameter missing");
    //if (! this.userId)
      //throw new Meteor.Error(403, "You must be logged in");

    return Feeds.insert({
      owner: this.userId,
      content: options.content,
      posted: new Date()
    });
  }
});