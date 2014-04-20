Template.login.events({
   'submit #login' : function(event, template){
        event.preventDefault();
        var email = template.find('#login-email').value
        , password = template.find('#login-password').value;

        // TODO value validation

        Meteor.loginWithPassword(email, password, function(err){
            if (err){
                //TODO
                console.log(err)
            }
            else{
                Router.go(Router.current())
            }
        });
        return false; 
    }   
});