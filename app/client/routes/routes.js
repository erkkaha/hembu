/** 
 * Route map for the application
 */ 
Router.map(function() {
    this.route('root', {path:'/', waitOn:function(){
            return Meteor.subscribe('userData');
        },
        action:function(){
            if(this.ready()){
                if(!Hembu.userHasAddress)
                    Router.go('addressesCreate', {address:'new'});
                else
                    Router.go('home', {address: Hembu.getCurrentAddress().address});
            }
    }});
    this.route('home', {path:'/home/:address/:board?', layoutTemplate: 'layout', 
        waitOn: function() {
            Hembu.setCurrentAddress(this.params.address); 
            return Meteor.subscribe('userData');
        },
        data:function(){
            if(this.ready()){
                var board = Boards.findOne({name:this.params.board})
                return {
                    address:Hembu.getCurrentAddress(),
                    board: board,
                    notices:Notices.find({boardId:board._id},{sort:{postedAt:-1}}).fetch()
                };
            }
        },
        action: function(){
            this.render();
        }
    });
    this.route('facilitiesCreate', {path: '/facilities/:address/new/create', template:'facilitiesCreate', layoutTemplate: 'layout'});
	this.route('writeNotice', {path: '/write', layoutTemplate: 'blank'});
    this.route('facilitiesList', {path: '/facilities/:address/', template:'facilitiesList', layoutTemplate: 'layout', 
        data:function(){
            return {address: this.params.address, facilities : Facilities.find({address:this.params.address}).fetch()};
        },
        action: function(){
            this.render();
        }
    });
    this.route('facilitiesCalendar', {path: '/facilities/:address/:_id/calendar', template:'facilitiesCalendar', layoutTemplate: 'layout'});
    this.route('addressesCreate',{path:'/home/:address/create', template:'addressesCreate', layoutTemplate: 'layout'})
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
        var err = new Error("No previous route available");
        if(callback)
            callback();
        else
            throw err;
    }
};