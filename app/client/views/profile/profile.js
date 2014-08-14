Template.profile.name = function(){
    var user = Meteor.user();
    if(user){
     if (user.profile && user.profile.name)
        return user.profile.name;
     return user.emails[0].address;
    }
};
Template.layout.events({
    'click #logout' : function(event, template){
        Meteor.logout();
    }
});