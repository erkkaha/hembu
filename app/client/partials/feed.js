Template.feed.timeago = function(){
   return this.postedAt.toDateString();
};

Template.feed.pinnedClass = function(){
    return this.pinned ? 'pinned' : 'unpinned';
};

Template.feed.board = function(){
    return Hembu.collections.boards.findOne({_id: this.boardId});
};

Template.feed.boardUrl = function() {
    return Router.url('home', {address:Hembu.methods.address.current.display(), board:this.name});
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
       var params = Hembu.router.current().params
       params.notice = this._id;
       Hembu.router.go('notice', params);
   }, 
   'change .notice-pin':function(event, template){
       Hembu.methods.notices.pin({noticeId:this._id, pinnedUntil:event.target.value}, function(err, result){
            if(err){
                //TODO
            }
            else{
            }
                
        });
   }
})