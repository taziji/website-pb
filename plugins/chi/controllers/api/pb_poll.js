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

module.exports = function(pb) {
    
    //pb depdencies
    var util = pb.util;
    
    function PollList() {};
    util.inherits(PollList, pb.BaseController);

    PollList.prototype.renderList = function(cb) {
      var self = this;
      var cos = new pb.CustomObjectService();

      cos.loadTypeByName('pb_poll', function(err, pollType) {
        if(util.isError(err) || !util.isObject(pollType)) {
          cb({
            code: 400,
            content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, self.ls.get('INVALID_UID'))
          });
          return;
        }

        cos.findByTypeWithOrdering(pollType, function(err, custObj){
          if(util.isError(err) || !util.isObject(custObj)) {
            cb({
              code: 400,
              content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, self.ls.get('INVALID_UID'))
            });
            return;
          }
          cb({
            content: custObj
          });

        });
      });
    };

    PollList.prototype.renderPoll = function(cb) {
      var self = this;
      var id = this.pathVars.id;
      var cos = new pb.CustomObjectService();

      cos.loadById(id, function(err, poll) {
        if(poll) {
          var userVoted = false,
              userChoice,
              totalVotes = 0;

          cos.fetchChildren(poll, {fetch_depth: 2},'pb_poll', function (err, pollWithChoices){
              // console.log(pollWithChoices);
              // Loop through poll choices to determine if user has voted
              // on this poll, and if so, what they selected
              for(c in pollWithChoices.choices) {
                var choice = pollWithChoices.choices[c]; 

                for(v in choice.votes) {
                  var vote = choice.votes[v];
                  totalVotes++;

                  if(vote.ip === self.getServiceContext().session.ip) {
                    userVoted = true;
                    // userChoice = { _id: choice._id, text: choice.text };
                  }
                }
              }

              // Attach info about user's past voting on this poll
              pollWithChoices.userVoted = userVoted;
              pollWithChoices.userChoice = userChoice;

              pollWithChoices.totalVotes = totalVotes;
              
              // res.json(poll);
              cb({content: pollWithChoices});

            });
              
          } 
          else {
            // res.json({error:true});
            cb({
              code: 400,
              content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, self.ls.get('INVALID_UID'))
            });
          }
        });
    };

    PollList.prototype.vote = function(cb) {

      var self = this;

      this.getJSONPostParams(function(err, post){
        var message = self.hasRequiredParams(post, ['choice', 'poll_id']);
        if(message) {
          cb({
            code: 400,
            content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, message)
          });
          return;
        }

        var cos = new pb.CustomObjectService();

        cos.loadTypeByName('pb_vote', function(err, voteType) {
          if(util.isError(err) || !util.isObject(voteType)) {
            cb({
              code: 400,
              content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, self.ls.get('INVALID_UID'))
            });
            return;
          }

          var vote = {
            name: util.uniqueId(),
            ip: self.getServiceContext().session.ip,
            choice: [post.choice]
          };

          pb.CustomObjectService.formatRawForType(vote, voteType);
          var customObjectDocument = pb.DocumentCreator.create('vote_object', vote);

          cos.save(customObjectDocument, voteType, function(err, result) {
            if(util.isError(err)) {
              return cb({
                code: 500,
                content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, self.ls.get('ERROR_SAVING'))
              });
            }
            else if(util.isArray(result) && result.length > 0) {
              return cb({
                code: 500,
                content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, self.ls.get('ERROR_SAVING'))
              });
            }

            cos.loadById(post.choice, function(err, poll) {
              poll.votes.push(result._id);
              cos.loadTypeByName('pb_choice', function(err, choiceType) {
                cos.save(poll, choiceType, function(err, result) {
                  if(util.isError(err)) {
                    return cb({
                      code: 500,
                      content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, self.ls.get('ERROR_SAVING'))
                    });
                  }
                  else if(util.isArray(result) && result.length > 0) {
                    return cb({
                      code: 500,
                      content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, self.ls.get('ERROR_SAVING'))
                    });
                  }
                  cb({content: pb.BaseController.apiResponse(pb.BaseController.API_SUCCESS, 'vote submitted')});
                });
              });
            });

          });
        });

      });
    };



    PollList.getRoutes = function(cb) {
      var routes = [
        {
          method: 'get',
          path: '/polls/polls',
          auth_required: false,
          content_type: 'application/json',
          handler: 'renderList'
        },
        {
          method: 'get',
          path: '/polls/:id',
          auth_required: false,
          content_type: 'application/json',
          handler: 'renderPoll'
        },
        {
          method: 'post',
          path: '/vote',
          auth_required: false,
          content_type: 'application/json',
          handler: 'vote'
        }

      ];

      cb(null, routes);
    };

    //exports
    return PollList;
};
