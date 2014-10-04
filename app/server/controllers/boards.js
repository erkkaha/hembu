Meteor.methods({
    addBoard: function (options) {
        options = options || {};
        if (!this.userId)
          throw new Meteor.Error(403, "You must be logged in");

        if (!(typeof options.name === "string" && options.name.length ))
          throw new Meteor.Error(400, "Board name is missing");

        if (!(typeof options.addressId === "string" && options.addressId.length ))
          throw new Meteor.Error(400, "addressId for the board name is missing");
        return Boards.insert({
          name: options.name,
          addressId: options.addressId,
          ui:{
              accentColour: (options.ui === undefined || options.ui.accentColour === undefined) ? '' : options.ui.accentColour
          }
        }, function(err, id){
            if(!err){
                //TODO
            }
            else{
                //TODO
            }
        });
    }
});