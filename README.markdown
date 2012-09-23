## Genesis - Rooms ##

This is the rooms management and api for genesis style servers. It basically just serves room data, and eventually, lets you edit and create them.

Not much to see here yet, but stay tuned!

### Deploy to heroku ###

  heroku create username-genesis-rooms --stack cedar
  git push heroku master
  heroku config:set HOSTNAME='username-genesis-rooms.herokuapp.com'
  heroku config:set PUBLIC_PORT=80
  heroku open (or just go to the url in your web browser from the output of those commands)

### Credits ###

* First and foremost, deepest gratitude to the creators of all the gems listed in Gemfile
* Matt Ross for his excellent [tilemap editor](http://www.ludumdare.com/compo/2012/05/04/javascript-tile-map-editor/)
* Daniel Cook from [Lost Garden](http://www.lostgarden.com) for his gorgeous tilesets

### License ###

In order to be able to distribute borrowed free art with the software, this repo is licensed under Creative Commons ([CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/us/))