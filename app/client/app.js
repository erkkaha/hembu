
Feeds = new Meteor.Collection("feeds")
Meteor.subscribe('feeds')

Template.feed.Feeds = function () {
  return Feeds.find({},{sort:{posted:-1}});
};

if (Meteor.isClient) {
}

Template.postFeed.events({
    'click .post, keypress' : function(event, template) {
        if (event.which == 13 || event.keyCode == 13 || event.target.type == "submit") {
            //code to execute here
            var content = template.find('#feedContent').value
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
})