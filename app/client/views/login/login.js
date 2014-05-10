Template.login.events({
   'submit #login' : function(event, template){
        event.preventDefault();
        var email = template.find('#login-email').value
        , password = template.find('#login-password').value;

        // TODO value validation

        Meteor.loginWithPassword(email, password, function(err){
            if (err){
                $.UIkit.notify(err.reason, {pos:'top-right'});
            }
            else{
                Router.go('home')
            }
        });
    },
    'click #facebook': function(event, template){
        Meteor.loginWithFacebook({requestPermissions:['email']},function(err){
            if(err)
            {
                $.UIkit.notify(err.reason, {pos:'top-right'});
            }
            else{
                Router.go('home')
            }
        })
    },
    'click #google': function(event, template){
        Meteor.loginWithGoogle({requestPermissions:['email']},function(err){
            if(err)
            {
                $.UIkit.notify(err.reason, {pos:'top-right'});
            }
            else{
                Router.go('home')
            }
        })
    }
});