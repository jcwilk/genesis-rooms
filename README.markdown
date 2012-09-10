## Genesis - Rooms ##

This is the rooms management and api for genesis style servers. It basically just serves room data, and eventually, lets you edit and create them.

Not much to see here yet, but stay tuned!

### Deploy to heroku ###

  heroku create username-genesis-rooms --stack cedar
  git push heroku master
  heroku config:set HOSTNAME='username-genesis-rooms.herokuapp.com'
  heroku config:set PUBLIC_PORT=80
  heroku open (or just go to the url in your web browser from the output of those commands)