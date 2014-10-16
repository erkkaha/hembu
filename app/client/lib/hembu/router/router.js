window.Hembu = window.Hembu || {};

Hembu.router = Router;

Hembu.router.configure({
  layoutTemplate: 'layout'
});

//Hembu.router.plugin('loading', {loadingTemplate: 'loading'});

Hembu.router.route('logout', {path:'/logout',
    action:function(){
        Meteor.logout(function(err){
            if(!err)
                Hembu.router.go('login');
        });
    }
});

/**
 * Functionality to check authenticated user and present unauthenticated
 * ones with a login dialog.
 */
 
Hembu.router.onBeforeAction(function(pause){
    if(!Meteor.user()) {
          Hembu.router.go('/welcome');
          pause();
    }
    
}, {except: ['welcome', 'login', 'signup']});

Hembu.router.onStop(function(){
    Hembu.router._previous = Hembu.router.current();
});
Hembu.router.previous = function(){
    return Hembu.router._previous;
};
Hembu.router.back = function(callback){
    var previous = Hembu.router.previous();
    if(previous){
        Hembu.router.go(previous.route.name, previous.params);
        if(callback)
            callback(null);
    }
    else{
        Hembu.router.go('home');
        var err = new Error("No previous route available");
        if(callback)
            callback(err);
        else
            throw err;
    }
};
