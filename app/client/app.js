//The actual url on client for OAuth clients 
if (Meteor.isClient) {
    Meteor.absoluteUrl.defaultOptions.rootUrl =  window.location.host;
}


Facilities = new Meteor.Collection('facilities');
Meteor.subscribe('facilities');


