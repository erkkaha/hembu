window.Hembu = window.Hembu || {};
window.Hembu.collections = window.Hembu.collections || {};

Hembu.collections.boards = new Meteor.Collection('boards', {
    transform: function(doc){
        console.log(Hembu.methods.address.current.display())
        doc.url = Router.url('home', {address: Hembu.methods.address.current.display(), board:doc.name});
        return doc;
    }
});

Tracker.autorun(function () {
    Meteor.subscribe("boards", {address : Session.get('currentAddress')});
});

