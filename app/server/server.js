 var Future = Npm.require('fibers/future');

// Server startup
Meteor.startup(function(){
});

Router.map(function () {
  this.route('emailParse', {
    where: 'server',
    path: '/api/email/parse',

    action: function () {
      // Mail is coming from mandrill inbound POST
      try{
            var mail = {};
            if(this.request.body.mandrill_events){
                mail = JSON.parse(this.request.body.mandrill_events)[0].msg;
            }
            else{
                mail = this.request.body;
            }
            Feeds.update(mail.email.toString().split('@')[0], { $addToSet: { 
              comments: {
                owner: null,
                author: mail.from_name +' - '+ mail.from_email,
                content: mail.text,
                postedAt: new Date()
              }
            }});
            this.response.writeHead(200, {'Content-Type': 'text/html'});
            this.response.end('OK');
      }
      catch(err){
          console.log('error:', err, 'request.body', this.request.body);
          this.response.writeHead(500, {'Content-Type': 'text/html'});
          this.response.end('Internal server error');
      }
    }
  });
  this.route('avatar', {
    where: 'server',
    path: '/api/avatar/:id',

    action: function () {
      // Mail is coming from mandrill inbound POST
      try{
          var res = this.response;
            var fut = new Future();
            var user = Meteor.users.findOne({_id:this.params.id});
            if(!user){
                res.writeHead(404);
                res.end();
            }
            else{
                res.writeHead(301, {'Location': user.profile.profilePic});
                res.end();
            }
            res.on('end', function () { 
                fut.return();
            });
            return fut.wait();
      }
      catch(err){
          console.log('error:', err, 'request.body', this.request.body);
          this.response.writeHead(500, {'Content-Type': 'text/html'});
          this.response.end('Internal server error');
      }
    }
  });
});