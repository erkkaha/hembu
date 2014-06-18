Meteor.methods({
  addFacility: function (options) {
    options = options || {};
    if (! (typeof options.name === "string" && options.name.length ))
        throw new Meteor.Error(400, "Facility name is missing");
    var facility = {
        address: options.address,
        name: options.name
    };
    return Facilities.insert(facility, function(err, _id){
        if(err)
            throw new Meteor.Error(500, "Adding of new facility failed");
        else 
            return _id;
    });
  },
  addEvent: function(options){
        options = options || {};
        if(!options.start)
            throw new Meteor.Error(400, "Required parameter missing");
        return Events.insert({
            title: 'Reserved',
            start: options.start
        });
  }
});