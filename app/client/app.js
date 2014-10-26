//The actual url on client for OAuth clients 
if (Meteor.isClient) {
    Meteor.absoluteUrl.defaultOptions.rootUrl =  window.location.host;
   Template.mochaweb.helpers({
  mochaWebIFrameURL: function(){
    if (! Session.get("mochaWebMirror")){
        return window.location.origin+":5000?mocha=true";
    } else {
      return null;
    }
  }
});
}


Facilities = new Meteor.Collection('facilities');
Meteor.subscribe('facilities');


