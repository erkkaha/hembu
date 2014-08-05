Template.feed.timeago = function(){
   return this.postedAt.toDateString();
};

Template.feed.pinnedClass = function(){
    return this.pinned ? 'pinned' : 'unpinned';
};

Template.feed.board = function(){
    return Boards.findOne({_id: this.boardId});
};

Template.feed.boardUrl = function() {
    return Router.url('home', {addressParam:Hembu.getCurrentAddress().address, boardParam:this.name});
};

Template.feed.title = function(){
	if(this.board) {
		return this.board.name;
	} else {
		return "Feed"
	}
};
Template.feed.events({
   'click p.notice-headline':function(event, template){
       var params = Router.current().params
       params.boardParam = params.boardParam === undefined ? 'notice' : params.boardParam
       var board = Boards.findOne({_id: this.boardId}) || {}
       Router.go('notice', {addressParam: params.addressParam, 
       boardParam: board.name === undefined ? 'notice' : board.name, 
       _id: this._id})
   }, 
   'change .notice-pin':function(event, template){
       Hembu.notices.pin({noticeId:this._id, pinnedUntil:event.target.value}, function(err, result){
            if(err){
                //TODO
            }
            else{
            }
                
        });
   }
})