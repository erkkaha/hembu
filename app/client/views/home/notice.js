Template.notice.events({
    'click #back-button': function(event, template){
        Hembu.router.back();
    },
    'click .post' : function(event, template) {
        event.preventDefault();
        var elem = template.find('#comment_' + this.notice._id);
        Hembu.methods.notices.comment({content: elem.value, notice: this.notice}, function(err, comment){
            if(err){
                console.log(err);    
            }
            else{
                elem.value = '';
            }
        });   
    }
});