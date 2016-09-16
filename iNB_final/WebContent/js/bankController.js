var testModule = angular.module('bankingApp',['ngRoute','ngCookies']);

var Myuser;


function checkPassword(){
	var pwd = document.getElementById("pswd").value;
	var con_pwd = document.getElementById("pswd2").value;
	if(pwd != con_pwd)
	{
//	     document.getElementById("l_pwd").innerHTML = "The two values must be same";
		//alert("passwords do not match");
		
		
		//$rootScope.changepass_error = false;
		//$rootScope.changepass_error_msg = "Passwords do not match";		
		document.getElementById('samealert').innerHTML = "The two values must be same";
	}
	}
testModule.directive('ngFiles', ['$parse', function ($parse) {

    function fn_link(scope, element, attrs) {
        var onChange = $parse(attrs.ngFiles);
        element.on('change', function (event) {
            onChange(scope, { $files: event.target.files });
        });
    };

    return {
        link: fn_link
    }
} ]);




testModule.service('bankServices', function($http,$cacheFactory,$rootScope, $cookieStore,$location,$route) {
	
	this.adminLoginF = function(user,pass)
	{
		 $http({
			 				
			    method : 'PUT',
			    
				url : 'http://10.20.14.83:9000/admin/login',
				headers : {
					'Content-Type' : 'application/json',
					'Access-Control-Allow-Origin': 'http://10.20.14.83:9000'
				},
				data : {
					userName : user,
					password : pass,
				}
			    }).then(function successCallback(response) {
				var data = response.data;
				if(response.data != null) {
					
					   
					var data = response.data;
					if(response.data.message == "Invalid Credentials") {
					//alert(response.data.message);
						$rootScope.admin_error = false;
						$rootScope.error_msg= "Invalid Credentials";
					} else {
						//alert("Welcome Admin");
						   //console.log(data);
						   $rootScope.admin_error = true;
				           $cookieStore.put("adminId", data.id);
				           $cookieStore.put("status", true);
				       	   $cookieStore.put("current",'admin');
				       	   
				       	   //$cookieStore.put("status1", false);*/
				                   
						  
						   $location.path('\adminDash');
						   $('#adminLoginModal').modal('hide');
						   //console.log(data.data['auth-token']);
					  }				   
					
				} 	
			}, function errorCallback(response) {
				//alert("Server Error. Try After Some time: " + response);

			});
	        
	}
	this.getAllManagers = function()
	{
		$http({
		    method : 'GET',
		    
			url : 'http://10.20.14.83:9000/branchmanager',

			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://10.20.14.83:9000'
			},
		    }).then(function successCallback(response) {
			var data = response.data;
			var managers = [];
			if(response.data != null) {
				angular.forEach(data, function(value, key) {	
					managers.push({address: value.address, branch : value.branch,id : value.id,firstName : value.firstName, email: value.email, dateOfBirth: value.dateOfBirth,userName: value.userName, phone: value.phone, password : value.password, login: value.login, lastName : value.lastName});				
				});
				$rootScope.managers = managers;
				  // console.log($rootScope.managers);
				   $location.path('\manager');  
				
			} else {
				//alert('Please enter the correct credentials');
			}		
		}, function errorCallback(response) {
			//alert("Server Error. Try After Some time: " + response);

		});

		
		
	}
	
	
	
	this.changePasswordF=function(customerId,newPassword)
	{
		
		 $http({
			 	
			 
		 		

			    method : 'PUT',
			    
				url : 'http://10.20.14.83:9000/registeredcustomer/changepassword',
				headers : {
					'Content-Type' : 'application/json',
					'Access-Control-Allow-Origin': 'http://10.20.14.83:9000'
				},
				data : {
					customerId : customerId,
					newPassword : newPassword
				}
			    }).then(function successCallback(response) {
				var msg = response.data.Success;
				$cookieStore.put(customerId,"Changed");
				//alert(msg);
				$('#changePasswordModal').modal('hide');
				$location.path('/userDash');
			}, function errorCallback(response) {
				//alert("Server Error. Try After Some time: " + response);

			});



	}

	
	
	this.adminLogoutF = function()
	{
		 $http({
			 	
			   
			 		

			    method : 'PUT',
			    
				url : 'http://10.20.14.83:9000/admin/logout',
				headers : {
					'Content-Type' : 'application/json',
					'Access-Control-Allow-Origin': 'http://10.20.14.83:9000'
				},
				data : {
					'role' : 'admin',
					'id' : $cookieStore.get("adminId")
				}
			    }).then(function successCallback(response) {
			    	var data = response.data;
					if(response.data.logoutMsg == "Successfully Logged Out") {
						$cookieStore.remove("adminId");
						//alert("Successfully Logged Out");
						   $cookieStore.put("status", false);
				       	  // $cookieStore.put("statusL", true);
						   $location.path('/');
				                     
						   //console.log(data);
						   //console.log(data.data['auth-token']);
						
					} else {
						//alert("logout failed");
					}		

			}, function errorCallback(response) {
				//alert("Server Error. Try After Some time: " + response);

			});
	        
	}
	
	
	this.cusLogout = function(){
		$cookieStore.put("status", false);
		$cookieStore.remove("userName");
		$cookieStore.remove("userId");
		 $location.path('/');
	}
	
	this.getBranches = function(){
		$rootScope.branches = [];
		 var url = 'http://10.20.14.83:9000/branch';
			$http.get(url).success(function(data, status) {
				angular.forEach(data, function(value, key) {					
					$rootScope.branches.push({code: value.ifscCode, branchn: value.branchName, brancha : value.address, branchc: value.contact});				
				});
				$location.path('/allBranch');
				//console.log($rootScope.branches);
			});
	}
	
	this.getBranches1 = function(){
		$rootScope.branches = [];
		 var url = 'http://10.20.14.83:9000/branch';
			$http.get(url).success(function(data, status) {
				angular.forEach(data, function(value, key) {					
					$rootScope.branches.push({code: value.ifscCode, branchn: value.branchName, brancha : value.address, branchc: value.contact});				
				});
				
				//console.log($rootScope.branches);
			});
	}
	

	this.createBranch = function(code,b_name,b_addr,b_con){
			$http({
				method : 'POST',
				url : 'http://10.20.14.83:9000/branch',

				headers : {
					'Content-Type' : 'application/json',
					'Access-Control-Allow-Origin': 'http:///10.20.14.83:9000'
				},
				data : {				
					ifscCode: code,
					branchName: b_name,
					address: b_addr,
					contact: b_con
				}
			}).then(function successCallback(response) {
				var data = response.data;
				//console.log(data);
				$rootScope.branchreg_success = false;
				$rootScope.branchreg_success_msg = "New branch created successfully";
			}, function errorCallback(response) {
				//alert("Not created");
				$rootScope.branchreg_success = false;
				$rootScope.branchreg_success_msg = "New branch not created";
			});
		}
	
	
	this.accountholderRegister = function(firstname,lastname,email,phone,address,dob,b_name,acc_type){
		var acc_type1;
		var dateofbirth =dob.getTime();
		if(acc_type=='Savings account')
			acc_type1 = "SAVINGACCOUNT";
		if(acc_type=='Current account')
			acc_type1 = "CURRENTACCOUNT";
		var branchDetails;
		//console.log($rootScope.branches);
		for(i in $rootScope.branches){
			if(b_name==$rootScope.branches[i].branchn){
				branchDetails={'ifscCode':$rootScope.branches[i].code, 'branchName':$rootScope.branches[i].branchn, 'address': $rootScope.branches[i].brancha, 'contact': $rootScope.branches[i].branchc}
			}
		}
		console.log(branchDetails);
		$http({
			method : 'POST',
			url : 'http://10.20.14.83:9000/unregistereduser',

			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http:///10.20.14.83:9000'
			},
			data : {				
				firstName: firstname,
				lastName:lastname,
			    email: email,
			    phone: phone,
			    address: address,
			    dateOfBirth: dateofbirth,
			    branchPOJO: branchDetails,
			    account:{
			    	accountType : acc_type1
			    }
			}
		}).then(function successCallback(response) {
			var data = response.data;
			$rootScope.userreg_success = false;
			$('#userRegisterModal').modal('hide');
			$rootScope.userreg_success_msg ="Registered Successfully Application Status is "+ response.data.applicationStatus;
			$rootScope.email = email;
		
			//console.log(data);
		}, function errorCallback(response) {
			//alert("Not registered");
			$rootScope.userreg_error = false;
			$rootScope.userreg_error_msg = "Not Registered, Please enter all fields correctly";
		});
	}
	
	
	
	
	this.getBalanceF=function(customerId)
	{
		
		var url='http://10.20.14.83:9000/registeredcustomer/account/'+customerId;
		$http({
		 	
			 
	 		

		    method : 'GET',
		    
			url : url,
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://10.20.14.83:9000'
			}
		    }).then(function successCallback(response) {
			var msg = response.data;
			$cookieStore.put("flag", true);
			//alert("accountType- "+response.data[0].accountType+" accountNumber- "+response.data[0].accountNumber+" balance- "+response.data[0].balance+" interestRate- "+response.data[0].interestRate);
				
		}, function errorCallback(response) {
			//alert("Server Error. Try After Some time: " + response);

		});

	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	this.userLoginF = function(user,pass,brnch)
	{
	
		if($cookieStore.get(user)==3)
			{
			alert("You are Blocked. Contact Your Branch Manager");
			}
		else
			{
		 $http({
			 				
			    method : 'PUT',
			    
				url : 'http://10.20.14.83:9000/registeredcustomer',
				headers : {
					'Content-Type' : 'application/json',
					'Access-Control-Allow-Origin': 'http://10.20.14.83:9000'
				},
				data : {
					userName : user,
					password : pass,
					branchName:brnch
				}
			    }).then(function successCallback(response) {
			    	
			    	
				if(response.data.firstName != null) {
					z=0;
					$rootScope.customer_error= true;
							  //alert("Welcome "+response.data.firstName);
							 
							  $cookieStore.put(user, 0);
							   
								  
						var user = response.data;
						Myuser = user;
					   $rootScope.userData = user;
					   console.log( $rootScope.userData);
					   $cookieStore.put("userId", response.data.id);
			           $cookieStore.put("status", true);
			           $cookieStore.put("userName", response.data.firstName);
			           $cookieStore.put("customerId", response.data.customerId);
			       	   $cookieStore.put("current",'user');
			       	   $rootScope.cAccount = user.accounthash[0].accountNumber;
			       	   console.log("$rootScope.userData.accountNumber = " + user.accounthash[0].accountNumber);
			       	$('#customerLoginModal').modal('hide');
			       	var chk=$cookieStore.get(response.data.customerId);
			       	
			       	
			       	if(chk=="Changed")
			       	   $location.path('/userDash');	                     
			       	else{
			       		$('#changePasswordModal').modal({
					        show: 'true'
					    });	
			       		
			       	}
			       	  
			       		
					
				} else {	
					$rootScope.customer_error = false;
					$rootScope.customer_error_msg= "Invalid Credentials";
					//alert('Please enter the correct credentials');
					if($cookieStore.get(user)!=null)
						{
						var p=$cookieStore.get(user);
						p++;
						$cookieStore.put(user, p);
						}
					else
						$cookieStore.put(user, 0);
										
				}		
			}, function errorCallback(response) {
				//alert("Server Error. Try After Some time: " + response);

			});
	        
	}
	
	}
	
	this.branchMangerLogin = function(username,password,branch)
		{
		
		     
			 $http({
				 				
				    method : 'PUT',
				    
					url : 'http://10.20.14.83:9000/branchmanager/login',
					headers : {
						'Content-Type' : 'application/json',
						'Access-Control-Allow-Origin': 'http://10.20.14.83:9000'
					},
					data : {
						userName : username,
						password : password,
						branchName: branch
					}
				    }).then(function successCallback(response) {
					var data = response.data;
					//console.log('++++++++++'+data);
					if(response.data.Exception == "USERNAME OR PASSWORD INCORRECT/"+username) {
						$rootScope.bm_error = false;
						$rootScope.bm_error_msg = "Invalid Credentials";
						//alert("USERNAME OR PASSWORD INCORRECT");
				           
						   //$location.path("/");	
					} else {
						//$cookieStore.put("branchManagerId", data.id);
						$cookieStore.put("bmName", data.userName);
						 $cookieStore.put("bmId", data.id);
				           $cookieStore.put("status", true);
				       	   $cookieStore.put("current",'bm');  
						$('#bmLoginModal').modal('hide');
						   $location.path('/bmDash');
						   
						   //alert("branch manager logged in");
				        
						   //console.log(data.id);
						   //console.log(data.userName);
						  // console.log(data.password);
						   
					}		
				}, function errorCallback(response) {
					//alert("Server Error. Try After Some time: " + response);

				});
		        
		}
	
	
	this.newUserDetails=function(){
		  
        $http.get('http://10.20.14.83:9000/unregistereduser/details').then(function successCallback(response){
	       var data = response.data;
	      $rootScope.userList=new Array(); 
        angular.forEach(data, function(value, key) 
             {
           if(value.applicationStatus=="Rejected")
         	  {}
           else
         	  {
     	        a={id:value.id,firstname:value.firstName,lastname:value.lastName,email:value.email,phone:value.phone,address:value.address};
                 $rootScope.userList.push(a);
                 //console.log(a);
         	  } 
             });
 }, function errorCallback(response) {
     // Request error
    // alert("Server Error. Try After Some time: " + response);
     
 });
	}
	
	
	
	
	this.bmLogout=function()
	{
		$http({
		 	
			   
	 		

		    method : 'PUT',
		    
			url : 'http://10.20.14.83:9000/branchmanager/logout',
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://10.20.14.83:9000'
			},
			data : {
				'role' : 'branchmanager',
				'id' : $cookieStore.get("bmId")
			}
		    }).then(function successCallback(response) {
		    	var data = response.data;
				if(response.data.logoutMsg == "Successfully Logged Out") {
					  $cookieStore.remove("bmId");
					//alert("Successfully Logged Out");
					   $cookieStore.put("status", false);
					   $cookieStore.remove("bmName");
			       	  // $cookieStore.put("statusL", true);
					   $location.path('/');
			                     
					   //console.log(data);
					   //console.log(data.data['auth-token']);
					
				} else {
					//alert("logout failed");
				}		

		}, function errorCallback(response) {
			//alert("Server Error. Try After Some time: " + response);

		});	

	}
	
	
	this.approveUserF=function(userId,userStatus)
	{
		
		var url='http://10.20.14.83:9000/unregistereduser/email/'+userId+'/'+userStatus;
		$http({
				
			    method : 'PUT',
			    
				url : url,
				headers : {
					'Content-Type' : 'application/json',
					'Access-Control-Allow-Origin': 'http://10.20.14.83:9000'
				}
			    }).then(function successCallback(response) {
			     	if(userStatus=='reject')
			     		{
			     		$('#rejectionModal').modal({
					        
			     			"show": 'true'
						  });
			     		}
			     	else
			     		{
			     		
			     		 $('#approvalModal').modal({
						        
			     			"show": 'true'
						  }); 
			     		
			    }
			     	//$route.reload();
						
			}, function errorCallback(response) {
				alert("Server Error. Try After Some time: " + response);

			});
		
		
	}
	
	
	this.getFilesF=function(userId)
	{
		
		var url='http://10.20.14.83:9000/addressproofdocument/'+userId;
		$http({
		 	
			 
	 		

		    method : 'GET',
		    
			url : url,
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://10.20.14.83:9000'
			}
		    }).then(function successCallback(response) {
			var msg = response.data;
			 $('#getDocModal').modal({
			        show: 'true'
			    }); 
			
			    
				document.getElementById('myImage').src="data:image/png;base64,"+msg;
		}, function errorCallback(response) {
			alert("Server Error. Try After Some time: " + response);

		});

	}
	

	
	this.bmReg = function(bmName, bmpass , bmfname , bmlname,  bmemail, bmphone, bmaddress, bmdob, bmBranch){
		var dob =  bmdob.getTime();
		//console.log(bmName, bmpass , bmfname , bmlname , bmemail, bmphone, bmaddress, dob, bmBranch);
		var branchDetails;
		//console.log($rootScope.branches);
		for(i in $rootScope.branches){
			if(bmBranch==$rootScope.branches[i].branchn){
				branchDetails={'ifscCode':$rootScope.branches[i].code, 'branchName':$rootScope.branches[i].branchn, 'address': $rootScope.branches[i].brancha, 'contact': $rootScope.branches[i].branchc}
			}
		}
		//console.log(branchDetails);
		$http({
		 	
			
			method : 'POST',
		    url : 'http://10.20.14.83:9000/branchmanager',
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://10.20.14.83:9000'
			},
			data : {
				
				
				'userName' : bmName,
				'password' :bmpass ,
				'firstName' : bmfname,
				'lastName' : bmlname,
				'email' :bmemail ,
				'phone' :bmphone ,
				'address' : bmaddress,
				'dateOfBirth' : dob,
				 "branchPOJO": branchDetails
			    
				
			}
		    }).then(function successCallback(response) {
			var data = response.data;
			if(response.data != null) {
				 //console.log(response.data);
				 $rootScope.bmreg_success = false;
				 $rootScope.bmreg_success_msg= "Branch manager registered successfully";
				   //console.log(data.data['auth-token']);
				
			} else {
				 $rootScope.bmreg_success = false;
				 $rootScope.bmreg_success_msg = "Branch manager not registered";
				//alert('Please enter the correct credentials');
			}		
		}, function errorCallback(response) {
			//alert("Server Error. Try After Some time: " + response);

		});
		
	}
	
	
	this.transferMoneyF = function(client,receiver,amount)
	{
		 $http({
			 	
			 
			 		

			    method : 'PUT',
			    
				url : 'http://10.20.14.83:9000/registeredcustomer/transfer',
				headers : {
					'Content-Type' : 'application/json',
					'Access-Control-Allow-Origin': 'http://10.20.14.83:9000'
				},
				data : {
					"clientAccount":client, "recevierAccount":receiver, "amount":amount
				}
			    }).then(function successCallback(response) {
				var msg = response.data.Message;
				$rootScope.moneytransfer_success = false;
				$rootScope.moneytransfer_success_msg = msg;
					//alert(msg);
			}, function errorCallback(response) {
				alert("Server Error. Try After Some time: " + response);

			});
	        
	}

	this.uploadFilesF=function(email)
	{
		 var formdata = new FormData();
    	 var myfile = document.getElementById('file2').files[0];
    	 //var myfile = $scope.file2;
    	 console.log("file2: " + myfile);
    	 formdata.append("addressProof", myfile);
    	 formdata.append("ageProof", myfile);
    	 formdata.append("email", email);
    	 //var myurl = 'http://10.20.14.83:9000/document?addressProof='+formdata.get("addressProof")+'&ageProof='+formdata.get("ageProof")+'&email=saxenakartik007@gmail.com';
    	 //var myurl = 'http://10.20.14.83:9000/document?email=saxenakartik007@gmail.com';
    	 var myurl = 'http://10.20.14.83:9000/document';
         
         var request = {
                 method: 'POST',
                 url: myurl,
                 data:formdata,
//                 transformRequest: function(data, headersGetterFunction) {
//                     return data; // do nothing! FormData is very good!
//                 },
                 transformRequest: angular.identity,
                 headers: {
                     'Content-Type': undefined,
                 	'Access-Control-Allow-Origin': 'http://10.20.14.83:9000/'
                 }
             };

             // SEND THE FILES.
             $http(request).then(function successCallback(response) {
            	 $rootScope.uploaddoc_success = false;
            	 $rootScope.uploaddoc_success_msg = "Documents are uploaded and User registered successfully.";
            	// alert(response.data.Message);
			//console.log(response);
				
					
			});
			
		
		
	}
	
	
	
	
	
	
	this.getDet = function()
	{
		$rootScope.userData = Myuser;
		 $cookieStore.put("flag", false);
		//console.log($rootScope.userData);
	}
	
	this.getBalanceF=function(customerId)
	{
		
		var url='http://10.20.14.83:9000/registeredcustomer/account/'+customerId;
		$http({
		 	
			 
	 		

		    method : 'GET',
		    
			url : url,
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://10.20.14.83:9000'
			}
		    }).then(function successCallback(response) {
			var msg = response.data;
			 $cookieStore.put("flag", true);
			//alert("accountType- "+response.data[0].accountType+" accountNumber- "+response.data[0].accountNumber+" balance- "+response.data[0].balance+" interestRate- "+response.data[0].interestRate);
			$rootScope.userDa=response.data[0];	
		}, function errorCallback(response) {
			alert("Server Error. Try After Some time: " + response);

		});

	}


});

