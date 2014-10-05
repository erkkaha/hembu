window.Hembu = window.Hembu || {};
window.Hembu.user = window.Hembu.user || {
    hasAddress: false,
    loggedIn: false
}

Meteor.subscribe("userData");

Tracker.autorun(function (c) {
  var user = Meteor.user();
  if (user){
    _.extend(Hembu.user, user)
    Hembu.user.loggedIn = true;
    c.stop();
  }
  else{
    return;
  }
});


Tracker.autorun(function () {
      var addrs = Hembu.collections.addresses.find();
    console.log(Hembu.collections.addresses.find().count())
      Hembu.user.hasAddress = Hembu.collections.addresses.find().count() > 0;
      if(Hembu.user.hasAddress){
        Hembu.router.go('home');
        Hembu.user.addresses = Hembu.collections.addresses;
        Hembu.user.homeAddress = Hembu.user.addresses.findOne().display
        Hembu.methods.address.current.set(Hembu.user.homeAddress);
      }
});


