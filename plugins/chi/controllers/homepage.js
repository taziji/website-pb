//dependencies
var path = require('path');
var async = require('async');
// var ClientJs = require('ClientJsModule');

module.exports = function(pb) {

  //PB dependencies
  var DAO = pb.DAO;
  var util = pb.util;
  var BaseController = pb.BaseController;
  var TopMenu = pb.TopMenuService;
  var Comments = pb.CommentService;
  var ArticleService = pb.ArticleService;
  var contentService   = new pb.ContentService();


  // Instantiate the controller & extend from the base controller
  var Homepage = function() {};
  util.inherits(Homepage, pb.BaseController);

  // Private function to order the result 
  function orderArray(array_with_order, array_to_order) {
      var ordered_array = [], 
          len = array_to_order.length,
          len_copy = len,
          index, current;

      for (; len--;) {
          current = array_to_order[len];
          index = array_with_order.indexOf(current._id.toString());
          ordered_array[index] = current;
      }

      //change the array
      Array.prototype.splice.apply(array_to_order, [0, len_copy].concat(ordered_array));
  };

  function getJS(jsCode) {
        return new pb.TemplateValue(jsCode, false);
  };

  // Define the content to be rendered
  Homepage.prototype.render = function(cb) {
    //redirect to page/home
    this.redirect('/page/home', cb);
  };


  /**
   * @method init
   * @param {Object} content
   * @param {Function} cb
   */
  Homepage.prototype.init = function(context, cb) {
      var self = this;
      var init = function(err) {
          if (util.isError(err)) {
              return cb(err);
          }
          
          //create the service
          self.service = new pb.PageService(self.getServiceContext());

          //create the loader context
          var context     = self.getServiceContext();
          context.service = self.service;

          self.contentViewLoader = new pb.ContentViewLoader(context);
          self.contentViewLoader.getDefaultTemplatePath = function() {
              return 'homepage';
          };

          
          cb(null, true);
      };

      Homepage.super_.prototype.init.apply(this, [context, init]);
  };

  /**
   * @method render
   * @param {Function} cb
   */
  Homepage.prototype.onPage = function(cb) {
      var self    = this;
      // var custUrl = this.pathVars.customUrl;
      var custUrl = "home"
      
      //attempt to load object
      var opts = {
          render: true,
          where: this.getWhereClause(custUrl)
      };
      this.service.getSingle(opts, function(err, content) {
          if (util.isError(err)) {
              return cb(err);
          }
          else if (content == null) {
              return self.reqHandler.serve404();   
          }
          
          var options = {};

          self.ts.registerLocal('headline', content.headline);
          self.ts.registerLocal('subheading', content.subheading);

          self.gatherData(content, function(err, data){
            // console.log(data);

            var objects = {
                gridImages: data.gridImages,
                navigation: data.nav.navigation
            };

            self.ts.registerLocal('angular_objects', getJS(pb.ClientJs.getAngularObjects(objects)));

            self.contentViewLoader.render([content], options, function(err, html) {
                    if (util.isError(err)) {
                        return cb(err);
                    }
                    
                    var result = {
                        content: html
                    };

                    cb(result);
                });
            });
          });
  };


  /**
   * Builds out the where clause for finding the article to render.  Because 
   * MongoDB has an object ID represented by 12 characters we must account 
   * for this condition by building a where clause with an "or" condition.  
   * Otherwise we will only query on the url key
   * @method getWhereClause
   * @param {String} custUrl Represents the article's ID or its slug
   * @return {Object} An object representing the where clause to use in the 
   * query to locate the article
   */
  Homepage.prototype.getWhereClause = function(custUrl) {
      
      //put a check to look up by ID *FIRST*
      var conditions = [];
      if(pb.validation.isIdStr(custUrl, true)) {
          conditions.push(pb.DAO.getIdWhere(custUrl));
      }
      
      //put a check to look up by URL
      conditions.push({
          url: custUrl 
      });
      
      //check for object ID as the custom URL
      var where;
      if (conditions.length > 1) {
          where = {
              $or: conditions
          };
      }
      else {
          where = conditions[0];
      }
      return where;
  };


  Homepage.prototype.getGridImages = function( content, cb) {

      if(!content) {
          cb(null, null);
          return;
      }

  
      var self = this;
      var dao = new pb.DAO();
      var opts = {
          where:  DAO.getIdInWhere(content.page_media)
      };

      dao.q('media', opts, function(err, medias) {
        if(util.isError(err) || medias.length == 0) {
            // console.log(medias);
            return cb(null, null);
        }
        
        orderArray(content.page_media, medias);

        cb(null, medias);

      });
  };

  Homepage.prototype.getNavigation = function(cb) {
      var options = {
          currUrl: 'home'
      };

      // console.log(this.session);
      TopMenu.getTopMenu(this.session, this.ls, options, function(themeSettings, navigation, accountButtons) {
          //TopMenu.getBootstrapNav(navigation, accountButtons, function(navigation, accountButtons) {
              cb(themeSettings, navigation, accountButtons);
          //});
      });
  };

  Homepage.prototype.gatherData = function(content, cb) {
      var self  = this;
      var tasks = {
          nav: function(callback) {
              self.getNavigation(function(themeSettings, navigation, accountButtons) {
                  callback(null, {themeSettings: themeSettings, navigation: navigation, accountButtons: accountButtons});
              });
          },
          gridImages: function(callback) {
              self.getGridImages(content, function(err, medias) {
                callback(null,medias);
              });
          },
      };
      async.parallel(tasks, cb);
  };


  // Define the routes for the controller
  Homepage.getRoutes = function(cb) {
    var routes = [{
      method: 'get',
      path: "/",
      auth_required: false,
      handler:  'onPage',
      content_type: 'text/html'
    }];
    cb(null, routes);
  };

  //return the prototype
  return Homepage;
};