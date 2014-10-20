#hembu

hembu is a block community management platform built with meteor

##Running hembu

######install packages

meteor update

######create settings file
cp server/settings.json.sample server/settings.json

######Run
MAIL_URL=smtp://user:pass@smtp.mandrillapp.com:587 ROOT_URL=[localhost:3000 or where ever you are running hembu] mrt --settings server/settings.json 