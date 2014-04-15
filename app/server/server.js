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
});