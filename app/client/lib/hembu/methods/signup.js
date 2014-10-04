window.Hembu = window.Hembu || {};
window.Hembu.methods = window.Hembu.methods || {};

Hembu.methods.signup = {
    facebook: function(done){
        Meteor.loginWithFacebook({requestPermissions:['email', 'public_profile']},function(err){
            if(err)
            {
                Hembu.error(err, true);
                done(err);
            }
            else{
                var url = 'http://graph.facebook.com/' + Meteor.user().services.facebook.id +'/picture?height=100&type=normal&width=100'
                Meteor.users.update({_id: Meteor.userId()}, {$set:{'profile.avatar': {url:url, origin:'facebook'} }});
                done(null);
            }
        });
    },
    google: function(done){
         Meteor.loginWithGoogle({requestPermissions:['email', 'profile']},function(err){
            if(err)
            {
                Hembu.error(err, true);
                done(err);
            }
            else{
                Meteor.users.update({_id: Meteor.userId()}, {$set:{'profile.avatar': {url:Meteor.user().services.google.picture, origin:'google'}}});
                done(null);
            }
        });
    },
    password: function(options, done){
        options = options || {};
        Accounts.createUser({email:email, password:password}, function(err){
            if (err){
                Hembu.error(err, true);
                done(err);
            }
            else{
                done(null);
            }
        });
    }
};

