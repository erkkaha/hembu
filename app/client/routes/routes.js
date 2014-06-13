/** 
 * Route map for the application
 */ 
Router.map(function() {
    this.route('root', {path:'/', waitOn:function(){
            return Meteor.subscribe('userData');
        },
        action:function(){
            if(this.ready()){
                if(Meteor.user().addresses === undefined)
                    Router.go('addresses.create', {_id:'new'})
                else
                    Router.go('home', {address: Hembu.getCurrentAddress()._id});
            }
    }});
    this.route('home', {path:'/address/:address', layoutTemplate: 'layout', 
        waitOn:function(){
            return Meteor.subscribe('userData');
        },
        data:function(){
            if(this.ready()){
                return Hembu.getCurrentAddress();
            }
        },
        action: function(){
            this.render();
        }
    });
    this.route('facilities.create', {path: '/address/:address/facilities/new/create', template:'facilitiesCreate', layoutTemplate: 'layout'})
    this.route('facilities.list', {path: '/address/:address/facilities', template:'facilitiesList', layoutTemplate: 'layout', 
        data:function(){
            return {address: this.params.address, facilities : Facilities.find({address:this.params.address}).fetch()};
        },
        action: function(){
            this.render();
        }
    });
    this.route('facilities.calendar', {path: '/address/:address/facilities/:_id/calendar', template:'facilitiesCalendar', layoutTemplate: 'layout'});
    this.route('addresses.create',{path:'/addresses/:address/create', template:'addressesCreate', layoutTemplate: 'layout'})
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

Router.onBeforeAction('loading');
