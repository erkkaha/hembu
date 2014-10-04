Template.login.events({
   'submit #login' : function(event, template){
        event.preventDefault();
        var email = template.find('#login-email').value, password = template.find('#login-password').value;

        // TODO value validation

        Hembu.methods.login.password(login, function(err){
            if(!err){
                Router.go('home');
            }
        });
    },
    'click #facebook': function(event, template){
        Hembu.methods.login.facebook(function(err){
            if(!err){
                Router.go('home');
            }
        });
    },
    'click #google': function(event, template){
        Hembu.methods.login.google(function(err){
            if(!err){
                Router.go('home');
            }
        });
    }
});