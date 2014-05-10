Feeds = new Meteor.Collection("feeds");
Meteor.subscribe('feeds');

Template.feed.Feeds = function () {
    return Feeds.find({},{sort:{postedAt:-1}});
};

Template.feed.timeago = function(){
   return this.postedAt.toDateString();
};

Template.feed.events({
    'click .post, keypress' : function(event, template) {
        if (event.which == 13 || event.keyCode == 13 || event.target.type == "submit") {
            //code to execute here
            if(event.target.id.indexOf('comment_') === 0){
                var elem = template.find('#' + event.target.id);
                console.log($(elem).data('feeditem'))
                Meteor.call('addComment', {
                    content: elem.value,
                    feedItem: $(elem).data('feeditem')
                }, function(error, comment){
                    if(!error){
                        elem.value = '';
                    }
                    else{
                        // TODO error hadling
                    }
                });              
            }
            else{
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
            }
                    return false;
        }
        return true;
    }
});