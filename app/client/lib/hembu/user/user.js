window.Hembu = window.Hembu || {};
window.Hembu.user = window.Hembu.user || {
    hasAddress: false
}


Tracker.autorun(function () {
  var user = Meteor.user();
  if (user){
    _.extend(Hembu.user, user)
  }
});


Tracker.autorun(function () {
  var acount = Hembu.collections.addresses.find().count(),
      user = Meteor.user();
  if (user){
    Hembu.user.hasAddress = acount > 0;
  }
});


