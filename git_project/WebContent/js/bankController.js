var testModule = angular.module('bankingApp',['ngRoute','ngCookies']);

var bankController = function($scope,$rootScope, $location, $route, $cookieStore) {
	$location.path('/');
};



testModule.controller('BankController',bankController);

testModule.config(function($routeProvider){

	$routeProvider
	.when('/',{
		
		controller: 'BankController',
		templateUrl: 'home.html'
	})
	
	.otherwise({redirectTo: '/'})

});