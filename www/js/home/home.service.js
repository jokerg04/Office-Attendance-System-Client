angular.module('absensiApp')
.service('HomeService', HomeService)
.service('RecentService', RecentService);

function HomeService($http, constant){
	return {
		getLoggedUser : function(){
			return $http.get(constant.API_URL+'get-logged-user')
				.then(function(response){
					return response.data;
				})

		},

        getStatusAbsen : function(){
            return $http.get(constant.API_URL+'get-status-absen')
                .then(function(response){
                    return response.data;
                })

        },

		checkin : function(input){
            return $http.post(constant.API_URL+'checkin', input)
                .then(function(response){
                    return response.data;
                })

        },
        checkout : function(input){
            return $http.post(constant.API_URL+'checkout', input)
                .then(function(response){
                    return response.data;
                })

        },
	}
}

function RecentService($http, constant){
    return {
        getLoggedUser : function(){
            return $http.get(constant.API_URL+'get-logged-user')
                .then(function(response){
                    return response.data;
                })
        }
    }
}