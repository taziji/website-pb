/*
    Copyright (C) 2015  PencilBlue, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//Create team schema
var teamSchema = new Schema({
  name: String,
  players: [{
    number: Number,
    name: String,
    position: String,
    X: {type:Number, default: null},
    Y: {type:Number, default: null},
    left: {type:Number, default: null},
    top: {type:Number, default: null}
  }]
});

mongoose.model('team', teamSchema);
mongoose.connect('mongodb://localhost/team');
var team = mongoose.model('team');


module.exports = function(pb) {
    
    //pb depdencies
    var util = pb.util;

    
    function Formation() {};
    util.inherits(Formation, pb.BaseController);

    Formation.prototype.team = function(cb) {

      var names = [];
      team.find({}, 'name').
      exec(function(err, docs) {
        docs.forEach(function(doc) {
          if (doc.name != null)
            names.push(doc.name);
            console.log(doc.name);
        });
        console.log(names);
        cb({
          content: {
              teamName: names
          }
        });
      });
    };

    Formation.prototype.formation = function(cb) {
    };
    //   // var players = [];

    //   // team.find({
    //   //   name: req.body.teamName
    //   // }).
    //   // exec(function(err, docs) {

    //   //   docs.forEach(function(doc) {
    //   //     players = doc.players;
    //   //   });
    //   //   //console.log(teamName);
    //   //   // res.render('formation', {
    //   //   //   teamName: req.body.teamName,
    //   //   //   players: players
    //   //   // });
    //   //   cb({
    //   //     content: {
    //   //         formation: 

    //   //     }
    //   //   });
    //   //   console.log(JSON.stringify(players));
    //   // });
    // };

    // app.get('/formation_share', function(req, res) {
    //   var players = [];

    //   team.find({
    //     name: req.query.teamName
    //   }).
    //   exec(function(err, docs) {
    //     docs.forEach(function(doc) {
    //       players = doc.players;
    //     });
    //     //console.log(teamName);
    //     res.render('formation_share', {
    //       teamName: req.query.teamName,
    //       players: players
    //     });
    //     console.log(JSON.stringify(players));
    //   });
    // });

    // app.post('/add', function(req, res) {
    //   console.log(req.body);

    //   //json response
    //   var json = {
    //     errors: String,
    //     success: Boolean,
    //     message: String
    //   };

    //   var newTeam = new team({
    //     "name": req.body.name,
    //     "players": []
    //   });

    //   newTeam.save(function(err) {
    //     if (err) {
    //       json.success = false;
    //       json.errors = err;
    //       res.json(json);
    //       throw err;
    //     } else {
    //       json.success = true;
    //       json.message = 'new team is saved';
    //       res.json(json);
    //     }
    //     console.log('new team saved successfully!');
    //   });
    //   // res.send('POST request to the homepage');
    // });

    // app.post('/saveFormation', function(req, res) {

    //   console.log(req.body);

    //   //json response
    //   var json = {
    //     errors: String,
    //     success: Boolean,
    //     message: String
    //   };

    //   var players = req.body.players;

    //   var asyncTasks = [];

    //   players.forEach(function(player) {
    //     asyncTasks.push(function(callback) {
    //       team.update({
    //           'players._id': player.id,
    //         }, {
    //           '$set': {
    //             'players.$.X': player.X,
    //             'players.$.Y': player.Y,
    //             'players.$.left': player.left,
    //             'players.$.top': player.top
    //           }
    //         },
    //         function(err, result) {
    //           if(err)
    //             return callback(err);
    //           callback(null,result);
    //         });
    //     });
    //   });

    //   async.parallel(asyncTasks, function(err, result) {
        
    //         if (err) {
    //           json.success = false;
    //           json.errors = err;
    //           res.json(json);
    //           throw err;
    //         }
    //         json.success = true;
    //         json.message = 'the formation is saved';
    //         res.json(json);
    //   });   
    // });



    // app.post('/remove_player', function(req, res) {

    //   console.log(req.body);

    //   var json = {
    //     errors: String,
    //     success: Boolean,
    //     message: String,
    //     player_id: String
    //   };

    //   team.update({
    //       name: req.body.teamName,
    //     }, {
    //       $pull: {
    //         players: {
    //           _id: req.body._id
    //         }
    //       }
    //     }, {},
    //     function(err, result) {
    //       if (err) {
    //         json.success = false;
    //         json.errors = err;
    //         res.json(json);
    //         throw err;
    //       }
    //       json.success = true;
    //       json.message = 'the player is removed';

    //       res.json(json);
    //     });
    // });

    // app.post('/remove_players', function(req, res) {

    //   console.log(req.body);

    //   var json = {
    //     errors: String,
    //     success: Boolean,
    //     message: String,
    //     player_id: String
    //   };

    //   team.update({
    //       name: req.body.teamName,
    //     }, {
    //       $pull: {
    //         players: {}
    //       }
    //     }, {},
    //     function(err, result) {
    //       if (err) {
    //         json.success = false;
    //         json.errors = err;
    //         res.json(json);
    //         throw err;
    //       }
    //       json.success = true;
    //       json.message = 'all player are removed';

    //       res.json(json);
    //     });
    // });

    // app.post('/add_player', function(req, res) {

    //   //json response
    //   var json = {
    //     errors: String,
    //     success: Boolean,
    //     message: String,
    //     player_id: String
    //   };

    //   var newPlayer = {
    //     "number": null,
    //     "name": req.body.player,
    //     "position": null
    //   };

    //   var teamId;

    //   team.findOne({
    //     name: req.body.teamName
    //   }, function(err, doc) {
    //     team.findByIdAndUpdate(
    //       doc._id, {
    //         $push: {
    //           "players": newPlayer
    //         }
    //       }, {
    //         safe: true,
    //         upsert: true,
    //         new: true
    //       },
    //       function(err, model) {
    //         if (err) {
    //           json.success = false;
    //           json.errors = err;
    //           res.json(json);
    //           throw err;
    //         }
    //         json.success = true;
    //         json.message = 'new player is added';
    //         json.player_id = model.players.pop()._id;

    //         //console.log(model.players.pop()._id);
    //         console.log(json);

    //         res.json(json);

    //       });
    //   });
    // });

    Formation.getRoutes = function(cb) {
      var routes = [
        {
          method: 'get',
          path: '/team',
          auth_required: false,
          handler: 'team',
          content_type: 'text/html'
        }
      ];

      // pb.io.sockets.on('connection', renderList);

      cb(null, routes);
    };

    //exports
    return Formation;
};
