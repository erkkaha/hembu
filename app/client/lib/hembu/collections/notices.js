window.Hembu = window.Hembu || {};
window.Hembu.collections = window.Hembu.collections || {};

Hembu.collections.notices = new Meteor.Collection('notices', {
    transform: function(doc){
        doc.pinned = doc.pinnedUntil > new Date();
        return doc;
    }
});

Meteor.subscribe('notices');