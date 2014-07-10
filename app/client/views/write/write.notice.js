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
        
    },
	"click .board-button" : function() {
		if(showBoardButtons == true) {
			$('li.board-button.uk-button').css('display', 'none');
			$(event.target).css('display', 'block');
			$('ul#board-buttons')
				.removeClass('board-buttons-open')
				.addClass('board-buttons-closed');
			showBoardButtons = false;
		} else {
			showBoardButtons = !showBoardButtons;
			if(showBoardButtons == true) {
				$('li.board-button.uk-button').css('display', 'block');
				$('ul#board-buttons')
					.removeClass('board-buttons-closed')
					.addClass('board-buttons-open');
			}
		}
	}
	
});

Template.writeNotice.boards = function() {
	return Boards.find();
};

var showBoardButtons = false;

Template.writeNotice.rendered = function() {
	$(document).mouseup(function (e)
	{
		var container = $('#board-buttons');
	
		if (!container.is(e.target) // if the target of the click isn't the container...
			&& container.has(e.target).length === 0
			&& showBoardButtons == true) // ... nor a descendant of the container
		{
			$('ul#board-buttons')
				.removeClass('board-buttons-open')
				.addClass('board-buttons-closed');
			showBoardButtons = false;
		}
	});
}