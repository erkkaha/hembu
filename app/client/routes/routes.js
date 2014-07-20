/** 
 * Route map for the application
 */ 
Router.map(function() {
    this.route('test_report', {path:'/test_report'})
    this.route('root', {path:'/', waitOn:function(){
            return Meteor.subscribe('userData');
        },
        action:function(){
            if(this.ready()){
                if(!Hembu.userHasAddress)
                    Router.go('addressesCreate', {addressParam:'new'});
                else
                    Router.go('home', {addressParam: Hembu.getCurrentAddress().address});
            }
    }});
    this.route('home', {path:'/home/:addressParam/:boardParam?', layoutTemplate: 'layout', 
        waitOn: function() {
            Hembu.setCurrentAddress(this.params.addressParam); 
            return Meteor.subscribe('userData');
        },
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
            this.render();
        }
    });
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
    this.route('login', {path: '/login', layoutTemplate: 'layout'});
    this.route('logout', {path: '/logout', action: function(){
        Meteor.logout(function(err){
            if(!err)
                Router.go('login');
        });
    }});
    this.route('signup', {path: '/signup', layoutTemplate: 'layout'});
});

/**
 * Functionality to check authenticated user and present unauthenticated
 * ones with a login dialog.
*/
Router.onBeforeAction(function(pause){
    
    if (!(Meteor.loggingIn() || Meteor.user())) {
          Router.go('login');
          pause();
    }
    else{
        if(!Meteor.user())
            pause();
    }
}, {except: ['login', 'signup']});

Router.onStop(function(){
    Router._previous = Router.current();
});
Router.previous = function(){
    return Router._previous;
};
Router.back = function(callback){
    var previous = Router.previous();
    if(previous){
        Router.go(previous.route.name, previous.params);
        if(callback)
            callback(null);
    }
    else{
        Router.go('root');
        var err = new Error("No previous route available");
        if(callback)
            callback(err);
        else
            throw err;
    }
};