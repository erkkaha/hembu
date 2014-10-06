window.Hembu = window.Hembu || {};
window.Hembu.collections = window.Hembu.collections || {};

Hembu.collections.addresses = new Meteor.Collection('addresses', {
    transform: function(doc){
        doc.url = Router.url('home', {address: doc.display.replace(/ /g, '')});
        return doc;
    }
});

Meteor.subscribe("addresses");
