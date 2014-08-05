Template.notice.events({
    'click #back-button': function(event, template){
        Router.back();
    },
    'click .post' : function(event, template) {
        event.preventDefault();
        var elem = template.find('#comment_' + this.notice._id);
        Meteor.call('addComment', {
            content: elem.value,
            noticeId: this.notice._id
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