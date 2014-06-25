Template.writeNotice.events({
    'click #back-button': function(event, template){
        Router.back();
    },
    'click #foobar': function(event, template){
        var notice = {
                    headline: 'headline',
                    content: 'content',
                    pinnedUntil: new Date(),
                    boardId: 'board',
                    commentsAllowed: true
                }
        Hembu.notice.create(notice, function(err, result){
            if(err){
                //TODO
            }
            else{
                Router.back();
            }
                
        });
        
    }
});