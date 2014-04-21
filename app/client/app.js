Template.layout.events({
    'click #logout' : function(event, template){
        Meteor.logout();
    }
});