angular.module('absensiApp', ['ionic', 'satellizer', 'ionic-sidemenu-overlaying'])
.run(function($ionicPlatform, $rootScope, $window, $location, $http, constant, $ionicLoading) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });

    $rootScope.currentUser = JSON.parse(localStorage.getItem('user'));

    if ($rootScope.currentUser.profile_picture != null) {
        $http.get(constant.API_URL+'images/'+$rootScope.currentUser.profile_picture, {
            responseType: 'arraybuffer'
        })
        .then(function(response){
            $ionicLoading.hide();
            var imageBlob = new Blob([response.data], { type: response.headers('Content-Type') });
            $rootScope.profilePicture = (window.URL || window.webkitURL).createObjectURL(imageBlob);

        }).catch(function(response){
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Error',
                template: 'Maaf, server sedang mangalami gangguan'
            });
        });
    }
   

    $rootScope.logout = function(){
        $window.localStorage.clear();
        $location.path('/');
    }

    $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {

            if(toState.cssFileName) {
                $rootScope.customCss = 'css/'+toState.cssFileName;
            } else {
                $rootScope.customCss = '';
            }

            if(toState.tab) {
                $rootScope.tab = toState.tab;
            } else {
                $rootScope.tab = false;
            }

    });

})
.constant('constant', {
    API_URL : 'http://localhost:8000/api/'
})
.config(function($stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $ionicConfigProvider) {

    $authProvider.loginUrl = 'http://localhost:8000/api/login';

    $ionicConfigProvider.tabs.position('bottom');

    $httpProvider.interceptors.push(function($q) {
        return {
            'request': function(config) {
                 return config;
            },
         
            'response': function(response) {
                return response;
            }
        };
    });

    $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'AuthUserCtrl',
        cssFileName : 'login.css'
    })

    .state('login-recent', {
        url: '/login-recent',
        templateUrl: 'templates/login-recent-account.html',
        controller: 'AuthUserCtrl',
        cssFileName : 'login.css'
    })

    .state('login-password', {
        url: '/login-password/:username',
        templateUrl: 'templates/login-password.html',
        controller: 'AuthPassCtrl',
        cssFileName : 'login.css'
    })

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html'
    })

    .state('app.home', {
        url: '/home',
        tab: true,
        views: {
            'home-tab': {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            }
        }
    })

    .state('app.recent', {
        url: '/recent',
        tab: true,
        views: {
            'recent-tab': {
                templateUrl: 'templates/recent.html',
                controller: 'RecentCtrl'
            }
        }
    })
    
    .state('app.page', {
        url: '/page',
        views: {
            'page': {
                templateUrl: 'templates/page.html',
                controller: 'PageCtrl'
            }
        }
    })

    .state('app.sub-page', {
        url: '/sub-page/:name',
        views: {
            'menuContent': {
                templateUrl: 'templates/sub-page.html',
                controller: 'SubPageCtrl'
            }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
});
