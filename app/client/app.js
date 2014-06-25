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
Boards = new Meteor.Collection('boards');
Deps.autorun(function (c) {
    if(Session.get('currentAddress')){
        Meteor.subscribe("boards", {address : Session.get('currentAddress')._id});
    }
});
Hembu={
    userHasAddress:function(){
        return Addresses.find().count() > 0;
    },
    getCurrentAddress: function(){
        if(Session.get('currentAddress')){
            return Session.get('currentAddress');
        }
        else{
            var addr = Addresses.findOne();
            return addr;
        }
    },
    setCurrentAddress: function(address){
        Session.set('currentAddress', Addresses.findOne({address:address}));
    },
    notices:{
        create:function(notice, callback){
           Meteor.call('addNotice', {streetAddress:address}, function(err, result){
            if(err)
            {
                callback(err);
            } 
            else{
                callback(null, result);
            }
        });
        }
    }
};