var bankController = function($scope,$rootScope, $location, $route, $cookieStore,bankServices) {
	
	
	
	
	function readURL(input) {
		 if (input.files && input.files[0]) {
		        var reader = new FileReader();

		        reader.onload = function (e) {
		            $('#upload_preview').attr('src', e.target.result);
		        }

		        reader.readAsDataURL(input.files[0]);
		  }
		}
			$("#file2").change(function () {
			    readURL(this);
			});

	
	
	
	
	
	
	$rootScope.admin_error = true;
	$rootScope.customer_error = true;
	$rootScope.bm_error = true;
	$rootScope.userreg_success = true;
	$rootScope.userreg_error = true;
	$rootScope.bmreg_success = true;
	$rootScope.branchreg_success = true;
	$rootScope.uploaddoc_success = true;
	
	$rootScope.moneytransfer_success = true;
	
    $scope.adminLogin = function() {
    	//document.getElementById("#adminLoginModal").style.display = 'none';
//    	$('#adminLoginModal').modal('hide');
    	//$('#adminLoginModal').hide();
        $scope.adminLogin1();
	}
    $scope.adminLogin1 = function() {
    	bankServices.adminLoginF($scope.user, $scope.pass);
    }
    $scope.adminLogout = function() {
    	
    	
        bankServices.adminLogoutF();
    }
    $scope.myDetails=function()
    {
    	bankServices.myDetailsF();
    	
    }
    $scope.getStatus = function()
    {
    	return $cookieStore.get("status");
    }
    
    $scope.getFlag = function()
    {
    	return $cookieStore.get("flag");
    }
    $scope.contactUs = function()
    {
    	$location.path("/contact");
    }
    
    $scope.aboutUs = function()
    {
    	$location.path("/about");
    }
    $scope.terms = function()
    {
    	$location.path("/terms");
    }
    
   
    $scope.accDetails = function()
    {
    	
    	bankServices.getDet();
    	
    }
    
    /*$scope.getStatus1 = function()
    {
    	
    	return $cookieStore.get(status1);
    }*/
    
    
    $scope.getManagers = function()
    {
    	
    	bankServices.getAllManagers();
    }
    
    //$scope.getManagers();
    $scope.createBm = function()
    {
    	
    	bankServices.bmReg($scope.bmName, $scope.bmpass , $scope.bmfname , $scope.bmlname, $scope.bmemail, $scope.bmphone, $scope.bmaddress, $scope.bmdob,$scope.bmBranch);
    }
    $scope.createBranch = function(){
		bankServices.createBranch($scope.code,$scope.branch_name,$scope.branch_address,$scope.branch_contact);
	}
    
    $scope.getBranches = function(){
		
		bankServices.getBranches();
	}
 $scope.getBranches1 = function(){
		
		bankServices.getBranches1();
	}
 $scope.accountholderRegister= function(){
		
		bankServices.accountholderRegister($scope.firstname,$scope.lastname,$scope.email,$scope.phone,$scope.address,$scope.dob,
				$scope.branchname,$scope.acc_type);
	}
   $scope.branchManagerLogin = function() {
	    bankServices.branchMangerLogin($scope.bmUser, $scope.bmPass,$scope.bmBranch);
	}
   
   $scope.userdetails=function(){	
       bankServices.newUserDetails();
	}
   $scope.userdetails();
   
   $scope.approveUser=function(idCustomer)
   {
	   
	   //console.log(idCustomer);
   	var id = idCustomer;
   	//id='57d2749e02723d0435ecd027';
   	var status = 'verify';
   	 bankServices.approveUserF(id, status);	

   }
   $scope.rejectUser=function(idCustomer)
   {
		var id = idCustomer;
	   	
	   	var status = 'reject';
	   	 bankServices.approveUserF(id, status);	  
	   
   }
   $scope.userLogin = function() {
	    bankServices.userLoginF($scope.username, $scope.password,$scope.branch);
   }
   
  
   $scope.logout = function()
   {
	   
	   var log = $cookieStore.get('current');
	  // console.log(log);
	   switch(log)
	   {
	      case  'admin':
		  bankServices.adminLogoutF();
		  break;
	      
	      case  'user':
		  bankServices.cusLogout();
		  break;
		  
	      case  'bm':
		  bankServices.bmLogout();
		  break;
	   
	   
	   }
	   
   }

   
   $scope.getBalance=function(customerId)
   {
   	//Comment this in compiling
   	customerId=customerId;
   	bankServices.getBalanceF(customerId);	
   }
   
   $scope.getBm = function()
   {
	   return $cookieStore.get("bmName");
	   
   }
   
   $scope.getUser = function()
   {
	   return $cookieStore.get("userName");
	   
   }
   
   $scope.transferMoney=function()
	{
		var clientAccount=$scope.cAccount;
		var receiverAccount=$scope.rAccount;
		var ammount=$scope.amount;
		bankServices.transferMoneyF(clientAccount,receiverAccount,ammount);
		
	}
   
   $scope.changePassword=function()
   {
	   
	   
   	bankServices.changePasswordF($cookieStore.get('customerId'),$scope.myNewPassword);	

   }
   $scope.uploadFiles=function(email)
	{
		bankServices.uploadFilesF(email);	
		
	}
   
   $scope.getFiles=function(userId)
   {
   	
   	bankServices.getFilesF(userId);	
   }
   
   $scope.reload=function()
   {
   	
   	$route.reload();	
   }
   $scope.getCustomerId = function()
   {
	    return $cookieStore.get("customerId");   
   }
   
  $scope.dashboardLink=function(){
	  $location.path('/adminDash');
  } 
   

   /*$scope.showConfirm = function(event) {
       var confirm = $mdDialog.confirm()
          .title('Are you sure you want to reject?')
          .textContent('Record will be deleted permanently.')
          .ariaLabel('TutorialsPoint.com')
          .targetEvent(event)
          .ok('Yes')
          .cancel('No');
          $mdDialog.show(confirm).then(function() {
        	  rejectUser();
             $scope.status = 'rejected!';
             }, function() {
                $scope.status = 'You decided to keep your record.';
          });
    };


    $scope.closeDialog = function() {
                            $mdDialog.hide();
                         }*/



   var today = new Date();
   var minAge = 18;
   $scope.minAge = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
   
};




