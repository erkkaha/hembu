Template.signup.events({
   'submit #signup' : function(event, template){
        event.preventDefault();
        var login = {
            email: template.find('#signup-email').value,
            password: template.find('#signup-password').value
        }

        // TODO value validation
        Hembu.methods.signup.password(login, function(err){
            if(err){
                
            }
            else{
                Router.setRegion('welcome');
            }
        });
       
    },
    'click #facebook': function(event, template){
        Hembu.methods.signup.facebook(function(err){
            if(err){
                
            }
            else{
                Router.setRegion('welcome');
            }
        });
    },
    'click #google': function(event, template){
        Hembu.methods.signup.google(function(err){
            if(err){
                
            }
            else{
                Router.setRegion('welcome');
            }
        });
    }
});