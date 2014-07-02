Template.feed.events({
    'click .post' : function(event, template) {
        var elem = template.find('#' + event.target.id);
        console.log($(elem).data('feeditem'))
        Meteor.call('addComment', {
            content: elem.value,
            feedItem: $(elem).data('feeditem')
        }, function(err, comment){
            if(!err){
                elem.value = '';
            }
            else{
                // TODO error hadling
            }
        });              
    }
});