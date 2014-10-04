window.Hembu = window.Hembu || {};
window.Hembu.collections = window.Hembu.collections || {};

Hembu.collections.addresses = new Meteor.Collection('addresses');

Meteor.subscribe("addresses");
