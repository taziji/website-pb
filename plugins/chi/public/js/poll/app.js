// Angular module, defining routes for the app
angular.module('polls', ['pollServices']).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/polls', { templateUrl: 'polls/list', controller: PollListCtrl }).
			when('/poll/:pollId', { templateUrl: '/polls/item', controller: PollItemCtrl }).
			otherwise({ redirectTo: '/polls' });
	}]);
	