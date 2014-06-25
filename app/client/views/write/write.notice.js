Template.writeNotice.events({
    'click #back-button': function(event, template){
        Router.back();
    },
    'click #pin-button': function(event, template){
		event.preventDefault();
        var notice = {
                    headline: template.find("#noticeHeadline").value,
                    content: template.find("#noticeContent").value,
                    pinnedUntil: new Date(),
                    boardId: 'yihvGAThSgJ7qYtdj',
                    commentsAllowed: true
                }
		
		console.log(notice);
        Hembu.notices.create(notice, function(err, result){
            if(err){
                //TODO
            }
            else{
                Router.back();
            }
                
        });
        
    }
});