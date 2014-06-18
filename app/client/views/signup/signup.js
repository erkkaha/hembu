Template.signup.events({
   'submit #signup' : function(event, template){
        event.preventDefault();
        var email = template.find('#signup-email').value
        , password = template.find('#signup-password').value;

        // TODO value validation

        Accounts.createUser({email:email, password:password}, function(err){
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