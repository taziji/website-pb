

module.exports = function ChiPluginModule(pb) {
    
    /**
     * ChiPlugin - A Chi for exemplifying what the main module file should
     * look like.
     *
     * @author Brian Hyder <brian@pencilblue.org>
     * @copyright 2015 PencilBlue, LLC
     */

    //pb dependencies
    var util = pb.util;
    var async = require('async');

    function ChiPlugin(){}

    /**
     * Called when the application is being installed for the first time.
     * @static
     * @method onInstallWithContext
     * @param cb A callback that must be called upon completion.  cb(Error, Boolean).
     * The result should be TRUE on success and FALSE on failure
     */
    ChiPlugin.onInstall = function(cb) {

        var self = this;
        var cos = new pb.CustomObjectService();

        this.setupPollType = function(){
            cos.loadTypeByName('pb_poll', function(err, pollType) {
                if (util.isError(err) || pollType) {
                    return cb(err, !util.isError(err));
                }
                
                var pollValues = {
                    name: 'pb_poll',
                    fields: {
                        question: {
                            field_type: 'text'
                        },
                        choice: {
                            field_type: 'child_objects',
                            object_type: 'custom:pb_choice'
                        }
                    }
                };

                cos.saveType(pollValues, function(err, pollType) {
                    cb(err, !util.isError(err));
                });
            });
        }

        this.setupChoiceType = function(){
            cos.loadTypeByName('pb_choice', function(err, choiceType) {
                if (util.isError(err) || choiceType) {
                    return cb(err, !util.isError(err));
                }
                
                var choiceValues = {
                    name: 'pb_choice',
                    fields: {
                        text: {
                            field_type: 'text'
                        },
                        votes: {
                            field_type: 'child_objects',
                            object_type: 'custom:pb_vote'
                        }
                    }
                };

                cos.saveType(choiceValues, function(err, choiceType) {
                    self.setupPollType();
                });
            });
        }

        cos.loadTypeByName('pb_vote', function(err, voteType) {
            if (util.isError(err) || voteType) {
                return cb(err, !util.isError(err));
            }
            
            var voteValues = {
                name: 'pb_vote',
                fields: {
                    ip: {
                        field_type: 'text'
                    }
                }
            };

            cos.saveType(voteValues, function(err, voteType) {
                self.setupChoiceType();
            });
         });

    };

    /**
     * Called when the application is uninstalling this plugin.  The plugin should
     * make every effort to clean up any plugin-specific DB items or any in function
     * overrides it makes.
     *
     * @param context
     * @param cb A callback that must be called upon completion.  cb(Error, Boolean).
     * The result should be TRUE on success and FALSE on failure
     */
    ChiPlugin.onUninstallWithContext = function (context, cb) {
        cb(null, true);
    };

    /**
     * Called when the application is starting up. The function is also called at
     * the end of a successful install. It is guaranteed that all core PB services
     * will be available including access to the core DB.
     *
     * @param context
     * @param cb A callback that must be called upon completion.  cb(Error, Boolean).
     * The result should be TRUE on success and FALSE on failure
     */
    ChiPlugin.onStartupWithContext = function (context, cb) {
        cb(null, true);
    };

    /**
     * Called when the application is gracefully shutting down.  No guarantees are
     * provided for how much time will be provided the plugin to shut down.
     *
     * @param cb A callback that must be called upon completion.  cb(Error, Boolean).
     * The result should be TRUE on success and FALSE on failure
     */
    ChiPlugin.onShutdown = function(cb) {
        cb(null, true);
    };

    //exports
    return ChiPlugin;
};
