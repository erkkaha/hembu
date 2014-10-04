
if(Meteor.settings.loginProviders){
    if(Meteor.settings.loginProviders.facebook)
    {
        // first, remove configuration entry in case service is already configured
        ServiceConfiguration.configurations.remove({
          service: "facebook"
        });
        ServiceConfiguration.configurations.insert({
          service: "facebook",
          appId: Meteor.settings.loginProviders.facebook.clientId,
          secret: Meteor.settings.loginProviders.facebook.secret
        });
    }
    if(Meteor.settings.loginProviders.google)
    {
        ServiceConfiguration.configurations.remove({
          service: "google"
        });
        ServiceConfiguration.configurations.insert({
          service: "google",
          clientId: Meteor.settings.loginProviders.google.clientId,
          secret: Meteor.settings.loginProviders.google.secret
        });
    }
}