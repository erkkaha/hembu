hembu
====================================================================
hembu is a block community management platform build with meteor

Running hembu
====================================================================

#install meteorite and run

meteor install
mrt install

#create settings file
cp server/settings.json.sample server/settings.json

#Run
MAIL_URL=smtp://user:pass@smtp.mandrillapp.com:587 ROOT_URL=[localhost:300 or where ever you are running hembu] mrt --settings server/settings.json 

Packages used
====================================================================
Jade 
    - https://github.com/mquandalle/meteor-jade
    - http://jade-lang.com
    
UiKit

    - http://www.getuikit.com
    
iron-router

    - https://github.com/EventedMind/iron-router
    
Good resources for meteor
====================================================================
www.meteorpedia.com
docs.meteor.com