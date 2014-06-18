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
                if(Hembu.userHasAddress())
                    Router.go('home', {address:Hembu.getCurrentAddress().address});
                else
                    Router.go('addresses.create', {address:'new'});
            }
        });
    },
    'click #facebook': function(event, template){
        Meteor.loginWithFacebook({requestPermissions:['email', 'public_profile']},function(err){
            if(err)
            {
                $.UIkit.notify(err.reason, {pos:'top-right'});
            }
            else{
                var url = 'http://graph.facebook.com/' + Meteor.user().services.facebook.id +'/picture?height=100&type=normal&width=100'
                Meteor.users.update({_id: Meteor.userId()}, {$set:{'profile.profilePic': url }});
                if(Hembu.userHasAddress())
                    Router.go('home', {address:Hembu.getCurrentAddress().address});
                else
                    Router.go('addresses.create', {address:'new'});
            }
        })
    },
    'click #google': function(event, template){
        Meteor.loginWithGoogle({requestPermissions:['email', 'profile']},function(err){
            if(err)
            {
                $.UIkit.notify(err.reason, {pos:'top-right'});
            }
            else{
                Meteor.users.update({_id: Meteor.userId()}, {$set:{'profile.profilePic': Meteor.user().services.google.picture}});
                if(Hembu.userHasAddress())
                    Router.go('home', {address:Hembu.getCurrentAddress().address});
                else
                    Router.go('addresses.create', {address:'new'});
            }
        })
    }
});