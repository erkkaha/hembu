window.Hembu = window.Hembu || {};
window.Hembu.controllers = window.Hembu.controllers || {};


Hembu.controllers.HomeController = BaseController.extend({
  onBeforeAction:function(pause){
    if(this.ready()){
      if(!this.params.address){
        Hembu.router.go('home', {address:Hembu.methods.address.current.display()});
        pause();
      }
    }
  },
  data:function(){
            if(this.ready()){
                var data = {}
                if(this.params.board){
                    data.board = Hembu.collections.boards.findOne({name:this.params.board});
                    data.notices =  Hembu.collections.notices.find({
                                        boardId:data.board._id},
                                        {sort:{pinnedUntil: -1, postedAt:-1}
                                    }).fetch();
                }
                else{
                    data.notices = Hembu.collections.notices.find({},{sort:{pinnedUntil: -1, postedAt:-1}}).fetch();
                }
                if(this.params.notice){
                    data.notice = Hembu.collections.notices.findOne({_id:this.params.notice});
                }
                
                data.address = Hembu.methods.address.current.get();
                return data;
            }
        }
});

HomeController = Hembu.controllers.HomeController;

Hembu.controllers.BlankHomeController = Hembu.controllers.HomeController.extend({
  layoutTemplate: 'layout'
});

BlankHomeController = Hembu.controllers.BlankHomeController;
