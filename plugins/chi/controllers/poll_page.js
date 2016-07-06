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

    
    function PollPage() {};
    util.inherits(PollPage, pb.BaseController);

    PollPage.prototype.renderPage = function(cb) {
  
      this.ts.load('polls', function(error, result) {
              cb({content: result});
      });

    };

    PollPage.prototype.renderList = function(cb) {
    
      this.ts.load('poll_list', function(error, result) {
              cb({content: result});
      });

    };

    PollPage.prototype.renderItem = function(cb) {
    
      this.ts.load('poll_item', function(error, result) {
              cb({content: result});
      });

    };

    PollPage.getRoutes = function(cb) {
      var routes = [
        {
          method: 'get',
          path: '/polls',
          auth_required: false,
          handler: 'renderPage',
          content_type: 'text/html'
        },
        {
          method: 'get',
          path: '/polls/list',
          auth_required: false,
          handler: 'renderList',
          content_type: 'text/html'
        },
        {
          method: 'get',
          path: '/polls/item',
          auth_required: false,
          handler: 'renderItem',
          content_type: 'text/html'
        }
      ];

      // pb.io.sockets.on('connection', renderList);

      cb(null, routes);
    };

    //exports
    return PollPage;
};
