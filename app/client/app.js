
Feeds = new Meteor.Collection("feeds");
Meteor.subscribe('feeds');

Template.feed.Feeds = function () {
    return Feeds.find({},{sort:{postedAt:-1}});
};

Template.feed.comment = function(){
    return this.showComment;
};

Template.feed.events({
    'click .showComment' : function(event, template){
        event.preventDefault();
        $(event.target).hide();
        $('#comment_' + this._id).show();
    }
});

Template.feed.timeago = function(){
   return this.postedAt.toDateString();
};


Template.postFeed.events({
    'click .post, keypress' : function(event, template) {
        if (event.which == 13 || event.keyCode == 13 || event.target.type == "submit") {
            //code to execute here
            var content = template.find('#feedContent').value;
            Meteor.call('postFeed', {
                content: content
              }, function (error, feedItem) {
                if (! error) {
                     template.find('#feedContent').value = '';
                }
                else{
                    //TODO
                }
            });
                    return false;
        }
        return true;
    }
});