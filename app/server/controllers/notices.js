Meteor.methods({
    addNotice: function (options) {
        options = options || {};
        if (!(typeof options.headline === "string" && options.headline.length ))
          throw new Meteor.Error(400, "Notice Headline is missing");
        if (!(typeof options.content === "string" && options.content.length ))
          throw new Meteor.Error(400, "Notice content is missing");
        if (!this.userId)
          throw new Meteor.Error(403, "You must be logged in");
    
        return Notices.insert({
          owner: this.userId,
          author: displayName(Meteor.user()),
          headline: options.headline,
          content: options.content,
          pinnedUntil: options.pinnedUntil,
          boardId: options.board,
          postedAt: new Date(),
          commentsAllowed: options.commentsAllowed,
          comments: []
        }, function(err, id){
            if(!err){
                //TODO
            }
            else{
                console.log(err)
                //TODO
            }
        });
    },
    addComment: function(options){
        options = options || {};
        if (!(typeof options.content === "string" && options.content.length) || !options.feedItem)
            throw new Meteor.Error(400, "Required parameter missing");
        if (! this.userId)
            throw new Meteor.Error(403, "You must be logged in");
        var feed = Feeds.findOne(options.feedItem);
        if(!feed)
            throw new Meteor.Error(404, "No such feed item");
        Notices.update(options.feedItem, { $addToSet: { 
            comments: {
                owner: this.userId,
                author: displayName(Meteor.user()),
                content: options.content,
                postedAt: new Date()
            }
        }});
    }
});

var displayName = function (user) {
  if (user.profile && user.profile.name)
    return user.profile.name;
  return user.emails[0].address;
};