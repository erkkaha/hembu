//The actual url on client for OAuth clients 
if (Meteor.isClient) {
    Meteor.absoluteUrl.defaultOptions.rootUrl =  window.location.host;
}

Meteor.subscribe("userData");
Addresses = new Meteor.Collection('addresses');
Meteor.subscribe("addresses");
Facilities = new Meteor.Collection('facilities');
Meteor.subscribe('facilities');
Notices = new Meteor.Collection("notices", {
    transform:function(doc){
        doc.pinned = doc.pinnedUntil > new Date();
        return doc;
    }
});
Meteor.subscribe('notices');

Hembu={
    userHasAddress:function(){
        return Addresses.find().count() > 0;
    },
    getCurrentAddress: function(){
        if(Session.get('currentAddress')){
            return Session.get('currentAddress')
        }
        else{
            var addr = Addresses.findOne()
            Session.set('currentAddress', addr)
            return addr;
        }
    }
}
