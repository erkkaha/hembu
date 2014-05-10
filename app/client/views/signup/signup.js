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
    }
});