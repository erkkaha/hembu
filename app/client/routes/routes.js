Hembu.router.route('landing', {path:'/landing'});
Hembu.router.route('test_report', {path:'/test_report'});

Hembu.router.route('login', {path:'/login'});
Hembu.router.route('signup', {path:'/signup'});

Hembu.router.route('welcome', {path:'/welcome'});

RootController = Hembu.controllers.RootController;
Hembu.router.route('root', {path:'/', controller: 'RootController'});

Hembu.router.route('home', {path:'/:addressParam'});
/** 
 * Route map for the application
 
Router.map(function() {
    
    
    //write route has to be before view route due id param stuff!
    this.route('writeNotice', {path: '/home/:addressParam/:boardParam?/write', layoutTemplate: 'blank', 
        waitOn: function() {
             Hembu.setCurrentAddress(this.params.addressParam); 
             return Meteor.subscribe('userData');
         },
 		action: function(){
             this.render();
         }
 	});
    this.route('notice', {path:'/home/:addressParam/:boardParam/:_id', layoutTemplate: 'blank', 
        waitOn: function() {
            Hembu.setCurrentAddress(this.params.addressParam); 
            return Meteor.subscribe('userData');
        },
        data:function(){
            if(this.ready()){
                var board = Boards.findOne({name:this.params.boardParam})
                var notice = Notices.findOne({_id:this.params._id})
                var address = Hembu.getCurrentAddress();
                return {
                    address:address,
                    board: board,
                    notice:notice,
                    addressParam: address.address,
                    boardParam: board === undefined ? 'notice' : board.name
                };
            }
        },
        action: function(){
            this.render();
        }
    });
    this.route('facilitiesCreate', {path: '/facilities/:addressParam/new/create', template:'facilitiesCreate', layoutTemplate: 'layout'});
    this.route('facilitiesList', {path: '/facilities/:addressParam/', template:'facilitiesList', layoutTemplate: 'layout', 
        data:function(){
            return {address: this.params.address, facilities : Facilities.find({address:this.params.address}).fetch()};
        },
        action: function(){
            this.render();
        }
    });
    this.route('facilitiesCalendar', {path: '/facilities/:addressParam/:_id/calendar', template:'facilitiesCalendar', layoutTemplate: 'layout'});
    this.route('addressesCreate',{path:'/home/:addressParam/create', template:'addressesCreate', layoutTemplate: 'layout'})
    this.route('profile', {path: '/profile', layoutTemplate: 'layout'});
    
    
    
});
*/
