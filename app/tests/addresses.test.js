
describe('Addresses', function() {
  it('Client adds a new address', function(done, server, client) {
    server.eval(function() {
    Addresses.find().observe({
      added: addedNewAddress
    });

    function addedNewAddress(docs) {
      emit('docs', docs);
    }
    });
    server.once('docs', function(docs) {
      docs.length.should.equal(1);
      var addr = docs[0]
      addr.displayAddress.should.equal('Museokatu 14')
      done();
    });
    client.eval(function() {
        Meteor.call('addAddress', {streetAddress: 'Museokatu', streetNumber:'14'}, function(err, result){
 
        });
  });
  });
});