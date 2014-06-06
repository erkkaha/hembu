var assert = require('assert');

suite('Addresses', function() {
  test('in the server', function(done, server) {
    server.eval(function() {
      Addresses.insert({streetAddress: 'Museokatu', streetNumber:'14'});
      var docs = Addresses.find().fetch();
      emit('docs', docs);
    });

    server.once('docs', function(docs) {
      assert.equal(docs.length, 1);
      done();
    });
  });
});