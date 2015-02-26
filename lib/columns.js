var redis = require("redis"),
url = require("url"),
_ = require('underscore'),
client;

function setUp(app, options) {
  app.get('/columns', retrieve);

  var redisUrl = url.parse(options.url);
  client = redis.createClient(redisUrl.port, redisUrl.hostname);

  client.on('error', function(event) {

    if (client) {
      console.error('[ERROR] Could NOT connect to Redis server');
    }
    client = undefined;

  });

  if(redisUrl.auth) {
    client.auth(redisUrl.auth.split(":")[1]);
  }

}

function retrieve(req, res) {
  var query = req.query;
  var project = query.project;

  if(client){
    client.hgetall('columns', function(err, reply) {
      var answer = [];
      if(err) {
        console.log('[ERROR] Error while retrieving priorities: ' + err);
      }
      if(reply){
        _.each(_.pairs(reply), function(value, key, list){
          answer.push({ order: value[0], column: value[1]});
        });
      }
      res
      .send({columns: answer})
      .status(200);
    });
  }
  else{
    res.send({}).status(503);
  }

}

module.exports = setUp;
