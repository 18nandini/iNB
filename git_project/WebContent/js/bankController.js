var testModule = angular.module('bankingApp',['ngRoute','ngCookies']);

testModule.controller('BankController',bankController);


testModule.config(function($routeProvider){

	$routeProvider
	.when('/',{
		
		controller: 'BankController',
		templateUrl: 'home.html'
	})
	
	.otherwise({redirectTo: '/'})

});