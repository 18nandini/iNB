var myModel = angular.module("webApp",['ngRoute','ngCookies']);

//myModel.value('user',{
//	name: '',
//	token:''
//});

function WebController($scope,$location,$http,$route,$cookieStore){
	$scope.username;
	$scope.token;
	$scope.hides = true;
	$scope.hidel = true;
	$scope.hidep = true;
	$scope.postid;
	if($cookieStore.get('token')!= null){
		$scope.username = $cookieStore.get('name');
		$scope.token = $cookieStore.get('token');
		$scope.myValue = true;
		$scope.showpostad = true;
		$scope.hideme= true;
	}
	$scope.search = function(){
		$location.path('/search');
	}
	$scope.login_user = function(){
		$location.path('/login_user');
	}
	$scope.register = function(){
		
		$http({
			method : 'POST',
			url : 'http://10.20.14.83:9000/register',
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://10.20.14.83:9000'
			},
			data : {
				firstName: $scope.firstname,
				lastName: $scope.lastname,
				userName: $scope.username,
				password: $scope.password,
				email: $scope.email,
				phone: $scope.phone
			}
		}).then(function successCallback(response) {
			console.log(response.data.data.message);
			$scope.hides = false;
			$scope.errormsg = response.data.data.message;
		}, function errorCallback(response) {
			$scope.hides = false;
			$scope.errormsg = response.data.data.error;

		});
	}
	$scope.validate_user = function(){
		
		if($scope.username== null){
			$scope.hidel = false;
			$scope.error_msg = 'Please enter username';			
		}
		else{
			if($scope.password == null){
				$scope.hidel = false;
				$scope.error_msg = 'Please enter password';
			}
			else{
		          $http({
			      method : 'POST',
			      url : 'http://10.20.14.83:9000/login',
			      headers : {
				     'Content-Type' : 'application/json',
				    'Access-Control-Allow-Origin': 'http://10.20.14.83:9000'
			},
			data : {				
				userName: $scope.username,
				password: $scope.password,
				
			}
		}).then(function successCallback(response) {
			
            if(response.data.data['auth-token']==null){
            	//alert('username does not exists');
            	$scope.hidel = false;
            	$scope.error_msg = 'Username does not exist. Please enter correct credentials';
            	//$scope.myValue = false;
            } 
            else{
            	$scope.hidel = true;
            	$scope.username = response.data.data.userId;
            	$scope.weluser =  response.data.data.userId;
            	$scope.token = response.data.data['auth-token'];
            	$cookieStore.put('name',$scope.username);
            	$cookieStore.put('token',$scope.token);
            	//alert("Welcome "+user.name);
            	console.log($scope.token);
            	$scope.myValue = true;
            	$scope.showpostad= true;
            	$scope.hideme = true;
            	$('#myModal1').modal('hide');
             	//$location.path('/userpage');
            	//$scope.$apply();
            }  
		},function errorCallback(response) {
			
			$scope.error_msg = response.data.data.error;
			console.log('hi'+$scope.error_msg);
		} );
		}
		}
	}
	$scope.getAllCategories = function() {			
		$scope.categories = [];
		 var url = 'http://10.20.14.83:9000/categories';
			$http.get(url).success(function(data, status) {
				angular.forEach(data, function(value, key) {

					angular.forEach(data.data, function(value, key) {
					angular.forEach(data.data.itemList, function(value, key) {
				
						$scope.categories.push({name:value.name});
					});
					});
				});
			});
	};
	
	$scope.getAllCategories();
	$scope.searching = function() {			
		$scope.search_prod = [];
		var sel_url = $scope.selected_category;
		$scope.price_sort = 'price';
		if($scope.selected_price=='LtoH'){
			$scope.price_sort = 'price';
		}
		else{
			$scope.price_sort = '-price';
		}
		var text_sel = $scope.text_filter;
		$scope.photo_output
		if(text_sel!=null){
			 var url = 'http://10.20.14.83:9000/posts/search/text?searchText='+text_sel;
				$http.get(url).success(function(data, status) {
					
						angular.forEach(data.data.advertiseList, function(value, key) {
					        if(value.photos== null || value.photos=='')
					        	$scope.photo_output = 'images/products/1.jpg';
					        else
					        	$scope.photo_output = 'data:image/jpeg;base64,'+ value.photos;
							$scope.search_prod.push({category:value.category,
								name:value.name,
								price:value.price,
								img_photo:$scope.photo_output,title:value.title,productid:value.postId});
							});
						
						});
						}
					
		
		else{
			if(sel_url!='none'){
				var url='http://10.20.14.83:9000/posts/search?category='+sel_url;
				$http.get(url).success(function(data, status) {
					
						angular.forEach(data.data.advertiseList, function(value, key) {
							 if(value.photos== null || value.photos=='')
						        	$scope.photo_output = 'images/products/1.jpg';
						        else
						        	$scope.photo_output = 'data:image/jpeg;base64,'+ value.photos;
							$scope.search_prod.push({category:value.category,name:value.name,price:value.price,img_photo:$scope.photo_output,title:value.title,productid:value.postId});
						});
						});
				
				 
			}else{
				var url = 'http://10.20.14.83:9000/posts/search';
				$http.get(url).success(function(data, status) {
					
						angular.forEach(data.data.advertiseList, function(value, key) {
							if(value.photos== null || value.photos=='')
					        	$scope.photo_output = 'images/products/1.jpg';
					        else
					        	$scope.photo_output = 'data:image/jpeg;base64,'+ value.photos;
							$scope.search_prod.push({category:value.category,name:value.name,price:value.price,img_photo:$scope.photo_output,title:value.title,productid:value.postId});
						});
				});
			}
			
		}
		
	};
	$scope.searching_user = function(){
		$scope.search_prod_user=[];
		$scope.photo_output1;
		$http({
			method : 'GET',
			url : 'http://10.20.14.83:9000/posts',
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://10.20.14.83:9000',
					'auth-token': $scope.token
			}
			
		}).then(function successCallback(response) {
			//alert('searching done');
			angular.forEach(response.data,function(value,key){
				angular.forEach(response.data.data,function(value,key){
					angular.forEach(response.data.data.mypostList, function(value,key){
						 if(value.photos== null || value.photos=='')
					        	$scope.photo_output1 = 'images/products/1.jpg';
					        else
					        	$scope.photo_output1 = 'data:image/jpeg;base64,'+ value.photos;
						$scope.search_prod_user.push({title:value.title,category:value.category, price:value.price,img_photo:$scope.photo_output1,postid:value.id});
					})
				})
			})
		}, function errorCallback(response) {
			alert('error');

		});
	}
	$scope.post_ad = function(){
		console.log($scope.token);
		if($scope.token==''){
			alert("Please login");	
		}
		else{
			alert('Proceed to post ad');
		}
	};
	$scope.post_ad_submit = function(){
		$scope.image_post;
		var file = document.querySelector('input[type=file]').files[0];
		var reader = new FileReader();
		reader.addEventListener('load', function(){
			$scope.image_post = reader.result.substr(reader.result.indexOf(',')+1);
			console.log($scope.image_post);
		}, false);
		if(file){
			reader.readAsDataURL(file);
		}
		console.log($scope.title,$scope.selected_category,$scope.description,$scope.price,$scope.token);

		$http({
			method : 'POST',
			url : 'http://10.20.14.83:9000/postAd',
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://10.20.14.83:9000',
				'auth-token': $scope.token
			},
			data : {				
				title: $scope.title,
				name: 'ABCDE',
				category: $scope.selected_category,
				description: $scope.description,
				price: $scope.price,
				photoCount: 1,
				photo1: $scope.image_post
			}
		}).then(function successCallback(response) {            
//            	alert(response.data.data.postId);
//            	alert('Advertisement posted successfully');
			
			$scope.hidep = false;
			$scope.errormsgpostad  = "Advertisement posted succesfully";
            }, function errorCallback(response) {
    			//alert('Advertisement not posted successfully'+response.data.data.errormsg);
            	$scope.hidep = false;
                //$scope.errormsgpostad  = 'Advertisement not posted successfully. Please enter all form fields';
    		} 
		);
	};
	$scope.postad_del = function(id){
		
		$http({
			method : 'DELETE',
			url : 'http://10.20.14.83:9000/post?postId='+id ,
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://10.20.14.83:9000',
				'auth-token': $scope.token
			},
			
		}).then(function successCallback(response) {
			//alert('Deleted');
			//$location.path('/login_user')
			$route.reload();
		}, function errorCallback(response) {
			alert('Not deleted');

		});
	}
	
	$scope.logout_user= function(){
		$http({
			method : 'DELETE',
			url : 'http://10.20.14.83:9000/logout',
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://10.20.14.83:9000',
				'auth-token': $scope.token
			},
			
		}).then(function successCallback(response) {
			console.log($scope.token);
			$scope.token = null;
			$scope.username = null;
			$cookieStore.put('token', null);
			$scope.myValue = false;
			$scope.showpostad= false;
			$scope.hideme = false;
            $location.path('#/');
		},function errorCallback(response) {
			alert('Not able to logout');

		} 

		);
	}
};

myModel.controller('WebController', WebController);

myModel.config(function($routeProvider){
	$routeProvider
		.when('/', {
			controller: 'WebController',
			templateUrl: 'Home.html'
		})
		.when('/search', {
			controller: 'WebController',
			templateUrl: 'Search.html'
		})
		.when('/login_user', {
			controller: 'WebController',
			templateUrl: 'loginuser.html'
		})
		
		.otherwise({redirectTo: '/'})
});
