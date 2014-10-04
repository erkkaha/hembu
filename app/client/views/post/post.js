var showBoardButtons = false,
	defaultBoardId = '',
	selectedBoardId = '';

Template.post.events({
    'click #back-button': function(event, template){
        Hembu.router.back();
    },
    'click #pin-button': function(event, template){
		event.preventDefault();
        var notice = {
                    headline: template.find("#noticeHeadline").value,
                    content: template.find("#noticeContent").value,
                    pinnedUntil: new Date(),
                    boardId: selectedBoardId,
                    commentsAllowed: true
                }
		
		console.log(notice);
        Hembu.methods.notices.create(notice, function(err, result){
            if(err){
                //TODO
                console.log(err);
            }
            else{
                console.log(result)
                Hembu.router.back();
            }
                
        });
        
    },
	"click .board-button" : function() {
		if(showBoardButtons == true) {
			$('li.board-button.uk-button').css('display', 'none');
			$(event.target).css('display', 'block');
			selectedBoardId = $(event.target).attr('data-board-id');
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

Template.post.boards = function() {
	return Hembu.collections.boards.find();
};

Template.post.rendered = function() {
	
	//set defaultBoardId to Id of first item in board buttons list
	defaultBoardId = selectedBoardId = $('.board-button').attr('data-board-id');
	
	// close the board buttons list when clicking away
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