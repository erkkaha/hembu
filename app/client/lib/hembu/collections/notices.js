window.Hembu = window.Hembu || {};
window.Hembu.collections = window.Hembu.collections || {};

Hembu.collections.notices = new Meteor.Collection('notices', {
    transform: function(doc){
        doc.pinned = doc.pinnedUntil > new Date();
        return doc;
    }
});

Tracker.autorun(function (c) {
    if(Session.get('currentAddress')){
        Meteor.subscribe("notices", {address : Session.get('currentAddress')._id});
    }
});