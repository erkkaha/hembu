var Future = Npm.require('fibers/future')

Meteor.methods({
  addAddress: function (options) {
    options = options || {};
    if (!options.address)
        throw new Meteor.Error(400, "Address is missing");
    var address = {
        display: options.address.route + (options.address.street_number ? ' ' + options.address.street_number : ''),
        country: options.address.country,
        zipCode: options.address.postal_code,
        streetAddress: options.address.route,
        streetNumber: options.address.street_number,
        location: options.address.location,
        city: options.address.locality,
        externalId: options.address.externalId
    };
    var fut = new Future();
    Addresses.insert(address, function(err, _id){
        if(err)
            throw new Meteor.Error(500, "Adding of new address failed");
        else{
            Boards.insert({
              name: 'Notice board',
              addressId: _id,
              isDefault: true,
              ui:{
                  accentColour: 'accent-colour-3'
              }
            });
            Meteor.users.update({_id:Meteor.userId()}, {$addToSet:{'addresses':{
                _id : _id,
                verified: true
            }}}, function(err){
                address._id = _id;
                fut.return(address)
            });
        }
    });
    return fut.wait();
  }
});