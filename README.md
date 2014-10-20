#hembu

hembu is a block community management platform built with meteor

##Running hembu

######install packages

meteor update

######create settings file
cp server/settings.json.sample server/settings.json

######Run
ROOT_URL=[localhost:3000 or where ever you are running hembu] meteor --settings server/settings.json 