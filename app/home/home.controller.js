(function () {
    'use strict';

    angular
        .module('appHome', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/home', {
                templateUrl: 'home/home.view.html',
                controller: 'HomeController'
            });
        }])
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', 'AuthenticationService', '$rootScope', '$location'];
    function HomeController(UserService, AuthenticationService, $rootScope, $location) {
        var vm = this;

        vm.user = null;
        vm.allUsers = [];
        vm.deleteUser = deleteUser;

        initController();

        function initController() {
            loadCurrentUser();
            loadAllUsers();
        };

        function loadCurrentUser() {

            var url = $location.protocol() + "://" + $location.host() + ":8080";

            AuthenticationService.GetUserByUsername($rootScope.id, url, function (response) {

                if (response.success) {
                    var user = { firstName: response.firstName };
                    vm.user = user;
                } else {
                    FlashService.Error(response.message);
                }

            });

        };

        function loadAllUsers() {
            UserService.GetAll()
                .then(function (users) {
                    vm.allUsers = users;
                });
        };

        function deleteUser(id) {
            UserService.Delete(id)
                .then(function () {
                    loadAllUsers();
                });
        };
    }

})();