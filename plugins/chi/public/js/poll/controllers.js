// Controller for the poll list
function PollListCtrl($scope, Poll) {
	$scope.polls = Poll.query();
}

// Controller for an individual poll
function PollItemCtrl($scope, $route, $routeParams, $http, Poll) {	
	$scope.poll = Poll.get({pollId: $routeParams.pollId});

	
	$scope.vote = function() {
		var pollId = $scope.poll._id,
				choiceId = $scope.poll.userVote;
		
		if(choiceId) {
			var voteObj = { poll_id: pollId, choice: choiceId };
			$http({
			  method  : 'POST',
			  url     : 'vote',
			  data    :  JSON.stringify(voteObj),  // pass in data as strings
			  headers : { 'Content-Type': 'application/json' }  // set the headers so angular passing info as form data (not request payload)
			})
			.success(function(data) {
				$route.reload();
			});
		} else {
			alert('You must select an option to vote for');
		}
	};
}

