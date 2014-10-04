window.Hembu = window.Hembu || {};
window.Hembu.collections = window.Hembu.collections || {};

Hembu.collections.boards = new Meteor.Collection('boards');

Deps.autorun(function (c) {
    if(Session.get('currentAddress')){
        Meteor.subscribe("boards", {address : Session.get('currentAddress')._id});
    }
});

