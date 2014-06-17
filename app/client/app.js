//The actual url on client for OAuth clients 
if (Meteor.isClient) {
    //Meteor.absoluteUrl.defaultOptions.rootUrl =  window.location.host;
}

Meteor.subscribe("userData");
Facilities = new Meteor.Collection('facilities')
Meteor.subscribe('facilities');

Hembu={
    userHasAddress:function(){
        if(Meteor.user() && Meteor.user().addresses !== undefined)
            return true;
        else
            return false;
    },
    getCurrentAddress: function(){
        if(Session.get('currentAddress')){
            return Session.get('currentAddress')
        }
        else{
            return Meteor.user().addresses[0] || {};
        }
    }
}
