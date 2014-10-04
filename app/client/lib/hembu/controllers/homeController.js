window.Hembu = window.Hembu || {};
window.Hembu.controllers = window.Hembu.controllers || {};


Hembu.controllers.HomeController = BaseController.extend({
   data:function(){
            if(this.ready()){
                var board = Boards.findOne({name:this.params.boardParam})
                var notices = board === undefined ? Notices.find({},{sort:{pinnedUntil: -1, postedAt:-1}}).fetch() : Notices.find({boardId:board._id},{sort:{pinnedUntil: -1, postedAt:-1}}).fetch();
                var address = Hembu.getCurrentAddress();
                return {
                    address:address,
                    board: board,
                    notices:notices,
                    addressParam: address.address,
                    boardParam: board === undefined ? 'notice' : board.name
                };
            }
        },
    action: function(){
        Hembu.setCurrentAddress(this.params.addressParam);
        this.render();
    }
});