testModule.controller('BankController',bankController);


testModule.directive('ngNav', function() {
	return {
		restrict: 'E',//E = element, A = attribute, C = class, M = comment		
		controller: bankController,
		templateUrl: 'navbar.html',
		
		link: function(scope, iElement, iAttrs) {
			
		}
	}
});

testModule.directive('ngFoot', function() {
	return {
		restrict: 'E',//E = element, A = attribute, C = class, M = comment		
		controller: bankController,
		templateUrl: 'footer.html',
		
		link: function(scope, iElement, iAttrs) {
			
		}
	}
});



testModule.config(function($routeProvider){

	$routeProvider
	.when('/',{
		
		controller: 'BankController',
		templateUrl: 'home.html'
	})
	.when('/adminDash',{
		
		controller: 'BankController',
		templateUrl: 'adminDash.html'
	})
	.when('/bmDash',{
		
		controller: 'BankController',
		templateUrl: 'bmDash.html'
	})
	
	.when('/manager',{
		
		controller: 'BankController',
		templateUrl: 'allManager.html'
	})
	
	.when('/userDash',{
		
		controller: 'BankController',
		templateUrl: 'userDash.html'
	})
	.when('/contact',{
		
		controller: 'BankController',
		templateUrl: 'contact.html'
	})
	.when('/about',{
		
		controller: 'BankController',
		templateUrl: 'aboutUs.html'
	})
	
	.when('/terms',{
		
		controller: 'BankController',
		templateUrl: 'terms.html'
	})
	.when('/upload',{
		
		controller: 'BankController',
		templateUrl: 'upload_doc.html'
	})
	
	
	.when('/allBranch',{
		
		controller: 'BankController',
		templateUrl: 'allBranch.html'
	})
	.when('/changePassword',{
		
		controller: 'BankController',
		templateUrl: 'changePassword.html'
	})
	
	.otherwise({redirectTo: '/'})

});