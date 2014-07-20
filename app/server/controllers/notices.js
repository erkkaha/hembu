Meteor.methods({
    addNotice: function (options) {
        options = options || {};
        if (!(typeof options.headline === "string" && options.headline.length ))
          throw new Meteor.Error(400, "Notice Headline is missing");
        if (!(typeof options.content === "string" && options.content.length ))
          throw new Meteor.Error(400, "Notice content is missing");
        if (!(typeof options.boardId === "string" && options.boardId.length ))
          throw new Meteor.Error(400, "Notice board is missing");
        if (typeof options.commentsAllowed !== "boolean")
          throw new Meteor.Error(400, "Notice comments allowed is missing");
        if (!this.userId)
          throw new Meteor.Error(403, "You must be logged in");
    
        return Notices.insert({
          author: {
                _id: this.userId,
                name: displayName(Meteor.user())
          },
          headline: options.headline,
          content: options.content,
          pinnedUntil: options.pinnedUntil,
          boardId: options.boardId,
          postedAt: new Date(),
          commentsAllowed: options.commentsAllowed,
          comments: []
        }, function(err, id){
            if(!err){
                //TODO
            }
            else{
                //TODO
            }
        });
    },
    pinNotice: function(options){
        options = options || {};
        if (! this.userId)
            throw new Meteor.Error(403, "You must be logged in");
            
        if (!(typeof options.pinnedUntil === "string" && options.pinnedUntil.length) || !options.noticeId)
            throw new Meteor.Error(400, "Required parameter missing");
        var notice = Notices.findOne(options.noticeId);
        if(!notice)
            throw new Meteor.Error(404, "No such notice found");
        var until = moment(options.pinnedUntil).toDate()// 'YYYY-MM-DD'
        Notices.update(notice._id, { $set: { 
            pinnedUntil: until
        }});
    },
    addComment: function(options){
        options = options || {};
        if (! this.userId)
            throw new Meteor.Error(403, "You must be logged in");
            
        if (!(typeof options.content === "string" && options.content.length) || !options.noticeId)
            throw new Meteor.Error(400, "Required parameter missing");
        var notice = Notices.findOne(options.noticeId);
        if(!notice)
            throw new Meteor.Error(404, "No such notice found");
        Notices.update(notice._id, { $addToSet: { 
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